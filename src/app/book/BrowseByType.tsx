import CategoryCard from "@/components/CategoryCard";
import { Charter } from "@/dummy/charter";
import Link from "next/link";

type CharterLite = {
  images?: string[];
  fishingType?: string;
};

const TYPE_DEFS = [
  { key: "lake", label: "Lake" },
  { key: "stream", label: "Stream" },
  { key: "inshore", label: "Inshore" },
  { key: "offshore", label: "Offshore" },
] as const;

function filterByType(
  list: CharterLite[],
  type: "lake" | "stream" | "inshore" | "offshore"
) {
  return list.filter((c) => (c.fishingType || "").toLowerCase() === type);
}

function getCoverForType(charters: Charter[], type: "lake" | "stream" | "inshore" | "offshore") {
  const item = charters.find(
    (c) =>
      (c.fishingType || "").toLowerCase() === type &&
      Array.isArray(c.images) &&
      c.images.length > 0
  );
  return item?.images?.[0] as string | undefined;
}

export default function BrowseByType({ charters }: { charters: Charter[] }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-2 md:px-0">
      <div className="w-full px-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Browse By Type</h2>
          <Link
            href="/categories/types"
            className="hidden text-sm font-medium text-[#ec2227] hover:underline md:inline"
          >
            See all fishing types
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {TYPE_DEFS.map((t) => {
            const count = filterByType(
              charters,
              t.key as "lake" | "stream" | "inshore" | "offshore"
            ).length;
            return (
              <CategoryCard
                key={t.key}
                href={`/search/category/type/${t.key}`}
                label={t.label}
                count={count}
                subtitle={`Explore ${t.label.toLowerCase()} trips`}
                image={getCoverForType(
                  charters,
                  t.key as "lake" | "stream" | "inshore" | "offshore"
                )}
                alt={`${t.label} fishing`}
              />
            );
          })}
        </div>
        <div className="mt-4 flex justify-start md:hidden">
          <Link
            href="/categories/types"
            className="text-sm font-semibold text-[#ec2227] hover:underline"
          >
            See all fishing types
          </Link>
        </div>
      </div>
    </section>
  );
}
