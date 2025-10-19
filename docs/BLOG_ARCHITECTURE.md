# Blog Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Fishon.my Blog                          │
│                     (Next.js 15 + Prisma)                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ┌───────▼──────┐         ┌───────▼──────┐
            │   Frontend   │         │   Backend    │
            │   (Next.js)  │         │   (Prisma)   │
            └───────┬──────┘         └───────┬──────┘
                    │                         │
                    │                         │
        ┌───────────┴───────────┐   ┌─────────▼─────────┐
        │                       │   │                   │
┌───────▼────────┐    ┌────────▼──────┐    ┌──────────▼────────┐
│  Page Routes   │    │  Components   │    │  PostgreSQL DB    │
├────────────────┤    ├───────────────┤    ├───────────────────┤
│ • /blog        │    │ • BlogPostCard│    │ • BlogPost        │
│ • /blog/[slug] │    │ • FeaturedCard│    │ • BlogCategory    │
│ • /category/   │    │ • Layout      │    │ • BlogTag         │
│ • /tag/        │    │               │    │ • User (Author)   │
│ • /sitemap.xml │    │               │    │                   │
│ • /rss.xml     │    │               │    │                   │
└────────────────┘    └───────────────┘    └───────────────────┘
        │                     │                      │
        └─────────────────────┴──────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Service Layer    │
                    │  (blog-service)   │
                    ├───────────────────┤
                    │ • getBlogPosts    │
                    │ • getBySlug       │
                    │ • getByCategory   │
                    │ • getByTag        │
                    │ • search          │
                    └───────────────────┘
```

## Data Flow

### Reading a Blog Post

```
User Request
    │
    ▼
/blog/my-post-slug
    │
    ▼
Next.js Server
    │
    ├─→ Generate Metadata (SEO)
    │   ├─→ Title
    │   ├─→ Description
    │   ├─→ Open Graph
    │   └─→ Twitter Cards
    │
    ├─→ blog-service.ts
    │   └─→ getBlogPostBySlug()
    │       └─→ Prisma Query
    │           └─→ PostgreSQL
    │               └─→ Returns post + relations
    │
    ├─→ Generate JSON-LD
    │   ├─→ BlogPosting Schema
    │   └─→ Breadcrumb Schema
    │
    └─→ Render Page
        ├─→ Cover Image (optimized)
        ├─→ Post Content (HTML)
        ├─→ Related Posts
        └─→ Share Buttons
```

### Listing Blog Posts

```
/blog?page=2
    │
    ▼
blog-service.ts
    │
    ├─→ getBlogPosts({ page: 2, perPage: 12 })
    │   └─→ Prisma Query with pagination
    │       └─→ WHERE published = true
    │           ORDER BY publishedAt DESC
    │           SKIP 12, TAKE 12
    │
    ├─→ getFeaturedPosts(3)
    │   └─→ ORDER BY viewCount, publishedAt
    │       TAKE 3
    │
    └─→ Render Grid
        ├─→ Featured Posts (top)
        └─→ Recent Posts (grid)
```

## Database Schema Relationships

```
┌─────────────┐
│    User     │
│─────────────│
│ id          │◄───┐
│ email       │    │
│ ...         │    │
└─────────────┘    │
                   │ author
                   │
┌──────────────────┴───────┐
│      BlogPost            │
│──────────────────────────│
│ id                       │
│ slug (unique, indexed)   │
│ title                    │
│ excerpt                  │
│ content                  │
│ coverImage              │
│ published (indexed)     │
│ publishedAt (indexed)   │
│ authorId (FK, indexed)  │
│ metaTitle               │
│ metaDescription         │
│ metaKeywords            │
│ readingTime             │
│ viewCount               │
│ createdAt               │
│ updatedAt               │
└────────┬────────┬────────┘
         │        │
         │        │ Many-to-Many
         │        │
    ┌────▼────┐  │  ┌────▼────┐
    │Category │  │  │   Tag   │
    │─────────│  │  │─────────│
    │ id      │  │  │ id      │
    │ slug    │  │  │ slug    │
    │ name    │  │  │ name    │
    │ desc    │  │  └─────────┘
    └─────────┘  │
                 │
         Join Tables (Prisma implicit)
