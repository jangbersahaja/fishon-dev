import { renderStatusEmail, sendMail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Captain app will call this to update booking status to APPROVED or REJECTED
// Security: requires header x-captain-secret === CAPTAIN_WEBHOOK_SECRET
export async function POST(req: Request) {
  const secret = process.env.CAPTAIN_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );
  }
  const provided = req.headers.get("x-captain-secret");
  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { id, status } = body as { id?: string; status?: string };
  if (!id || (status !== "APPROVED" && status !== "REJECTED")) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Only allow transition from PENDING
  const now = new Date();
  const result = await prisma.booking
    .updateMany({
      where: { id, status: "PENDING" },
      data: { status: status as any, captainDecisionAt: now },
    })
    .catch(() => ({ count: 0 }));

  if (!result || result.count === 0) {
    return NextResponse.json(
      { error: "No matching PENDING booking" },
      { status: 409 }
    );
  }

  // Fetch the updated booking for email payloads (best-effort)
  const updated =
    typeof (prisma as any)?.booking?.findUnique === "function"
      ? await (prisma as any).booking
          .findUnique({ where: { id } })
          .catch(() => null)
      : null;

  // Email angler (best-effort)
  try {
    if (updated) {
      const user = await prisma.user.findUnique({
        where: { id: updated.userId },
      });
      if (user?.email) {
        const base =
          process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "";
        const confirmationUrl = `${base}/checkout/confirmation?id=${encodeURIComponent(
          updated.id
        )}`;
        const isApproved = status === "APPROVED";
        const paymentUrl = isApproved
          ? `${base}/pay/${encodeURIComponent(updated.id)}`
          : undefined;
        const html = renderStatusEmail({
          toName: user.displayName ?? undefined,
          charterName: updated.charterName,
          status: status as any,
          paymentUrl,
          confirmationUrl,
        });
        await sendMail({
          to: user.email,
          subject: `Booking ${status.toLowerCase()}`,
          html,
        });
      }
    }
  } catch {}

  return NextResponse.json({ ok: true });
}
