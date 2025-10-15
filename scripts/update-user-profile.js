// Update user profile with displayName and avatarUrl
import { PrismaClient } from "@prisma/client";

async function updateUserProfile() {
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.update({
      where: { email: "admin@fishon.my" },
      data: {
        displayName: "Captain Ahmad",
        bio: "Experienced fishing guide and charter captain with over 15 years of experience in Malaysian waters. Passionate about sharing fishing knowledge and helping anglers discover the best spots.",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
    });

    console.log("✅ User profile updated successfully!");
    console.log("👤 Display Name:", user.displayName);
    console.log("📝 Bio:", user.bio);
    console.log("🖼️  Avatar:", user.avatarUrl);
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserProfile();
