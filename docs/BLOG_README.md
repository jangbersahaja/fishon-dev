# Fishon.my Blog Section

## 🎣 Overview

A comprehensive, SEO-optimized blog section for Fishon.my built with Next.js 15, Prisma, and PostgreSQL. Designed to drive organic traffic through fishing guides, tips, and destination content.

## ✨ Features

### Content Management
- ✅ Blog posts with rich HTML content
- ✅ Categories for content organization
- ✅ Tags for flexible content discovery
- ✅ Featured posts highlighting
- ✅ Draft and publish workflow
- ✅ Reading time estimation
- ✅ View count tracking

### SEO Optimization
- ✅ Complete meta tags (title, description, keywords)
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card integration
- ✅ JSON-LD structured data
- ✅ Dynamic XML sitemap
- ✅ RSS feed for syndication
- ✅ Canonical URLs
- ✅ Mobile-first responsive design
- ✅ Fast page loads with Next.js optimization

### User Experience
- ✅ Clean, modern design matching Fishon.my brand
- ✅ Featured posts section
- ✅ Category and tag navigation
- ✅ Pagination for large post lists
- ✅ Related posts recommendations
- ✅ Social sharing buttons
- ✅ Breadcrumb navigation
- ✅ Newsletter signup

## 📁 Project Structure

```
src/app/blog/
├── layout.tsx                  # Blog layout with SEO metadata
├── page.tsx                    # Main blog listing page
├── [slug]/page.tsx            # Individual blog post
├── category/[slug]/page.tsx   # Category archive pages
├── tag/[slug]/page.tsx        # Tag archive pages
├── sitemap.xml/route.ts       # Dynamic sitemap generator
└── rss.xml/route.ts           # RSS feed generator

src/components/blog/
├── BlogPostCard.tsx           # Standard post card
└── FeaturedPostCard.tsx       # Featured post card

src/lib/
└── blog-service.ts            # Data fetching service layer

src/dummy/
└── blog.ts                    # Sample data for development

prisma/schema.prisma           # Database schema
```

## 🚀 Getting Started

### 1. Database Setup

Run the Prisma migration to create blog tables:

```bash
npm run prisma:migrate -- --name "add_blog_models"
```

### 2. (Optional) Seed Sample Data

Use the dummy data to test the blog:

```typescript
// Create a seed script or add posts manually
import { prisma } from "@/lib/prisma";
import { dummyBlogCategories, dummyBlogPosts } from "@/dummy/blog";

// Create categories first
for (const cat of dummyBlogCategories) {
  await prisma.blogCategory.create({ data: cat });
}

// Then create posts...
```

### 3. Access the Blog

Navigate to `http://localhost:3000/blog` to see the blog section.

## 📝 Creating Content

### Database Creation (Current Method)

```typescript
import { prisma } from "@/lib/prisma";

const post = await prisma.blogPost.create({
  data: {
    slug: "best-fishing-spots-selangor",
    title: "Top 10 Fishing Spots in Selangor",
    excerpt: "Discover the best fishing locations...",
    content: "<h2>Introduction</h2><p>Content here...</p>",
    coverImage: "https://example.com/image.jpg",
    coverImageAlt: "Fishing boat in Selangor",
    published: true,
    publishedAt: new Date(),
    metaTitle: "Top 10 Fishing Spots in Selangor | FishOn.my",
    metaDescription: "Expert guide to the best fishing spots in Selangor...",
    metaKeywords: "selangor fishing, malaysia fishing spots",
    readingTime: 6,
    authorId: "user-id",
    categories: {
      connect: [{ slug: "destinations" }, { slug: "tips" }]
    },
    tags: {
      connect: [{ slug: "selangor" }, { slug: "beginners" }]
    }
  }
});
```

### Content Guidelines

#### Title (50-60 characters)
- Include primary keyword
- Make it compelling
- Example: "Top 10 Fishing Spots in Selangor 2025"

#### Excerpt (150-160 characters)
- Summarize the main point
- Include a benefit
- Example: "Discover the best fishing locations in Selangor with expert tips..."

#### Content
- Use proper HTML structure
- Include headings (h2, h3)
- Add lists for readability
- Target 1000+ words
- Link to related content

#### SEO Fields
- **metaTitle**: Optimized for search (50-60 chars)
- **metaDescription**: Compelling summary (150-160 chars)
- **metaKeywords**: 5-10 relevant keywords

## 🎨 Components

### BlogPostCard
Used in listing pages. Shows:
- Cover image (optimized)
- Category badges
- Title (truncated to 2 lines)
- Excerpt (truncated to 2 lines)
- Reading time and date

```tsx
import BlogPostCard from "@/components/blog/BlogPostCard";

<BlogPostCard post={post} />
```

### FeaturedPostCard
Used for featured content. Shows:
- Large cover image with overlay
- Category badge
- Title
- Published date

```tsx
import FeaturedPostCard from "@/components/blog/FeaturedPostCard";

<FeaturedPostCard post={post} />
```

## 🔧 Service Functions

