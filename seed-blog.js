const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Dummy data directly in JS
const dummyBlogCategories = [
  {
    slug: "tips",
    name: "Fishing Tips",
    description:
      "Expert tips and tricks to improve your fishing skills and techniques",
  },
  {
    slug: "destinations",
    name: "Destinations",
    description:
      "Discover the best fishing spots and destinations across Malaysia",
  },
  {
    slug: "techniques",
    name: "Techniques",
    description: "Learn different fishing techniques from basic to advanced",
  },
  {
    slug: "gear",
    name: "Gear & Equipment",
    description: "Reviews and guides on fishing gear, rods, reels, and tackle",
  },
  {
    slug: "charters",
    name: "Charter Guides",
    description: "Guides to choosing the right charter for your fishing trip",
  },
  {
    slug: "species",
    name: "Fish Species",
    description: "Learn about different fish species found in Malaysian waters",
  },
];

const dummyBlogTags = [
  { slug: "beginners", name: "Beginners" },
  { slug: "offshore", name: "Offshore" },
  { slug: "inshore", name: "Inshore" },
  { slug: "jigging", name: "Jigging" },
  { slug: "trolling", name: "Trolling" },
  { slug: "popping", name: "Popping" },
  { slug: "selangor", name: "Selangor" },
  { slug: "langkawi", name: "Langkawi" },
  { slug: "kuantan", name: "Kuantan" },
  { slug: "terengganu", name: "Terengganu" },
  { slug: "sabah", name: "Sabah" },
  { slug: "sarawak", name: "Sarawak" },
  { slug: "charter-tips", name: "Charter Tips" },
  { slug: "seasonal", name: "Seasonal" },
  { slug: "equipment", name: "Equipment" },
];

const dummyBlogPosts = [
  {
    slug: "best-fishing-spots-selangor",
    title: "Top 10 Fishing Spots in Selangor for 2025",
    excerpt:
      "Discover the best fishing locations in Selangor, from coastal areas to hidden gems. Perfect for both beginners and experienced anglers.",
    content: `<h2>Introduction</h2><p>Selangor offers some of the most diverse fishing opportunities in Malaysia. From the bustling Port Klang to the serene waters of Kuala Selangor, there's something for every angler.</p><h2>1. Port Klang - The Gateway to Deep Sea Fishing</h2><p>Port Klang is Malaysia's busiest port and serves as an excellent starting point for deep-sea fishing adventures. The waters here are rich with Spanish mackerel, barracuda, and even the occasional sailfish.</p><h2>2. Kuala Selangor</h2><p>Known for its mangrove estuaries and rich marine life, Kuala Selangor is perfect for inshore fishing. You'll find plenty of siakap (barramundi), ikan merah (red snapper), and various species of grouper.</p>`,
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
    coverImageAlt: "Fishing boat in Selangor waters",
    metaTitle: "Top 10 Fishing Spots in Selangor 2025 | FishOn.my",
    metaDescription:
      "Explore the best fishing locations in Selangor. Expert guide to coastal fishing, charter recommendations, and tips for Malaysian anglers.",
    metaKeywords:
      "selangor fishing, port klang fishing, kuala selangor fishing, malaysia fishing spots",
    readingTime: 6,
    categories: ["destinations", "tips"],
    tags: ["selangor", "inshore", "offshore", "beginners"],
  },
  {
    slug: "jigging-technique-guide-beginners",
    title: "Jigging for Beginners: A Complete Guide to Malaysian Waters",
    excerpt:
      "Learn the basics of jigging, one of the most effective fishing techniques. From equipment selection to advanced tips.",
    content: `<h2>What is Jigging?</h2><p>Jigging is a popular fishing technique that involves vertically moving a lure (jig) up and down in the water column to attract fish. It's highly effective in Malaysian waters for catching various species.</p><h2>Essential Equipment</h2><h3>Rod and Reel</h3><p>For beginners, a medium to heavy jigging rod (150-300g) paired with a quality spinning or overhead reel is ideal.</p>`,
    coverImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
    coverImageAlt: "Angler demonstrating jigging technique",
    metaTitle: "Jigging Guide for Beginners | Malaysian Fishing Techniques",
    metaDescription:
      "Master jigging with our comprehensive guide. Learn equipment, techniques, and tips for successful jigging in Malaysian waters.",
    metaKeywords:
      "jigging technique, jigging malaysia, fishing technique, beginner fishing",
    readingTime: 8,
    categories: ["techniques", "tips"],
    tags: ["beginners", "jigging", "offshore", "equipment"],
  },
  {
    slug: "choosing-right-fishing-charter",
    title: "How to Choose the Right Fishing Charter in Malaysia",
    excerpt:
      "A comprehensive guide to selecting the perfect fishing charter for your needs, budget, and skill level.",
    content: `<h2>Why Use a Charter?</h2><p>Fishing charters provide everything you need for a successful trip - equipment, local knowledge, safety gear, and an experienced captain who knows the best spots.</p><h2>Types of Charters</h2><h3>1. Inshore Charters</h3><p>Perfect for beginners and families. These trips stay close to shore, targeting species like barramundi, queenfish, and trevally.</p>`,
    coverImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
    coverImageAlt: "Professional fishing charter boat",
    metaTitle: "How to Choose a Fishing Charter in Malaysia | FishOn.my",
    metaDescription:
      "Expert guide to selecting the perfect fishing charter. Learn about types, what to look for, and questions to ask before booking.",
    metaKeywords:
      "fishing charter malaysia, charter guide, book fishing trip, malaysia fishing",
    readingTime: 7,
    categories: ["charters", "tips"],
    tags: ["charter-tips", "beginners"],
  },
];

