import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();
    const code = String(body?.code || "").trim();
    const newPassword = String(body?.password || "");

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "Email, code, and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 12) {
      return NextResponse.json(
        { error: "Password must be at least 12 characters" },
        { status: 400 }
      );
    }

    // Find valid, unused password reset code
    const verification = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        type: "PASSWORD_RESET",
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 401 }
      );
    }

    // Mark as used
    await prisma.verificationCode.update({
      where: { id: verification.id },
      data: { usedAt: new Date() },
    });

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Reset password error", e);
    return NextResponse.json(
      { error: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}
