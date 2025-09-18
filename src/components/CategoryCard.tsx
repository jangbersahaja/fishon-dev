// src/components/CategoryCard.tsx
import Image from "next/image";
import Link from "next/link";

export type CategoryCardProps = {
  href: string;
  label: string;
  count: number;
  subtitle?: string;
  image?: string;
  alt?: string;
  className?: string;
};

export default function CategoryCard({
  href,
  label,
  count,
  image,
  alt,
  className = "",
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-xl border border-black/10 bg-white transition hover:shadow-md ${className}`}
    >
      <div className="relative h-36 w-full sm:h-44">
        {image ? (
          <Image
            src={image}
            alt={alt || label}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={false}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-opacity group-hover:from-black/70 group-hover:via-black/40" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h4 className="text-white drop-shadow-md text-base font-semibold">
            {label}
          </h4>
          <div className="mt-2 inline-flex items-center gap-2">
            <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-900 backdrop-blur">
              {count.toLocaleString("en-MY")} trips
            </span>
            <span className="text-xs text-white/95 group-hover:underline">
              Browse
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="animate-pulse relative block overflow-hidden rounded-xl border border-black/10 bg-gray-100">
      <div className="h-36 w-full sm:h-44 bg-gray-200" />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="h-4 w-24 bg-gray-300 rounded mb-2" />
        <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-20 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
