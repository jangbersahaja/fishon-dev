import { auth } from "@/lib/auth";
import { addDaysUTC, hasConflicts } from "@/lib/booking/overlap";
import { getCharterById } from "@/lib/charter-service";
import { renderBookingCreatedEmail, sendMail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { sendWithRetry } from "@/lib/webhook";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const userId = session.user.id!;
    const {
      charterId, // cuid or numeric string
      tripIndex,
      date, // YYYY-MM-DD
      days,
      adults,
      children,
      startTime,
    } = body as {
      charterId?: string;
      tripIndex?: number;
      date?: string;
      days?: number;
      adults?: number;
      children?: number;
      startTime?: string;
    };

    // Basic validation
    if (!charterId || typeof charterId !== "string") {
      return NextResponse.json(
        { error: "charterId required" },
        { status: 400 }
      );
    }
    const ti = Number.isFinite(tripIndex as number) ? Number(tripIndex) : 0;
    const d =
      typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
        ? new Date(date + "T00:00:00Z")
        : null;
    const ds = Number.isFinite(days as number)
      ? Math.max(1, Math.min(14, Number(days)))
      : 1;
    const ad = Number.isFinite(adults as number)
      ? Math.max(1, Number(adults))
      : 1;
    const ch = Number.isFinite(children as number)
      ? Math.max(0, Number(children))
      : 0;

    if (!d) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    // Ensure local user exists (safety net for legacy OAuth tokens)
    let dbUserId = userId;
    try {
      const canUserQuery =
        typeof (prisma as any)?.user?.findUnique === "function";
      if (canUserQuery) {
        let dbUser = await (prisma as any).user.findUnique({
          where: { id: userId },
        });
        if (!dbUser) {
          const email = (session.user as any)?.email?.toLowerCase?.();
          if (email) {
            dbUser = await (prisma as any).user.findUnique({
              where: { email },
            });
            if (
              !dbUser &&
              typeof (prisma as any)?.user?.create === "function"
            ) {
              const placeholder = randomBytes(16).toString("hex");
              const passwordHash = await bcrypt.hash(placeholder, 10);
              dbUser = await (prisma as any).user.create({
                data: {
                  email,
                  passwordHash,
                  displayName: (session.user as any)?.name ?? undefined,
                },
              });
            }
          }
        }
        if (dbUser?.id) dbUserId = dbUser.id;
      }
    } catch {}

    // Fetch charter snapshot and trip
    const charter = await getCharterById(charterId);
    if (!charter) {
      return NextResponse.json({ error: "Charter not found" }, { status: 404 });
    }
    const trips = Array.isArray(charter.trip) ? charter.trip : [];
    const trip = trips[ti] ?? trips[0];
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 400 });
    }

    // If trip defines start times, require one selection
    const startTimes = Array.isArray(trip.startTimes)
      ? trip.startTimes.map((s: any) => s)
      : [];
    if (startTimes.length > 0) {
      const st = typeof startTime === "string" ? startTime : undefined;
      if (!st || !startTimes.includes(st)) {
        return NextResponse.json(
          { error: "startTime required" },
          { status: 400 }
        );
      }
    }

    const unitPrice = Math.round(Number(trip.price) || 0);
    const totalPrice = unitPrice * ds;
    const captainCharterId = (charter as any).backendId ?? String(charter.id);

    // Hold expires in 12 hours
    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);

    // Availability guard: prevent overlapping bookings for the same charter
    // Multi-day aware: overlaps if existing [start..end] intersects new [d..newEnd]
    // When a trip defines startTimes, conflicts are per startTime; otherwise any overlap blocks.
    const blockingStatuses = ["PENDING", "APPROVED", "PAID"] as const;

    const newStart = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    );
    const newEnd = addDaysUTC(newStart, ds - 1);

    // Fetch candidates in a coarse window: any booking starting on/before newEnd and not too far in the past
    const candidates = await prisma.booking.findMany({
      where: {
        captainCharterId,
        status: { in: blockingStatuses as any },
        date: { lte: newEnd, gte: addDaysUTC(newStart, -31) },
      },
      select: { id: true, date: true, days: true, startTime: true },
    });

    const conflicts = hasConflicts(candidates, newStart, ds, {
      usesStartTimes: startTimes.length > 0,
      selectedStartTime: startTimes.length > 0 ? (startTime as string) : null,
    });

    if (conflicts) {
      return NextResponse.json(
        {
          error:
            "Selected dates/time are no longer available. Please choose a different selection.",
        },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        userId: dbUserId,
        captainCharterId,
        charterName: charter.name,
        location: charter.location,
        tripName: trip.name,
        unitPrice,
        startTime: startTimes.length > 0 ? (startTime as string) : null,
        date: d,
        days: ds,
        adults: ad,
        children: ch,
        totalPrice,
        expiresAt,
      },
    });

    // Outbound webhook to captain app (non-blocking)
    try {
      const hookUrl = process.env.CAPTAIN_WEBHOOK_URL;
      const hookSecret = process.env.CAPTAIN_WEBHOOK_SECRET;
      if (hookUrl && hookSecret) {
        const payload = {
          type: "booking.created",
          booking: {
            id: booking.id,
            captainCharterId: booking.captainCharterId,
            charterName: booking.charterName,
            tripName: booking.tripName,
            startTime: booking.startTime,
            date: booking.date.toISOString(),
            days: booking.days,
            adults: booking.adults,
            children: booking.children,
            totalPrice: booking.totalPrice,
            expiresAt: booking.expiresAt.toISOString(),
            status: booking.status,
          },
        };
        // Best-effort retry
        sendWithRetry(hookUrl, payload, {
          headers: { "x-captain-secret": hookSecret },
          attempts: 3,
          baseDelayMs: 300,
        });
      }
    } catch {}

    // Email the angler (non-blocking best-effort)
    (async () => {
      try {
        const user = await prisma.user.findUnique({ where: { id: dbUserId } });
        if (!user?.email) return;
        const base =
          process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "";
        const confirmationUrl = `${base}/checkout/confirmation?id=${encodeURIComponent(
          booking.id
        )}`;
        const html = renderBookingCreatedEmail({
          toName: user.displayName ?? undefined,
          charterName: booking.charterName,
          date: booking.date.toISOString().slice(0, 10),
          days: booking.days,
          total: booking.totalPrice,
          startTime: booking.startTime,
          confirmationUrl,
        });
        await sendMail({
          to: user.email,
          subject: "Fishon booking request received",
          html,
        });
        // Optional captain notification fallback (until Captain webhook/email is live)
        const captainEmail = process.env.CAPTAIN_NOTIFICATIONS_EMAIL;
        if (captainEmail) {
          const htmlCaptain = `
            <div>
              <p>New booking created.</p>
              <ul>
                <li>ID: ${booking.id}</li>
                <li>Charter: ${booking.charterName}</li>
                <li>Trip: ${booking.tripName}</li>
                <li>Date: ${booking.date.toISOString().slice(0, 10)}</li>
                ${
                  booking.startTime
                    ? `<li>Start time: ${booking.startTime}</li>`
                    : ""
                }
                <li>Days: ${booking.days}</li>
                <li>Total: RM ${booking.totalPrice}</li>
              </ul>
              <p>View: <a href="${confirmationUrl}">${confirmationUrl}</a></p>
            </div>`;
          await sendMail({
            to: captainEmail,
            subject: "New booking created",
            html: htmlCaptain,
          });
        }
      } catch {}
    })();

    return NextResponse.json({ booking }, { status: 201 });
  } catch (e: any) {
    console.error("booking.create error", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
