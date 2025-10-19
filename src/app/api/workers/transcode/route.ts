import { verifySignature } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";

export const runtime = "edge"; // no Node deps here

async function handler(req: Request) {
  // Forward payload to your external worker
  const body = await req.json().catch(() => null);
  if (!body?.key || !body?.url) {
    return NextResponse.json(
      { ok: false, error: "Missing key/url" },
      { status: 400 }
    );
  }

  // EXTERNAL_WORKER_URL = e.g. https://transcoder.your-domain.com/transcode
  const target = process.env.EXTERNAL_WORKER_URL;
  if (!target) {
    // Still return 200 so QStash doesn't retry forever in dev;
    // log loudly so you remember to configure it.
    console.error("EXTERNAL_WORKER_URL not configured; skipping transcode");
    return NextResponse.json({ ok: true, forwarded: false });
  }

  const resp = await fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await resp.text();
  return NextResponse.json({ ok: resp.ok, status: resp.status, body: text });
}

export const POST = verifySignature(handler);