The `blog-service.ts` provides data fetching:

```typescript
import {
  getBlogPosts,
  getBlogPostBySlug,
  getFeaturedPosts,
  getRelatedPosts,
  getBlogCategory,
  getBlogPostsByCategory,
  getBlogTag,
  getBlogPostsByTag,
  searchBlogPosts,
} from "@/lib/blog-service";

// Get paginated posts
const { posts, total } = await getBlogPosts({ page: 1, perPage: 12 });

// Get a single post
const post = await getBlogPostBySlug("my-post-slug");

// Get featured posts
const featured = await getFeaturedPosts(3);

// Get related posts
const related = await getRelatedPosts(postId, 3);

// Category posts
const { posts, total } = await getBlogPostsByCategory("tips", {
  page: 1,
  perPage: 12,
});

// Tag posts
const { posts, total } = await getBlogPostsByTag("selangor", {
  page: 1,
  perPage: 12,
});

// Search posts
const { posts, total } = await searchBlogPosts("fishing techniques", {
  page: 1,
  perPage: 12,
});
```

## 🔍 SEO Features

### Meta Tags
Every page includes:
- Unique title tags
- Meta descriptions
- Meta keywords (for posts)
- Canonical URLs

### Social Sharing
- Open Graph tags (Facebook, LinkedIn)
- Twitter Cards
- 1200×630 images
- Share buttons on posts

### Structured Data
- Blog schema on listing page
- BlogPosting schema on posts
- BreadcrumbList on all pages
- Organization info

### Technical SEO
- XML Sitemap at `/blog/sitemap.xml`
- RSS feed at `/blog/rss.xml`
- Fast page loads
- Mobile-responsive
- Semantic HTML
- Image optimization

## 📊 Monitoring

### Recommended Tools
1. **Google Search Console**
   - Submit sitemap
   - Monitor indexing
   - Track search queries

2. **Google Analytics 4**
   - Track page views
   - Monitor engagement
   - Analyze user behavior

3. **PageSpeed Insights**
   - Check performance
   - Optimize load times

### Key Metrics
- Organic traffic
- Search rankings
- Click-through rate
- Time on page
- Bounce rate
- Conversions (newsletter signups)

## 📚 Documentation

Comprehensive guides available in `/docs`:

- **BLOG_SECTION_GUIDE.md** - Complete implementation guide
- **SEO_BEST_PRACTICES.md** - SEO strategy and optimization
- **BLOG_ARCHITECTURE.md** - System architecture and data flow

## 🎯 Categories

Predefined categories:
1. **Fishing Tips** - General advice and techniques
2. **Destinations** - Location guides and reviews
3. **Techniques** - Fishing methods (jigging, trolling, etc.)
4. **Gear & Equipment** - Product reviews and recommendations
5. **Charter Guides** - Charter selection and booking tips
6. **Fish Species** - Information about different fish

## 🏷️ Common Tags

Location-based:
- `selangor`, `langkawi`, `sabah`, `sarawak`, `kuantan`, `terengganu`

Technique-based:
- `jigging`, `trolling`, `popping`, `casting`

Audience:
- `beginners`, `advanced`

Seasonal:
- `monsoon`, `peak-season`

Other:
- `charter-tips`, `equipment`, `safety`

## 🚧 Future Enhancements

Consider adding:
- [ ] Admin dashboard for content management
- [ ] WYSIWYG editor (TinyMCE, Draft.js)
- [ ] Comments system (Disqus, custom)
- [ ] Author profiles and bios
- [ ] Newsletter integration (Mailchimp, SendGrid)
- [ ] Social media auto-posting
- [ ] Advanced search with filters
- [ ] Table of contents for long posts
- [ ] Reading progress indicator
- [ ] Bookmarking/favorites
- [ ] Series/collection organization

## 💡 Best Practices

### Content Creation
- Write for users first, search engines second
- Target 1000+ words per post
- Use descriptive headings
- Include relevant images
- Link to related content
- Update regularly

### SEO Optimization
- Unique title and description for each post
- Include target keywords naturally
- Optimize images (size, alt text, filename)
- Build internal links
- Submit sitemap to search engines
- Monitor performance regularly

### Performance
- Compress images before upload
- Use Next.js image optimization
- Keep JavaScript minimal
- Test on mobile devices
- Monitor Core Web Vitals

## 🐛 Troubleshooting

### Posts Not Showing
✅ Check `published: true`
✅ Verify `publishedAt` is set
✅ Ensure author relationship exists

### Images Not Loading
✅ Verify image URLs are accessible
✅ Check image dimensions
✅ Ensure proper Next.js config

### SEO Issues
✅ Validate meta tags in browser
✅ Test structured data with Google's tool
✅ Check robots.txt isn't blocking
✅ Submit sitemap to Search Console

## 📞 Support

For questions or issues:
1. Check the documentation in `/docs`
2. Review code comments in files
3. Consult Next.js documentation
4. Contact the Fishon development team

## 📄 License

Part of the Fishon.my project.

---

**Built with ❤️ for Malaysian anglers**
