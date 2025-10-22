import { sendMail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Generate 6-digit TAC
function generateTAC(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, displayName: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Generate TAC for password reset
    const code = generateTAC();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store TAC in database
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        type: "PASSWORD_RESET",
        expiresAt,
      },
    });

    // Send email
    const subject = "Reset Your Fishon Password";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ec2227;">Reset Your Password</h2>
        <p>Hi ${user.displayName || "there"},</p>
        <p>You requested to reset your password. Use this verification code:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
          ${code}
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email and your password will remain unchanged.</p>
      </div>
    `;

    await sendMail({ to: email, subject, html });

    return NextResponse.json(
      { message: "Reset code sent successfully", sentAt: Date.now() },
      { status: 200 }
    );
  } catch (e) {
    console.error("Forgot password error", e);
    return NextResponse.json(
      { error: "Failed to send reset code. Please try again." },
      { status: 500 }
    );
  }
}
