import {
  fetchChartersFromDb,
  isCaptainDbConfigured,
  viewExists,
} from "@/lib/captain-db";
import { prismaCaptain } from "@/lib/prisma-captain";
import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const diagnostics: any = {
    env: {
      USE_CAPTAIN_DB: process.env.USE_CAPTAIN_DB,
      CAPTAIN_DATABASE_URL: Boolean(process.env.CAPTAIN_DATABASE_URL),
    },
    configured: isCaptainDbConfigured(),
  };

  try {
    // Simple connectivity check
    const whoami = await prismaCaptain.$queryRaw<Array<{ user: string }>>`
      select current_user as user
    `;
    diagnostics.current_user = whoami?.[0]?.user ?? null;
  } catch (e: any) {
    diagnostics.connectError = String(e?.message || e);
  }

  try {
    diagnostics.viewExists = await viewExists();
  } catch (e: any) {
    diagnostics.viewCheckError = String(e?.message || e);
  }

  try {
    const sample = await fetchChartersFromDb(3);
    diagnostics.sampleCount = sample.length;
    diagnostics.firstNames = sample.map((c: any) => c?.name).filter(Boolean);
  } catch (e: any) {
    diagnostics.sampleError = String(e?.message || e);
  }

  return NextResponse.json(diagnostics);
}
