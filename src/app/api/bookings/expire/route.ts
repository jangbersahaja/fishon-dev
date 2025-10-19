import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Simple expiry endpoint to be called by a scheduler (e.g., cron) with a secret header
// Marks PENDING bookings as EXPIRED when expiresAt < now
export async function POST(req: Request) {
  const secret = process.env.BOOKINGS_EXPIRE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );
  }
  const provided = req.headers.get("x-expire-secret");
  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  // Update many in one go; return count
  const result = await prisma.booking.updateMany({
    where: {
      status: "PENDING",
      expiresAt: { lt: now },
    },
    data: { status: "EXPIRED" },
  });

  return NextResponse.json({ expired: result.count }, { status: 200 });
}
