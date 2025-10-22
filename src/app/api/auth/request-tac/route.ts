import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTac } from "@/lib/tac";
import { sendMail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    // Ensure user exists, create if not
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // create a placeholder account with random password
      user = await prisma.user.create({
        data: { email, passwordHash: "tac-placeholder" },
      });
    }

    const tac = generateTac(email);
    const html = `<div><p>Your Fishon verification code is:</p><p style="font-size:20px; font-weight:700;">${tac}</p><p>This code expires in 2 minutes.</p></div>`;
    await sendMail({ to: email, subject: "Your Fishon verification code", html });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("request-tac error", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
