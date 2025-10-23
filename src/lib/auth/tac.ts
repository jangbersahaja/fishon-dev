import { prisma } from "@/lib/database/prisma";
import { createHmac } from "crypto";

const DEFAULT_WINDOW_SEC = 120; // 2 minutes

function hmacHex(secret: string, data: string) {
  return createHmac("sha256", secret).update(data).digest("hex");
}

function codeFromHex(hex: string, digits = 6) {
  // Use last 8 hex chars -> int -> mod 10^digits
  const slice = hex.slice(-8);
  const num = parseInt(slice, 16);
  const mod = num % Math.pow(10, digits);
  return String(mod).padStart(digits, "0");
}

export function generateTac(
  email: string,
  now = Date.now(),
  windowSec = DEFAULT_WINDOW_SEC
) {
  const secret =
    process.env.TAC_SECRET || process.env.NEXTAUTH_SECRET || "tac-dev-secret";
  const windowIdx = Math.floor(now / 1000 / windowSec);
  const hex = hmacHex(
    secret,
    `${email.toLowerCase()}|${windowIdx}|${windowSec}`
  );
  return codeFromHex(hex, 6);
}

export async function validateTac(
  email: string,
  code: string,
  now = Date.now(),
  windowSec = DEFAULT_WINDOW_SEC
) {
  // First try database-stored TAC (email-sent codes)
  try {
    const verification = await prisma.verificationCode.findFirst({
      where: {
        email: email.toLowerCase(),
        code,
        type: "TAC",
        expiresAt: { gt: new Date(now) },
        usedAt: null,
      },
    });

    if (verification) {
      // Mark as used
      await prisma.verificationCode.update({
        where: { id: verification.id },
        data: { usedAt: new Date(now) },
      });
      return true;
    }
  } catch (e) {
    console.error("DB TAC validation error:", e);
  }

  // Fallback to time-based TAC (TOTP-style) for backwards compatibility
  const current = generateTac(email, now, windowSec);
  if (code === current) return true;
  // also allow previous window for clock drift
  const prevWindow = now - windowSec * 1000;
  const prev = generateTac(email, prevWindow, windowSec);
  return code === prev;
}
