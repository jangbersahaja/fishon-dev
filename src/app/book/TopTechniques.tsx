import CategoryCard from "@/components/CategoryCard";
import { Charter } from "@/dummy/charter";
import Link from "next/link";

type CharterLite = {
  images?: string[];
  techniques?: string[];
};

const TECHNIQUE_DEFS = [
  "Jigging",
  "Trolling",
  "Casting",
  "Bottom Fishing",
  "Topwater",
  "Fly Fishing",
  "Drift Fishing",
  "Squid/Eging",
] as const;

function filterByTechnique(list: CharterLite[], technique: string) {
  const t = technique.toLowerCase();
  return list.filter(
    (c: any) =>
      Array.isArray(c.techniques) &&
      c.techniques.some((x: string) => (x || "").toLowerCase() === t)
  );
}

function getCoverForTechnique(charters: Charter[], technique: string) {
  const t = technique.toLowerCase();
  const item = charters.find(
    (c) =>
      Array.isArray(c.techniques) &&
      c.techniques.some((x: string) => (x || "").toLowerCase() === t) &&
      Array.isArray(c.images) &&
      c.images.length > 0
  );
  return item?.images?.[0] as string | undefined;
}

export default function TopTechniques({ charters }: { charters: Charter[] }) {
  const withCounts = TECHNIQUE_DEFS.map((tech) => {
    const count = filterByTechnique(charters, tech).length;
    return { tech, count };
  })
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <section className="mx-auto w-full max-w-7xl px-2 md:px-0">
      <div className="w-full px-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Top Fishing Techniques</h2>
          <Link
            href="/categories/techniques"
            className="hidden text-sm font-medium text-[#ec2227] hover:underline md:inline"
          >
            See all fishing techniques
          </Link>
        </div>

        {withCounts.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {withCounts.map(({ tech, count }) => (
              <CategoryCard
                key={tech}
                href={`/search/category/technique/${encodeURIComponent(
                  tech.toLowerCase()
                )}`}
                label={tech}
                count={count}
                subtitle={`Charters using ${tech.toLowerCase()}`}
                image={getCoverForTechnique(charters, tech)}
                alt={`${tech} technique`}
              />
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-start md:hidden">
          <Link
            href="/categories/techniques"
            className="text-sm font-semibold text-[#ec2227] hover:underline"
          >
            See all fishing techniques
          </Link>
        </div>
      </div>
    </section>
  );
}
