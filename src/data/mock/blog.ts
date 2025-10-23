/**
 * Dummy blog data for development and prototyping
 * This can be used to seed the database or for initial testing
 */

export const dummyBlogCategories = [
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

export const dummyBlogTags = [
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

export const dummyBlogPosts = [
  {
    slug: "best-fishing-spots-selangor",
    title: "Top 10 Fishing Spots in Selangor for 2025",
    excerpt:
      "Discover the best fishing locations in Selangor, from coastal areas to hidden gems. Perfect for both beginners and experienced anglers.",
    content: `
      <h2>Introduction</h2>
      <p>Selangor offers some of the most diverse fishing opportunities in Malaysia. From the bustling Port Klang to the serene waters of Kuala Selangor, there's something for every angler.</p>
      
      <h2>1. Port Klang - The Gateway to Deep Sea Fishing</h2>
      <p>Port Klang is Malaysia's busiest port and serves as an excellent starting point for deep-sea fishing adventures. The waters here are rich with Spanish mackerel, barracuda, and even the occasional sailfish.</p>
      
      <h2>2. Kuala Selangor</h2>
      <p>Known for its mangrove estuaries and rich marine life, Kuala Selangor is perfect for inshore fishing. You'll find plenty of siakap (barramundi), ikan merah (red snapper), and various species of grouper.</p>
      
      <h2>3. Bagan Lalang</h2>
      <p>This coastal town offers excellent shore fishing and charter opportunities. The area is particularly known for its squid fishing during certain seasons.</p>
      
      <h2>Tips for Fishing in Selangor</h2>
      <ul>
        <li>Best seasons: March to October for offshore fishing</li>
        <li>Always check weather conditions before heading out</li>
        <li>Book charters in advance during peak season</li>
        <li>Bring sun protection - the Malaysian sun is intense!</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Whether you're a local or visiting Malaysia, Selangor's fishing spots offer incredible opportunities. Book your charter through Fishon.my to ensure a safe and memorable experience.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
    coverImageAlt: "Fishing boat in Selangor waters",
    metaTitle: "Top 10 Fishing Spots in Selangor 2025 | Fishon.my",
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
    content: `
      <h2>What is Jigging?</h2>
      <p>Jigging is a popular fishing technique that involves vertically moving a lure (jig) up and down in the water column to attract fish. It's highly effective in Malaysian waters for catching various species.</p>
      
      <h2>Essential Equipment</h2>
      <h3>Rod and Reel</h3>
      <p>For beginners, a medium to heavy jigging rod (150-300g) paired with a quality spinning or overhead reel is ideal. The reel should have a good drag system and hold at least 300m of PE 2-4 line.</p>
      
      <h3>Jigs</h3>
      <p>Start with a variety of jigs in the 80-200g range. Popular colors in Malaysian waters include pink, blue, and silver combinations.</p>
      
      <h2>Basic Jigging Technique</h2>
      <ol>
        <li>Drop the jig to the desired depth or near the bottom</li>
        <li>Quickly lift the rod tip 1-2 meters</li>
        <li>Allow the jig to fall on a semi-slack line</li>
        <li>Repeat this motion consistently</li>
      </ol>
      
      <h2>Target Species</h2>
      <p>In Malaysian waters, jigging is effective for:</p>
      <ul>
        <li>Amberjack (Duri)</li>
        <li>Grouper (Kerapu)</li>
        <li>Red Snapper (Ikan Merah)</li>
        <li>Trevally (Chermin)</li>
      </ul>
      
      <h2>Safety Tips</h2>
      <p>Always jig with a buddy, use gloves to protect your hands, and listen to your charter captain's instructions.</p>
    `,
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
    content: `
      <h2>Why Use a Charter?</h2>
      <p>Fishing charters provide everything you need for a successful trip - equipment, local knowledge, safety gear, and an experienced captain who knows the best spots.</p>
      
      <h2>Types of Charters</h2>
      
      <h3>1. Inshore Charters</h3>
      <p>Perfect for beginners and families. These trips stay close to shore, targeting species like barramundi, queenfish, and trevally. Typically 4-6 hours.</p>
      
      <h3>2. Offshore Charters</h3>
      <p>For experienced anglers seeking bigger game fish. These trips venture into deeper waters for sailfish, marlin, and large tuna. Usually full-day trips.</p>
      
      <h3>3. Specialized Charters</h3>
      <p>Focused on specific techniques like jigging, popping, or trolling. Great for anglers wanting to master a particular skill.</p>
      
      <h2>Key Factors to Consider</h2>
      
      <h3>Captain's Experience</h3>
      <p>Look for captains with proper licenses, good reviews, and local knowledge. On Fishon.my, all captains are verified.</p>
      
      <h3>Boat Condition</h3>
      <p>Ensure the boat is well-maintained with proper safety equipment, shade, and amenities.</p>
      
      <h3>Group Size</h3>
      <p>Consider how many people the boat can comfortably accommodate. Smaller groups often have better fishing opportunities.</p>
      
      <h3>What's Included</h3>
      <p>Check if the charter includes:</p>
      <ul>
        <li>Fishing equipment and tackle</li>
        <li>Bait and lures</li>
        <li>Food and drinks</li>
        <li>Fishing license</li>
        <li>Photo services</li>
      </ul>
      
      <h2>Questions to Ask</h2>
      <ol>
        <li>What's the cancellation policy?</li>
        <li>What happens in bad weather?</li>
        <li>Can I keep my catch?</li>
        <li>Do you practice catch and release?</li>
        <li>What's the maximum number of anglers?</li>
      </ol>
      
      <h2>Book with Fishon.my</h2>
      <p>Using Fishon.my ensures you're booking with verified, professional charters. Read reviews, compare prices, and book with confidence.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
    coverImageAlt: "Professional fishing charter boat",
    metaTitle: "How to Choose a Fishing Charter in Malaysia | Fishon.my",
    metaDescription:
      "Expert guide to selecting the perfect fishing charter. Learn about types, what to look for, and questions to ask before booking.",
    metaKeywords:
      "fishing charter malaysia, charter guide, book fishing trip, malaysia fishing",
    readingTime: 7,
    categories: ["charters", "tips"],
    tags: ["charter-tips", "beginners"],
  },
  {
    slug: "monsoon-season-fishing-malaysia",
    title: "Fishing During Monsoon Season: What You Need to Know",
    excerpt:
      "Understanding Malaysia's monsoon seasons and how they affect fishing. Tips for planning your trips around weather patterns.",
    content: `
      <h2>Malaysia's Two Monsoon Seasons</h2>
      <p>Malaysia experiences two monsoon seasons that significantly impact fishing conditions:</p>
      
      <h3>Southwest Monsoon (May to September)</h3>
      <p>Affects the west coast of Peninsular Malaysia, Sabah, and Sarawak. Generally brings drier conditions with occasional storms.</p>
      
      <h3>Northeast Monsoon (November to March)</h3>
      <p>Impacts the east coast of Peninsular Malaysia, bringing heavy rains and rough seas. This is the more severe of the two monsoons.</p>
      
      <h2>Best Fishing Seasons by Region</h2>
      
      <h3>West Coast (Selangor, Perak, Penang)</h3>
      <p>Best: March to October. The southwest monsoon is mild here, making it suitable for fishing year-round with proper planning.</p>
      
      <h3>East Coast (Terengganu, Pahang, Kelantan)</h3>
      <p>Best: March to October. Avoid November to February when the northeast monsoon brings dangerous conditions.</p>
      
      <h3>Sabah & Sarawak</h3>
      <p>Best: March to September. These regions have more stable weather but still experience increased rainfall during monsoon.</p>
      
      <h2>Fishing Tips During Monsoon</h2>
      
      <h3>Safety First</h3>
      <ul>
        <li>Always check weather forecasts</li>
        <li>Book with experienced charters who know local conditions</li>
        <li>Have a flexible schedule to reschedule if needed</li>
        <li>Ensure boats have proper safety equipment</li>
      </ul>
      
      <h3>Target Inshore Species</h3>
      <p>During monsoon season, focus on protected inshore areas and estuaries where conditions are calmer.</p>
      
      <h3>Best Times of Day</h3>
      <p>Early morning often offers the calmest conditions during monsoon season.</p>
      
      <h2>Species That Thrive in Monsoon</h2>
      <p>Some species actually become more active during monsoon:</p>
      <ul>
        <li>Barramundi (Siakap) - loves flooded estuaries</li>
        <li>Mangrove Jack - active in protected mangrove areas</li>
        <li>Threadfin - feeds actively in turbid water</li>
      </ul>
      
      <h2>Booking Considerations</h2>
      <p>When booking charters during monsoon season:</p>
      <ol>
        <li>Choose flexible cancellation policies</li>
        <li>Book with local captains who know safe spots</li>
        <li>Consider shorter trips (4 hours vs full day)</li>
        <li>Ask about sheltered fishing locations</li>
      </ol>
      
      <p>Plan your trips wisely and you can enjoy great fishing year-round in Malaysia!</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3",
    coverImageAlt: "Fishing in challenging weather conditions",
    metaTitle: "Monsoon Season Fishing Guide Malaysia | Weather & Best Times",
    metaDescription:
      "Complete guide to fishing during Malaysia's monsoon seasons. Learn best times, regions, and safety tips for year-round fishing.",
    metaKeywords:
      "monsoon fishing, malaysia weather, fishing seasons, best time to fish",
    readingTime: 6,
    categories: ["tips", "destinations"],
    tags: ["seasonal", "beginners"],
  },
  {
    slug: "top-game-fish-species-malaysia",
    title: "Top 10 Game Fish Species in Malaysian Waters",
    excerpt:
      "A guide to the most sought-after game fish in Malaysia, where to find them, and how to catch them.",
    content: `
      <h2>Introduction</h2>
      <p>Malaysia's waters are home to some of the world's most exciting game fish. Here's our guide to the top 10 species every angler should know.</p>
      
      <h2>1. Sailfish (Ikan Layar)</h2>
      <p><strong>Size:</strong> 40-100kg | <strong>Season:</strong> Year-round, peak March-October</p>
      <p>The ultimate prize for offshore anglers. Known for their spectacular aerial displays and incredible speed. Found in deeper waters off Terengganu, Pahang, and Sabah.</p>
      
      <h2>2. Giant Trevally (Chermin)</h2>
      <p><strong>Size:</strong> 5-50kg | <strong>Season:</strong> Year-round</p>
      <p>Powerful fighters found around reefs and atolls. Excellent targets for popping enthusiasts. Common in Langkawi, Sabah, and offshore islands.</p>
      
      <h2>3. Barramundi (Siakap)</h2>
      <p><strong>Size:</strong> 1-15kg | <strong>Season:</strong> Year-round, best during monsoon</p>
      <p>Malaysia's most popular inshore species. Found in estuaries, mangroves, and coastal areas. Excellent table fare.</p>
      
      <h2>4. Grouper (Kerapu)</h2>
      <p><strong>Size:</strong> 2-40kg | <strong>Season:</strong> Year-round</p>
      <p>Various species found from shallow reefs to deep water. Excellent for jigging and bottom fishing. Highly prized for eating.</p>
      
      <h2>5. Red Snapper (Ikan Merah)</h2>
      <p><strong>Size:</strong> 1-10kg | <strong>Season:</strong> Year-round</p>
      <p>Beautiful fish found around reefs and wrecks. Great target for jigging and bottom fishing. Delicious eating fish.</p>
      
      <h2>6. Spanish Mackerel (Tenggiri)</h2>
      <p><strong>Size:</strong> 3-30kg | <strong>Season:</strong> Year-round</p>
      <p>Fast-swimming pelagic species perfect for trolling. Found in coastal and offshore waters throughout Malaysia.</p>
      
      <h2>7. Queenfish (Talang)</h2>
      <p><strong>Size:</strong> 2-15kg | <strong>Season:</strong> Year-round</p>
      <p>Aggressive surface feeders that readily take lures. Great sport on light tackle. Common in coastal waters.</p>
      
      <h2>8. Dorado/Mahi-Mahi (Ikan Lemadang)</h2>
      <p><strong>Size:</strong> 5-20kg | <strong>Season:</strong> March-October</p>
      <p>Colorful pelagic species known for acrobatic fights. Found offshore, often around floating debris or FADs.</p>
      
      <h2>9. Amberjack (Duri)</h2>
      <p><strong>Size:</strong> 10-50kg | <strong>Season:</strong> Year-round</p>
      <p>Powerful deep-water species perfect for jigging. Found around deep reefs and structure.</p>
      
      <h2>10. Marlin (Various Species)</h2>
      <p><strong>Size:</strong> 50-300kg | <strong>Season:</strong> March-September</p>
      <p>The ultimate billfish challenge. Black and blue marlin can be found in deep offshore waters, particularly off the east coast.</p>
      
      <h2>Targeting These Species</h2>
      <p>Each species requires different techniques:</p>
      <ul>
        <li><strong>Trolling:</strong> Sailfish, Spanish Mackerel, Dorado, Marlin</li>
        <li><strong>Jigging:</strong> Grouper, Amberjack, Trevally, Red Snapper</li>
        <li><strong>Popping:</strong> Trevally, Queenfish</li>
        <li><strong>Live Bait:</strong> Barramundi, Grouper, Trevally</li>
      </ul>
      
      <h2>Conservation</h2>
      <p>Practice catch and release when possible, especially for billfish. Follow local regulations and size limits.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
    coverImageAlt: "Game fish catch in Malaysian waters",
    metaTitle: "Top 10 Game Fish Species in Malaysia | Fishing Guide",
    metaDescription:
      "Complete guide to Malaysia's best game fish species. Learn where to find them, when to fish, and how to catch them.",
    metaKeywords:
      "malaysia game fish, fish species, sailfish malaysia, barramundi, trevally",
    readingTime: 9,
    categories: ["species", "tips"],
    tags: ["offshore", "inshore", "beginners"],
  },
];

/**
 * Helper function to calculate reading time based on content length
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Helper function to generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
