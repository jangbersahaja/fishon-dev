import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = req.headers.get("x-revalidate-token");
  if (!token || token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({} as any));
  const path = body?.path || "/home";
  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path });
}
