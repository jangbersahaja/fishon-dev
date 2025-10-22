import { auth } from "@/lib/auth";
import { sendMail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { sendWithRetry } from "@/lib/webhook";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { id, cancellationReason } = body as {
    id?: string;
    cancellationReason?: string;
  };
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  // Only allow cancel for own booking in PENDING or APPROVED states
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking || booking.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (booking.status !== "PENDING" && booking.status !== "APPROVED") {
    return NextResponse.json(
      { error: "Cannot cancel in current status" },
      { status: 409 }
    );
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: "CANCELLED",
      cancellationReason: cancellationReason || null,
    },
  });

  // Notify captain app (best-effort)
  try {
    const hookUrl = process.env.CAPTAIN_WEBHOOK_URL;
    const hookSecret = process.env.CAPTAIN_WEBHOOK_SECRET;
    if (hookUrl && hookSecret) {
      const payload = {
        type: "booking.cancelled",
        booking: {
          id: updated.id,
          captainCharterId: updated.captainCharterId,
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

  // Email angler confirmation (best-effort)
  try {
    const user = await prisma.user.findUnique({
      where: { id: updated.userId },
    });
    if (user?.email) {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "";
      const url = `${base}/booking/${encodeURIComponent(updated.id)}`;
      const html = `<div><p>Hi ${
        user.displayName ?? "there"
      },</p><p>Your booking <strong>${
        updated.id
      }</strong> has been cancelled.</p><p>View: <a href="${url}">${url}</a></p></div>`;
      await sendMail({
        to: user.email,
        subject: "Fishon booking cancelled",
        html,
      });
    }
  } catch {}

  // Optional: temporary captain email fallback
  try {
    const captainEmail = process.env.CAPTAIN_NOTIFICATIONS_EMAIL;
    if (captainEmail) {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "";
      const url = `${base}/booking/${encodeURIComponent(updated.id)}`;
      const html = `<div><p>Booking cancelled by angler</p><ul><li>ID: ${updated.id}</li><li>Charter: ${updated.charterName}</li><li>Status: ${updated.status}</li></ul><p>View: <a href="${url}">${url}</a></p></div>`;
      await sendMail({ to: captainEmail, subject: "Booking cancelled", html });
    }
  } catch {}

  return NextResponse.json({ ok: true });
}