async function seedBlog() {
  try {
    console.log("🌱 Starting blog seeding...");

    // First, create a dummy user for blog posts
    const author = await prisma.user.upsert({
      where: { email: "admin@fishon.my" },
      update: {},
      create: {
        email: "admin@fishon.my",
        passwordHash: "dummy-hash", // In real app, this would be properly hashed
        displayName: "FishOn Admin",
        bio: "Editor of the FishOn.my blog. Sharing fishing tips, techniques, and destination guides for Malaysian anglers.",
        avatarUrl:
          "https://images.unsplash.com/photo-1502685104226-ee32379fefbe",
      },
    });
    console.log("✅ Created/found author:", author.email);

    // Create categories
    console.log("📂 Creating categories...");
    for (const categoryData of dummyBlogCategories) {
      await prisma.blogCategory.upsert({
        where: { slug: categoryData.slug },
        update: categoryData,
        create: categoryData,
      });
      console.log(`   ✅ ${categoryData.name}`);
    }

    // Create tags
    console.log("🏷️  Creating tags...");
    for (const tagData of dummyBlogTags) {
      await prisma.blogTag.upsert({
        where: { slug: tagData.slug },
        update: tagData,
        create: tagData,
      });
      console.log(`   ✅ ${tagData.name}`);
    }

    // Create blog posts
    console.log("📝 Creating blog posts...");
    for (const postData of dummyBlogPosts) {
      // Get category IDs
      const categories = await prisma.blogCategory.findMany({
        where: { slug: { in: postData.categories } },
        select: { id: true },
      });

      // Get tag IDs
      const tags = await prisma.blogTag.findMany({
        where: { slug: { in: postData.tags } },
        select: { id: true },
      });

      // Create the post
      await prisma.blogPost.upsert({
        where: { slug: postData.slug },
        update: {
          title: postData.title,
          excerpt: postData.excerpt,
          content: postData.content,
          coverImage: postData.coverImage,
          coverImageAlt: postData.coverImageAlt,
          metaTitle: postData.metaTitle,
          metaDescription: postData.metaDescription,
          metaKeywords: postData.metaKeywords,
          readingTime: postData.readingTime,
          published: true,
          publishedAt: new Date(),
          categories: {
            set: categories,
          },
          tags: {
            set: tags,
          },
        },
        create: {
          slug: postData.slug,
          title: postData.title,
          excerpt: postData.excerpt,
          content: postData.content,
          coverImage: postData.coverImage,
          coverImageAlt: postData.coverImageAlt,
          metaTitle: postData.metaTitle,
          metaDescription: postData.metaDescription,
          metaKeywords: postData.metaKeywords,
          readingTime: postData.readingTime,
          published: true,
          publishedAt: new Date(),
          authorId: author.id,
          categories: {
            connect: categories,
          },
          tags: {
            connect: tags,
          },
        },
      });
      console.log(`   ✅ ${postData.title}`);
    }

    // Show summary
    const postCount = await prisma.blogPost.count();
    const categoryCount = await prisma.blogCategory.count();
    const tagCount = await prisma.blogTag.count();

    console.log("\n🎉 Blog seeding completed!");
    console.log(`📊 Summary:`);
    console.log(`   - ${postCount} blog posts`);
    console.log(`   - ${categoryCount} categories`);
    console.log(`   - ${tagCount} tags`);
    console.log(
      `\n🌐 You can now access the blog at: http://localhost:3000/blog`
    );
  } catch (error) {
    console.error("❌ Error seeding blog:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedBlog();
