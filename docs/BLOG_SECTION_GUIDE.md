# Blog Section Implementation Guide

## Overview

The Fishon.my blog section is a fully SEO-optimized content management system built with Next.js 15, Prisma, and PostgreSQL. It includes all modern SEO best practices for maximum search engine visibility and social media sharing.

## Architecture

### Database Schema

The blog uses four main Prisma models:

#### BlogPost
- **Core fields**: `id`, `slug`, `title`, `excerpt`, `content`
- **Media**: `coverImage`, `coverImageAlt`
- **Publishing**: `published`, `publishedAt`
- **SEO**: `metaTitle`, `metaDescription`, `metaKeywords`
- **Analytics**: `readingTime`, `viewCount`
- **Relations**: `author` (User), `categories` (many-to-many), `tags` (many-to-many)

#### BlogCategory
- Hierarchical organization of posts
- Each category has: `slug`, `name`, `description`

#### BlogTag
- Flexible tagging system
- Each tag has: `slug`, `name`

### Routes

| Route | Purpose | Features |
|-------|---------|----------|
| `/blog` | Main blog listing | Featured posts, pagination, category navigation |
| `/blog/[slug]` | Individual post | Rich content, sharing, related posts, breadcrumbs |
| `/blog/category/[slug]` | Category archive | Filtered posts by category |
| `/blog/tag/[slug]` | Tag archive | Filtered posts by tag |
| `/blog/sitemap.xml` | XML Sitemap | Dynamic sitemap generation |
| `/blog/rss.xml` | RSS Feed | Content syndication |

## SEO Features

### Meta Tags
All pages include:
- Unique `<title>` tags
- Meta descriptions
- Meta keywords (for individual posts)
- Canonical URLs
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags

### Structured Data (JSON-LD)
- **Blog listing**: Blog schema
- **Individual posts**: BlogPosting/Article schema
- **All pages**: BreadcrumbList schema
- **Author information**: Person schema

### Technical SEO
- Semantic HTML5 structure
- Proper heading hierarchy (h1 → h6)
- Alt text for all images
- Responsive images with `next/image`
- Fast page loads (Next.js optimization)
- Mobile-responsive design
- Sitemap generation
- RSS feed
- robots.txt directives

### Social Media Optimization
- Open Graph images (1200x630)
- Twitter Card support
- Share buttons (Facebook, Twitter, WhatsApp)
- Rich previews on all platforms

## Content Management

### Creating Blog Posts

Currently, blog posts need to be created directly in the database. Here's how to add a post:

```typescript
// Example: Creating a blog post via Prisma
import { prisma } from "@/lib/prisma";

await prisma.blogPost.create({
  data: {
    slug: "my-first-post",
    title: "My First Blog Post",
    excerpt: "A brief summary of the post",
    content: "<h2>Introduction</h2><p>Full HTML content here...</p>",
    coverImage: "https://example.com/image.jpg",
    coverImageAlt: "Descriptive alt text",
    published: true,
    publishedAt: new Date(),
    metaTitle: "My First Post | FishOn.my",
    metaDescription: "SEO-friendly description for search engines",
    metaKeywords: "fishing, malaysia, tips",
    readingTime: 5,
    authorId: "user-id-here",
    categories: {
      connect: [{ slug: "tips" }, { slug: "destinations" }]
    },
    tags: {
      connect: [{ slug: "beginners" }, { slug: "selangor" }]
    }
  }
});
```

### Content Guidelines

#### Titles
- Keep under 60 characters for proper display in search results
- Include target keywords naturally
- Make them compelling and clickable

#### Excerpts
- 150-160 characters for optimal display
- Summarize the main point
- Include a call-to-action when appropriate

#### Content
- Use proper HTML structure with headings
- Break content into scannable sections
- Include lists (ul, ol) for better readability
- Add images with proper alt text
- Link to related content internally
- Target 1000+ words for better SEO

#### Images
- Use high-quality images (1200px+ width)
- Compress before uploading
- Always include descriptive alt text
- Prefer 16:9 aspect ratio for cover images

#### SEO Fields
- **metaTitle**: 50-60 characters, include primary keyword
- **metaDescription**: 150-160 characters, compelling and keyword-rich
- **metaKeywords**: 5-10 relevant keywords, comma-separated

### Categories & Tags

#### Predefined Categories
1. **Fishing Tips** (`tips`) - General advice and tips
2. **Destinations** (`destinations`) - Location guides
3. **Techniques** (`techniques`) - Fishing methods
4. **Gear & Equipment** (`gear`) - Product reviews and guides
5. **Charter Guides** (`charters`) - Charter selection and booking
6. **Fish Species** (`species`) - Species information

