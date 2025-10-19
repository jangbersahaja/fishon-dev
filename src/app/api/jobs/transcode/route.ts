// app/api/jobs/transcode/route.ts
import { Client } from "@upstash/qstash";
import { NextResponse } from "next/server";

export const runtime = "edge"; // tiny and fast; just queues the job

const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    key?: string;
    url?: string;
    charterId?: string;
  } | null;
  if (!body?.key) {
    return NextResponse.json({ error: "Missing blob key" }, { status: 400 });
  }
  // Your worker endpoint (publicly reachable)
  const workerUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/workers/transcode`;

  await qstash.publishJSON({
    url: workerUrl,
    body, // { key, url, charterId? }
  });

  return NextResponse.json({ ok: true });
}
