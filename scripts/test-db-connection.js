import { PrismaClient } from "@prisma/client";

async function testConnection() {
  const prisma = new PrismaClient();

  try {
    console.log("🔄 Testing database connection...");

    // Test the connection by running a simple query
    await prisma.$connect();
    console.log("✅ Database connected successfully!");

    // Try to run a basic query to verify the connection works
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Database query test passed:", result);

    // Check if we can see the database info
    const dbInfo = await prisma.$queryRaw`SELECT version() as version`;
    console.log("📊 Database version:", dbInfo[0]?.version);
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error("Error message:", error.message);

    if (error.code) {
      console.error("Error code:", error.code);
    }

    if (
      error.message.includes("ENOTFOUND") ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.error("💡 This looks like a connection issue. Check:");
      console.error("   - DATABASE_URL environment variable");
      console.error("   - Database server is running");
      console.error("   - Network connectivity");
    }

    if (error.message.includes("authentication")) {
      console.error("💡 This looks like an authentication issue. Check:");
      console.error("   - Username and password in DATABASE_URL");
      console.error("   - Database user permissions");
    }
  } finally {
    await prisma.$disconnect();
    console.log("🔌 Disconnected from database");
  }
}

testConnection();
