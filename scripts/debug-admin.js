// Quick debug script for admin authentication issues
import { PrismaClient } from "@prisma/client";

async function debug() {
  console.log("🔧 Debugging admin authentication...");

  // Test database connection
  const prisma = new PrismaClient();
  try {
    const userCount = await prisma.user.count();
    console.log("✅ Database connected. Users count:", userCount);

    // Check if we have any users for admin
    const users = await prisma.user.findMany({
      select: { id: true, email: true, displayName: true },
    });
    console.log("📝 Available users:", users);

    // Check blog posts
    const postCount = await prisma.blogPost.count();
    console.log("📄 Blog posts count:", postCount);
  } catch (error) {
    console.error("❌ Database error:", error.message);
  }

  // Check environment variables
  console.log("\n🌍 Environment check:");
  console.log("ADMIN_PASSWORD set:", !!process.env.ADMIN_PASSWORD);
  console.log("DATABASE_URL set:", !!process.env.DATABASE_URL);

  await prisma.$disconnect();
}

debug().catch(console.error);
