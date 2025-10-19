import { prisma } from "@/lib/prisma";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { createBlogPost } from "../actions";

async function getFormData() {
  const [categories, tags, users] = await Promise.all([
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.blogTag.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ select: { id: true, email: true } }),
  ]);

  return { categories, tags, users };
}

export default async function NewBlogPostPage() {
  const { categories, tags, users } = await getFormData();
  const defaultAuthor = users[0]?.id || "";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
        <p className="text-sm text-gray-600">
          Write and publish a new blog post
        </p>
      </div>

      <BlogPostForm
        allCategories={categories}
        allTags={tags}
        authorId={defaultAuthor}
        onSubmit={createBlogPost}
      />
    </div>
  );
}
