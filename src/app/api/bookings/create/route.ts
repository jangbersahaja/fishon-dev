import { auth } from "@/lib/auth";
import { getCharterById } from "@/lib/charter-service";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
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

    function addDays(date: Date, daysToAdd: number) {
      const dt = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
      );
      dt.setUTCDate(dt.getUTCDate() + daysToAdd);
      return dt;
    }
    const newStart = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    );
    const newEnd = addDays(newStart, ds - 1);

    // Fetch candidates in a coarse window: any booking starting on/before newEnd and not too far in the past
    const candidates = await prisma.booking.findMany({
      where: {
        captainCharterId,
        status: { in: blockingStatuses as any },
        date: { lte: newEnd, gte: addDays(newStart, -31) },
      },
      select: { id: true, date: true, days: true, startTime: true },
    });

    const conflicts = candidates.some((b) => {
      const bStart = new Date(
        Date.UTC(
          b.date.getUTCFullYear(),
          b.date.getUTCMonth(),
          b.date.getUTCDate()
        )
      );
      const bEnd = addDays(bStart, Math.max(1, b.days) - 1);
      const rangesOverlap = bStart <= newEnd && newStart <= bEnd;
      if (!rangesOverlap) return false;
      // If trip uses startTimes, require same time to be a conflict; otherwise any overlap blocks
      if (startTimes.length > 0) {
        return (b.startTime || null) === (startTime || null);
      }
      return true;
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
        userId: session.user.id!,
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

    return NextResponse.json({ booking }, { status: 201 });
  } catch (e: any) {
    console.error("booking.create error", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
