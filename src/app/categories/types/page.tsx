// src/app/charters/categories/types/page.tsx
import CategoryCard from "@/components/CategoryCard";
import charters from "@/dummy/charter"; // from /charters/categories/types
import Link from "next/link";

function getCoverForType(type: string) {
  const t = (type || "").toLowerCase();
  const item = (charters as any[]).find(
    (c) =>
      ((c.fishingType || "") as string).toLowerCase() === t &&
      Array.isArray(c.images) &&
      c.images.length > 0
  );
  return item?.images?.[0] as string | undefined;
}

function normalizeLabel(s: string) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function TypesCategoriesPage() {
  // Gather counts per fishingType (case-insensitive)
  const counts = new Map<string, number>();

  (charters as any[]).forEach((c) => {
    const key = ((c.fishingType || "") as string).toLowerCase().trim();
    if (!key) return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  // In case you only want these 4 canonical types:
  const order = ["lake", "stream", "inshore", "offshore"];
  const items = order
    .map((key) => ({
      key,
      label: normalizeLabel(key),
      count: counts.get(key) || 0,
      image: getCoverForType(key),
    }))
    .filter((x) => x.count > 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-5">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/book" className="hover:underline">
          Home
        </Link>{" "}
        / <span className="text-gray-700 font-medium">Fishing Types</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">All Fishing Types</h1>
        <p className="mt-1 text-sm text-gray-600">
          Browse every fishing type available on Fishon. Tap a type to see all
          charters.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-gray-600">No fishing types found yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((t) => (
            <CategoryCard
              key={t.key}
              href={`/search/category/type/${t.key}`}
              label={t.label}
              count={t.count}
              image={t.image}
              alt={`${t.label} fishing`}
              subtitle={`Explore ${t.label.toLowerCase()} trips`}
            />
          ))}
        </div>
      )}

      {/* Back / Secondary nav */}
      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
        <Link
          href="/book"
          className="text-[#ec2227] hover:underline font-medium"
        >
          ← Back to Browse
        </Link>
        <span className="text-gray-300">•</span>
        <Link
          href="/categories/techniques"
          className="text-[#ec2227] hover:underline font-medium"
        >
          See all fishing techniques
        </Link>
      </div>
    </div>
  );
}
