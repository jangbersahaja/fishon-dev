import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { sendMail } from "@/lib/helpers/email";
import { sendWithRetry } from "@/lib/webhooks/webhook";
import { NextResponse } from "next/server";

// Minimal pay endpoint to mark an APPROVED booking as PAID for the owner
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { id } = body as { id?: string };
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  // Only allow transition from APPROVED and for this user
  const result = await prisma.booking
    .updateMany({
      where: { id, userId: session.user.id, status: "APPROVED" },
      data: { status: "PAID" },
    })
    .catch(() => ({ count: 0 }));

  if (!result || result.count === 0) {
    return NextResponse.json(
      { error: "No APPROVED booking for this user" },
      { status: 409 }
    );
  }

  // Fetch updated booking for notifications
  const updated =
    typeof (prisma as any)?.booking?.findUnique === "function"
      ? await (prisma as any).booking
          .findUnique({ where: { id } })
          .catch(() => null)
      : null;

  // Best-effort: email the angler with a simple receipt/confirmation
  try {
    if (updated) {
      const user = await prisma.user.findUnique({
        where: { id: updated.userId },
      });
      if (user?.email) {
        const base =
          process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "";
        const confirmationUrl = `${base}/book/confirm?id=${encodeURIComponent(
          updated.id
        )}`;
        const html = `
        <div>
          <p>Hi ${user.name ?? "there"},</p>
          <p>Your payment for <strong>${
            updated.charterName
          }</strong> has been received. Your booking is confirmed.</p>
          <ul>
            <li>Booking ID: ${updated.id}</li>
            <li>Total: RM ${updated.totalPrice}</li>
            <li>Date: ${updated.date.toISOString().slice(0, 10)}</li>
            ${
              updated.startTime
                ? `<li>Start time: ${updated.startTime}</li>`
                : ""
            }
          </ul>
          <p>View your booking: <a href="${confirmationUrl}">${confirmationUrl}</a></p>
        </div>
      `;
        await sendMail({
          to: user.email,
          subject: "Fishon booking payment received",
          html,
        });
      }
    }
  } catch {}

  // Best-effort: notify Captain app that booking was paid
  try {
    const hookUrl = process.env.CAPTAIN_WEBHOOK_URL;
    const hookSecret = process.env.CAPTAIN_WEBHOOK_SECRET;
    if (hookUrl && hookSecret && updated) {
      const payload = {
        type: "booking.paid",
        booking: {
          id: updated.id,
          captainCharterId: updated.captainCharterId,
          charterName: updated.charterName,
          tripName: updated.tripName,
          date: updated.date.toISOString(),
          startTime: updated.startTime,
          days: updated.days,
          totalPrice: updated.totalPrice,
          status: updated.status,
        },
      };
      sendWithRetry(hookUrl, payload, {
        headers: { "x-captain-secret": hookSecret },
        attempts: 3,
        baseDelayMs: 300,
      });
    }
  } catch {}

  return NextResponse.json({ ok: true });
}
