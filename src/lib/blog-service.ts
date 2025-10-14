import { prisma } from "@/lib/prisma";
import type { BlogCategory, BlogPost, BlogTag, User } from "@prisma/client";

export type BlogPostWithRelations = BlogPost & {
  author: Pick<User, "id" | "email" | "displayName" | "avatarUrl" | "bio">;
  categories: BlogCategory[];
  tags: BlogTag[];
};

/**
 * Get paginated blog posts (published only)
 */
export async function getBlogPosts({
  page = 1,
  perPage = 12,
}: {
  page?: number;
  perPage?: number;
} = {}) {
  const skip = (page - 1) * perPage;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
          },
        },
        categories: true,
        tags: true,
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.blogPost.count({ where: { published: true } }),
  ]);

  return { posts, total };
}

/**
 * Get featured blog posts (most recent published posts)
 */
export async function getFeaturedPosts(limit = 3) {
  return prisma.blogPost.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
        },
      },
      categories: true,
      tags: true,
    },
    orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
    take: limit,
  });
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostWithRelations | null> {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
        },
      },
      categories: true,
      tags: true,
    },
  });
}

/**
 * Get related posts based on categories and tags
 */
export async function getRelatedPosts(postId: string, limit = 3) {
  const post = await prisma.blogPost.findUnique({
    where: { id: postId },
    include: { categories: true, tags: true },
  });

  if (!post) return [];

  const categoryIds = post.categories.map((c) => c.id);
  const tagIds = post.tags.map((t) => t.id);

  return prisma.blogPost.findMany({
    where: {
      id: { not: postId },
      published: true,
      OR: [
        { categories: { some: { id: { in: categoryIds } } } },
        { tags: { some: { id: { in: tagIds } } } },
      ],
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
        },
      },
      categories: true,
      tags: true,
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

/**
 * Get blog category by slug
 */
export async function getBlogCategory(slug: string) {
  return prisma.blogCategory.findUnique({
    where: { slug },
  });
}

/**
 * Get all blog posts in a category
 */
export async function getBlogPostsByCategory(
  categorySlug: string,
  { page = 1, perPage = 12 }: { page?: number; perPage?: number } = {}
) {
  const skip = (page - 1) * perPage;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        published: true,
        categories: { some: { slug: categorySlug } },
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
          },
        },
        categories: true,
        tags: true,
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.blogPost.count({
      where: {
        published: true,
        categories: { some: { slug: categorySlug } },
      },
    }),
  ]);

  return { posts, total };
}

/**
 * Get blog tag by slug
 */
export async function getBlogTag(slug: string) {
  return prisma.blogTag.findUnique({
    where: { slug },
  });
}

/**
 * Get all blog posts with a tag
 */
export async function getBlogPostsByTag(
  tagSlug: string,
  { page = 1, perPage = 12 }: { page?: number; perPage?: number } = {}
) {
  const skip = (page - 1) * perPage;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        published: true,
        tags: { some: { slug: tagSlug } },
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
          },
        },
        categories: true,
        tags: true,
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.blogPost.count({
      where: {
        published: true,
        tags: { some: { slug: tagSlug } },
      },
    }),
  ]);

  return { posts, total };
}

/**
 * Get all categories
 */
export async function getAllCategories() {
  return prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
  });
}

/**
 * Get all tags
 */
export async function getAllTags() {
  return prisma.blogTag.findMany({
    orderBy: { name: "asc" },
  });
}

/**
 * Search blog posts
 */
export async function searchBlogPosts(
  query: string,
  { page = 1, perPage = 12 }: { page?: number; perPage?: number } = {}
) {
  const skip = (page - 1) * perPage;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        author: { select: { id: true, email: true } },
        categories: true,
        tags: true,
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.blogPost.count({
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  return { posts, total };
}