#### Using Tags
Tags should be specific and descriptive:
- Location-based: `selangor`, `langkawi`, `sabah`
- Technique-based: `jigging`, `trolling`, `popping`
- Audience: `beginners`, `advanced`
- Seasonal: `monsoon`, `peak-season`

## Service Layer

The `blog-service.ts` file provides all data fetching functions:

### Main Functions

```typescript
// Get paginated posts
getBlogPosts({ page: 1, perPage: 12 })

// Get a single post
getBlogPostBySlug("post-slug")

// Get featured posts
getFeaturedPosts(3)

// Get related posts
getRelatedPosts(postId, 3)

// Category functions
getBlogCategory("category-slug")
getBlogPostsByCategory("category-slug", { page: 1, perPage: 12 })

// Tag functions
getBlogTag("tag-slug")
getBlogPostsByTag("tag-slug", { page: 1, perPage: 12 })

// Search
searchBlogPosts("query", { page: 1, perPage: 12 })
```

## Components

### BlogPostCard
Standard post card for listing pages:
- Responsive image
- Category badges
- Title and excerpt
- Reading time and date
- Hover effects

### FeaturedPostCard
Hero-style card for featured content:
- Large image with overlay
- Prominent title
- Category badge
- Gradient overlay

## Performance Optimization

### Image Optimization
- All images use Next.js `next/image`
- Automatic responsive images
- Lazy loading by default
- WebP format when supported

### Caching
- Sitemap: 1 hour cache
- RSS feed: 1 hour cache
- Static generation for published posts
- Revalidation on content updates

### Database Optimization
- Indexed fields: `slug`, `published`, `publishedAt`, `authorId`
- Optimized queries with proper `include`
- Pagination to limit data fetching

## SEO Checklist

When creating new blog posts, ensure:

- [ ] Unique, descriptive title (50-60 chars)
- [ ] Compelling meta description (150-160 chars)
- [ ] Relevant keywords (5-10)
- [ ] High-quality cover image with alt text
- [ ] Proper HTML structure (h1, h2, h3...)
- [ ] Internal links to related content
- [ ] External links to authoritative sources
- [ ] Minimum 800-1000 words
- [ ] Mobile-friendly formatting
- [ ] Fast page load (optimized images)
- [ ] Social sharing enabled
- [ ] Correct category and tags
- [ ] Proofread for grammar and spelling

## Analytics Setup

To track blog performance, consider adding:

1. **Google Analytics 4**
   - Page views
   - Engagement time
   - Scroll depth
   - Outbound clicks

2. **Google Search Console**
   - Search queries
   - Click-through rates
   - Index coverage
   - Mobile usability

3. **Custom Analytics**
   - View count (already in schema)
   - Reading completion
   - Share counts
   - Popular categories/tags

## Future Enhancements

Potential improvements to consider:

1. **Admin Dashboard**
   - WYSIWYG editor
   - Draft management
   - Preview functionality
   - Media library

2. **Advanced Features**
   - Comments system
   - Author profiles
   - Series/collections
   - Table of contents
   - Estimated reading progress

3. **Marketing**
   - Email newsletter integration
   - Social media auto-posting
   - Related products (charter bookings)
   - Lead magnets (downloadable guides)

4. **SEO Enhancements**
   - Automated schema testing
   - Internal linking suggestions
   - Keyword optimization tools
   - Broken link checker

## Maintenance

### Regular Tasks

**Weekly**
- Review new posts for SEO
- Check for broken links
- Monitor search console for errors
- Update sitemap if needed

**Monthly**
- Analyze top-performing content
- Update outdated content
- Add internal links to new posts
- Review and update categories/tags

**Quarterly**
- SEO audit
- Performance optimization
- Content gap analysis
- Competitor analysis

## Troubleshooting

### Common Issues

**Posts not showing up**
- Check `published: true` status
- Verify `publishedAt` is set
- Ensure correct author relationship

**SEO not working**
- Verify meta tags in browser
- Check robots.txt isn't blocking
- Validate JSON-LD with Google's tool
- Submit sitemap to search console

**Images not loading**
- Verify image URLs are accessible
- Check Next.js image configuration
- Ensure proper image dimensions

## Resources

- [Next.js SEO Best Practices](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)

## Support

For questions or issues with the blog section:
1. Check this documentation
2. Review the code comments
3. Consult the Fishon development team
4. Reference the Next.js and Prisma documentation
