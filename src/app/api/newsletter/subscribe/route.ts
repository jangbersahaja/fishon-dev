import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

      return NextResponse.json(
        { message: "Subscription reactivated" },
        { status: 200 }
      );
    }

    // Create new subscription
    await prisma.newsletterSubscription.create({
      data: { email, name },
    });

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
