import { prisma } from "@/lib/database/prisma";
import { NextRequest, NextResponse } from "next/server";

// Zoho API integration (optional)
async function subscribeToZoho(email: string, name?: string) {
  const zohoClientId = process.env.ZOHO_CLIENT_ID;
  const zohoClientSecret = process.env.ZOHO_CLIENT_SECRET;
  const zohoRefreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const zohoListKey = process.env.ZOHO_LIST_KEY;

  if (!zohoClientId || !zohoClientSecret || !zohoRefreshToken || !zohoListKey) {
    console.log("Zoho credentials not configured, skipping external sync");
    return;
  }

  try {
    // Get access token
    const tokenResponse = await fetch(
      `https://accounts.zoho.com/oauth/v2/token?refresh_token=${zohoRefreshToken}&client_id=${zohoClientId}&client_secret=${zohoClientSecret}&grant_type=refresh_token`,
      { method: "POST" }
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to get Zoho access token");
    }

    const { access_token } = await tokenResponse.json();

    // Subscribe to Zoho list
    const subscribeResponse = await fetch(
      `https://campaigns.zoho.com/api/v1.1/json/listsubscribe`,
      {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listkey: zohoListKey,
          contactinfo: JSON.stringify({
            email,
            ...(name && { "First Name": name }),
          }),
        }),
      }
    );

    if (!subscribeResponse.ok) {
      throw new Error("Failed to subscribe to Zoho list");
    }

    console.log("Successfully subscribed to Zoho list:", email);
  } catch (error) {
    console.error("Zoho subscription error:", error);
    // Don't fail the request if Zoho sync fails
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { message: "Already subscribed" },
          { status: 200 }
        );
      }

      // Reactivate subscription
      await prisma.newsletterSubscription.update({
        where: { email },
        data: { active: true, unsubscribedAt: null },
      });

      // Sync with Zoho
      await subscribeToZoho(email, name);

      return NextResponse.json(
        { message: "Subscription reactivated" },
        { status: 200 }
      );
    }

    // Create new subscription
    await prisma.newsletterSubscription.create({
      data: { email, name },
    });

    // Sync with Zoho
    await subscribeToZoho(email, name);

    return NextResponse.json(
      { message: "Successfully subscribed!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
