import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const hasAdminCookie = request.cookies.get("admin_auth")?.value === "1";
  
  return NextResponse.json({
    hasAdminPassword: !!adminPassword,
    adminPassword: adminPassword || "not set",
    hasAdminCookie,
    cookies: Object.fromEntries(
      Array.from(request.cookies.getAll().map(cookie => [cookie.name, cookie.value]))
    ),
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}