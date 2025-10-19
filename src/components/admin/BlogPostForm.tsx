"use client";

import type { BlogCategory, BlogPost, BlogTag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RichTextEditor from "./RichTextEditor";

interface BlogPostFormProps {
  post?: BlogPost & { categories: BlogCategory[]; tags: BlogTag[] };
  allCategories: BlogCategory[];
  allTags: BlogTag[];
  authorId: string;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function BlogPostForm({
  post,
  allCategories,
  allTags,
  authorId,
  onSubmit,
}: BlogPostFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(post?.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories?.map((c) => c.id) || []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    post?.tags?.map((t) => t.id) || []
  );

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    formData.set("authorId", authorId);
    formData.set("categoryIds", selectedCategories.join(","));
    formData.set("tagIds", selectedTags.join(","));

    // Auto-generate slug if not provided
    const slug = formData.get("slug") as string;
    if (!slug) {
      const title = formData.get("title") as string;
      formData.set("slug", generateSlug(title));
    }

    try {
      await onSubmit(formData);
      // The server action will handle the redirect
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error saving post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Post Details</h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={post?.title}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#EC2227] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700"
            >
              Slug (auto-generated if empty)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              defaultValue={post?.slug}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#EC2227] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700"
            >
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              defaultValue={post?.excerpt || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#EC2227] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Content</h2>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Cover Image</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="coverImage"
              className="block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              type="text"
              id="coverImage"
              name="coverImage"
              defaultValue={post?.coverImage || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#EC2227] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="coverImageAlt"
              className="block text-sm font-medium text-gray-700"
            >
              Alt Text
            </label>
            <input
              type="text"
              id="coverImageAlt"
              name="coverImageAlt"
              defaultValue={post?.coverImageAlt || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#EC2227] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Categories</h2>
          <div className="space-y-2">
            {allCategories.map((category) => (
              <label key={category.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Tags</h2>
          <div className="space-y-2">
            {allTags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{tag.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Publishing</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            value="true"
            defaultChecked={post?.published}
            className="rounded border-gray-300"
          />
          <span className="text-sm font-medium">Publish immediately</span>
        </label>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-[#EC2227] px-6 py-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : post ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  );
}
