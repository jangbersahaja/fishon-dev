import { prisma } from "@/lib/database/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();
    const code = String(body?.code || "").trim();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    // Find valid, unused TAC
    const verification = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        type: "TAC",
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

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ valid: true, user }, { status: 200 });
  } catch (e) {
    console.error("Verify TAC error", e);
    return NextResponse.json(
      { error: "Failed to verify code. Please try again." },
      { status: 500 }
    );
  }
}
