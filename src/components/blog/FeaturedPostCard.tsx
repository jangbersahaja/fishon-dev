import type { BlogPostWithRelations } from "@/lib/blog-service";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type FeaturedPostCardProps = {
  post: BlogPostWithRelations;
};

export default function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-lg">
      <Link href={`/blog/${post.slug}`}>
        {/* Cover Image with Overlay */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#ec2227]/40 to-[#ec2227]/20 flex items-center justify-center">
              <span className="text-7xl">🎣</span>
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            {/* Categories */}
            {post.categories.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {post.categories.slice(0, 1).map((category) => (
                  <span
                    key={category.id}
                    className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium backdrop-blur-sm"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 className="mb-2 line-clamp-2 text-xl font-bold">
              {post.title}
            </h3>

            {/* Meta */}
            {post.publishedAt && (
              <div className="flex items-center gap-1 text-xs text-white/90">
                <Calendar size={14} />
                <time dateTime={post.publishedAt.toISOString()}>
                  {new Date(post.publishedAt).toLocaleDateString("en-MY", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
