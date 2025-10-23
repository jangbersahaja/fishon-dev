import { auth } from "@/lib/auth/auth";
import { sendMail } from "@/lib/helpers/email";
import { prisma } from "@/lib/database/prisma";
import { sendWithRetry } from "@/lib/webhooks/webhook";
import { NextResponse } from "next/server";

function isStaffOrAdmin(role?: string | null) {
  return role === "STAFF" || role === "ADMIN";
}

function hasCaptainSecret(req: Request) {
  const header = req.headers.get("x-captain-api-secret");
  const secret = process.env.CAPTAIN_API_SECRET;
  return Boolean(secret && header && header === secret);
}

export async function POST(req: Request) {
  try {
    const authorizedBySecret = hasCaptainSecret(req);

    let sessionRole: string | undefined;
    if (!authorizedBySecret) {
      const session = await auth();
      sessionRole = (session?.user as any)?.role;
      if (!isStaffOrAdmin(sessionRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json().catch(() => ({}));
    const { id, reason } = body as { id?: string; reason?: string };
    if (!id)
      return NextResponse.json({ error: "id required" }, { status: 400 });

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { error: "Only pending bookings can be rejected" },
        { status: 409 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason: reason || null,
        captainDecisionAt: new Date(),
      },
    });

    // Notify captain app (best-effort)
    try {
      const hookUrl = process.env.CAPTAIN_WEBHOOK_URL;
      const hookSecret = process.env.CAPTAIN_WEBHOOK_SECRET;
      if (hookUrl && hookSecret) {
        const payload = {
          type: "booking.rejected",
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

    // Email angler (best-effort)
    try {
      const user = await prisma.user.findUnique({
        where: { id: updated.userId },
      });
      if (user?.email) {
        const base =
          process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "";
        const url = `${base}/booking/${encodeURIComponent(updated.id)}`;
        const html = `<div><p>Hi ${
          user.name ?? "there"
        },</p><p>Your booking <strong>${updated.id}</strong> was rejected${
          updated.rejectionReason ? `: ${updated.rejectionReason}` : "."
        }</p><p>View: <a href="${url}">${url}</a></p></div>`;
        await sendMail({
          to: user.email,
          subject: "Fishon booking rejected",
          html,
        });
      }
    } catch {}

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("booking.reject error", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