```

## SEO Flow

```
Blog Post Created/Updated
    │
    ├─→ Server-Side Generation
    │   ├─→ Meta Tags
    │   │   ├─→ <title>
    │   │   ├─→ <meta name="description">
    │   │   ├─→ <meta name="keywords">
    │   │   └─→ <link rel="canonical">
    │   │
    │   ├─→ Social Meta
    │   │   ├─→ Open Graph (og:*)
    │   │   └─→ Twitter Cards (twitter:*)
    │   │
    │   └─→ JSON-LD Schema
    │       ├─→ BlogPosting
    │       ├─→ BreadcrumbList
    │       └─→ Organization
    │
    ├─→ Sitemap Generation
    │   └─→ /blog/sitemap.xml
    │       └─→ Updates automatically
    │
    ├─→ RSS Feed
    │   └─→ /blog/rss.xml
    │       └─→ Last 50 posts
    │
    └─→ Search Engine Indexing
        ├─→ Google
        ├─→ Bing
        └─→ Others
```

## Component Hierarchy

```
app/blog/
│
├─ layout.tsx (Blog Layout)
│  ├─ <Navbar />
│  ├─ {children}
│  └─ <Footer />
│
├─ page.tsx (Blog Listing)
│  ├─ Hero Section
│  ├─ Category Nav
│  ├─ Featured Posts
│  │  └─ <FeaturedPostCard /> × 3
│  ├─ Recent Posts
│  │  └─ <BlogPostCard /> × N
│  ├─ Pagination
│  └─ Newsletter Signup
│
├─ [slug]/page.tsx (Individual Post)
│  ├─ Breadcrumbs
│  ├─ Article Header
│  │  ├─ Categories
│  │  ├─ Title (h1)
│  │  ├─ Excerpt
│  │  ├─ Meta (author, date, reading time)
│  │  └─ Tags
│  ├─ Cover Image
│  ├─ Article Content (HTML)
│  ├─ Share Buttons
│  └─ Related Posts
│     └─ <BlogPostCard /> × 3
│
├─ category/[slug]/page.tsx
│  ├─ Hero (category name + description)
│  └─ Posts Grid
│     └─ <BlogPostCard /> × N
│
└─ tag/[slug]/page.tsx
   ├─ Hero (tag name)
   └─ Posts Grid
      └─ <BlogPostCard /> × N
```

## API Routes

```
app/blog/
│
├─ sitemap.xml/route.ts
│  └─ GET → XML Sitemap
│     ├─ Fetch all published posts
│     ├─ Generate XML
│     └─ Cache: 1 hour
│
└─ rss.xml/route.ts
   └─ GET → RSS Feed
      ├─ Fetch latest 50 posts
      ├─ Generate RSS XML
      └─ Cache: 1 hour
```

## Performance Optimization Strategy

```
┌─────────────────────────┐
│   Next.js Optimizations │
├─────────────────────────┤
│ • Static Generation     │
│ • Server Components     │
│ • Automatic Code Split  │
│ • Image Optimization    │
│ • Font Optimization     │
└────────┬────────────────┘
         │
┌────────▼────────────────┐
│  Database Optimizations │
├─────────────────────────┤
│ • Indexed Fields        │
│   - slug                │
│   - published           │
│   - publishedAt         │
│   - authorId            │
│ • Efficient Queries     │
│   - Include only needed │
│   - Pagination          │
│   - Count queries       │
└────────┬────────────────┘
         │
