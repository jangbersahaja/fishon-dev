import { sendMail } from "@/lib/email";
import { NextResponse } from "next/server";

// Simple dev-only route to validate SMTP. Guard with EMAIL_TEST_SECRET.
export async function POST(req: Request) {
  const secret = process.env.EMAIL_TEST_SECRET;
  const provided = req.headers.get("x-email-test-secret");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { to } = body as { to?: string };
  const target =
    to || process.env.CAPTAIN_NOTIFICATIONS_EMAIL || process.env.SMTP_USER;
  if (!target) {
    return NextResponse.json(
      { error: "No recipient provided" },
      { status: 400 }
    );
  }
  const html = `<div><p>This is a Fishon SMTP test email.</p><p>Timestamp: ${new Date().toISOString()}</p></div>`;
  try {
    const info = await sendMail({
      to: target,
      subject: "Fishon SMTP test",
      html,
    });
    return NextResponse.json({
      ok: true,
      to: target,
      messageId: info?.messageId,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Send failed", detail: String(err) },
      { status: 500 }
    );
  }
}