┌────────▼────────────────┐
│   Caching Strategy      │
├─────────────────────────┤
│ • Sitemap: 1 hour       │
│ • RSS: 1 hour           │
│ • Static Pages: Build   │
│ • ISR: On-demand        │
└─────────────────────────┘
```

## SEO Implementation Layers

```
┌──────────────────────────────────────────┐
│         Layer 1: HTML Semantics          │
│  • Proper heading hierarchy (H1→H6)     │
│  • Semantic elements (<article>, <nav>) │
│  • Alt text on images                   │
│  • Descriptive link text                │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│        Layer 2: Meta Information         │
│  • Title tags (50-60 chars)             │
│  • Meta descriptions (150-160 chars)    │
│  • Meta keywords                         │
│  • Canonical URLs                        │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│       Layer 3: Social Optimization       │
│  • Open Graph tags (Facebook/LinkedIn)  │
│  • Twitter Card tags                     │
│  • Social share images (1200×630)       │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│      Layer 4: Structured Data            │
│  • JSON-LD schemas                       │
│  • BlogPosting schema                    │
│  • BreadcrumbList schema                 │
│  • Organization schema                   │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│     Layer 5: Technical SEO               │
│  • XML Sitemap                           │
│  • RSS Feed                              │
│  • robots.txt directives                 │
│  • Fast page speed                       │
│  • Mobile-responsive                     │
└──────────────────────────────────────────┘
```

## Content Workflow

```
1. Create Post
   ├─ Write content in HTML
   ├─ Add cover image
   ├─ Set categories & tags
   ├─ Optimize SEO fields
   └─ Save as draft

2. Review & Optimize
   ├─ Check keyword placement
   ├─ Verify meta descriptions
   ├─ Test internal links
   ├─ Validate images
   └─ Preview on mobile

3. Publish
   ├─ Set published = true
   ├─ Set publishedAt date
   └─ Auto-update sitemap

4. Promote
   ├─ Share on social media
   ├─ Newsletter announcement
   └─ Internal linking from related posts

5. Monitor & Update
   ├─ Track in Analytics
   ├─ Monitor Search Console
   ├─ Update based on performance
   └─ Add to related posts
```

## Technology Stack

```
┌─────────────────────────────────────────────┐
│              Frontend Layer                 │
│  • Next.js 15 (App Router)                 │
│  • React 19                                │
│  • TypeScript                              │
│  • Tailwind CSS                            │
│  • Lucide React (Icons)                    │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│            Service Layer                    │
│  • blog-service.ts                         │
│  • Data fetching functions                 │
│  • Business logic                          │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│              ORM Layer                      │
│  • Prisma Client                           │
│  • Type-safe queries                       │
│  • Migration management                    │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│            Database Layer                   │
│  • PostgreSQL                              │
│  • Indexed tables                          │
│  • Relational data                         │
└─────────────────────────────────────────────┘
```

## File Structure

```
src/
├── app/
│   └── blog/
│       ├── layout.tsx              # Blog layout with SEO
│       ├── page.tsx                # Main listing
│       ├── [slug]/
│       │   └── page.tsx           # Individual post
│       ├── category/
│       │   └── [slug]/
│       │       └── page.tsx       # Category archive
│       ├── tag/
│       │   └── [slug]/
│       │       └── page.tsx       # Tag archive
│       ├── sitemap.xml/
│       │   └── route.ts           # Sitemap generator
│       └── rss.xml/
│           └── route.ts           # RSS feed generator
│
├── components/
│   └── blog/
│       ├── BlogPostCard.tsx       # Post card component
│       └── FeaturedPostCard.tsx   # Featured card component
│
├── lib/
│   ├── blog-service.ts            # Data fetching layer
│   └── prisma.ts                  # Prisma client singleton
│
├── dummy/
│   └── blog.ts                    # Sample blog data
│
└── prisma/
    └── schema.prisma              # Database schema
```

## Summary

The blog architecture follows modern best practices:

- ✅ **Separation of Concerns**: Clear layers (UI, Service, Data)
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Performance**: Optimized queries and caching
- ✅ **SEO**: Multi-layer optimization strategy
- ✅ **Scalability**: Pagination and efficient data fetching
- ✅ **Maintainability**: Clear structure and documentation
- ✅ **Developer Experience**: Type-safe, well-documented APIs
