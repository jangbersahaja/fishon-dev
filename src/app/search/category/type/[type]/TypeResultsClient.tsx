import Breadcrumbs from "@/components/search/Breadcrumbs";
import ResultsGrid from "@/components/search/ResultsGrid";
import ResultsMap from "@/components/search/ResultsMap";
import SearchResultsHeader from "@/components/search/SearchResultsHeader";
import type { Charter } from "@/dummy/charter";
import type { MapItem } from "@/utils/mapItems";
import Image from "next/image";
import Link from "next/link";

export default function TypeResultsClient({
  prettyType,
  items,
  mapItems,
  fallbackCenter,
  title,
}: {
  prettyType: string;
  items: Charter[];
  mapItems: MapItem[];
  fallbackCenter: { lat: number; lng: number };
  title: string;
}) {
  // keep the rail light
  const sideItems = items.slice(0, 12);

  return (
    <main className="mx-auto w-full">
      {/* use real count instead of string length */}
      <SearchResultsHeader title={title} count={items.length} />

      <section className="mx-auto w-full max-w-6xl mt-10 px-5 sm:px-5 py-3">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/search", label: "Search" },
            { href: "/search/category/type", label: "Fishing Type" },
            { label: prettyType },
          ]}
        />

        <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold text-gray-900">
          {prettyType} Charters Nearby You
        </h3>

        <div className="w-full grid grid-cols-1 lg:grid-cols-5 rounded-2xl overflow-hidden lg:h-[32rem] lg:shadow-md lg:ring lg:ring-black/10">
          {/* Map (left on desktop) */}
          <div className="col-span-1 lg:col-span-3">
            <ResultsMap
              idBase="type"
              items={mapItems}
              initialCenter={fallbackCenter}
              sectionTitle={`${prettyType} Trips Nearby You`}
              screenshotSrc="/static/maps/technique-map-screenshot.png"
            />
          </div>

          {/* Related (right on desktop) */}
          <div className="col-span-1 lg:col-span-2 bg-gray-50 pl-5 hidden lg:block">
            {/* Give the rail a fixed height to force overflow-y to engage */}
            <div className="h-[32rem] overflow-y-auto pr-1">
              <div className="flex flex-col gap-3 h-full">
                {sideItems.map((c) => (
                  <RelatedCharterCard
                    key={c.id}
                    charter={c}
                    orientation="landscape"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex lg:hidden">
          <ResultsGrid items={items} />
        </div>
      </section>
    </main>
  );
}

/* --- Inline card component (extract later if you like) --- */

function RelatedCharterCard({
  charter,
  className = "",
  orientation = "auto",
}: {
  charter: Charter;
  className?: string;
  orientation?: "auto" | "landscape";
}) {
  const href = `/charters/view/${charter.id}`;
  const img =
    (Array.isArray(charter.images) && charter.images[0]) ||
    charter.imageUrl ||
    "/placeholder.jpg";

  const minPrice =
    Array.isArray(charter.trip) && charter.trip.length
      ? Math.min(...charter.trip.map((t: any) => Number(t.price || 0)))
      : 0;

  // Desktop rail cards should be 16:9 landscape; mobile cards 16:9 portrait
  const isLandscape = orientation === "landscape";

  return (
    <Link
      href={href}
      className={[
        "group rounded-xl border border-black/10 bg-white shadow-sm hover:shadow-md transition-shadow ",
        // Sizing & aspect ratios per device/orientation
        isLandscape
          ? "w-full aspect-[16/9] flex h-44" // desktop rail
          : "w-44 aspect-[9/16] flex shrink-0 snap-start flex-col", // mobile portrait
        className,
      ].join(" ")}
    >
      {/* Square thumbnail for both variants */}

      <div className="relative w-44 h-44 rounded-lg overflow-hidden flex-none">
        <Image
          src={img}
          alt={charter.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="176px"
        />
      </div>

      {/* Meta */}
      <div className="flex min-w-0 flex-1 flex-col p-3 pt-4">
        <h5 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {charter.name}
        </h5>
        <p className="mt-1 text-xs text-gray-600 line-clamp-1">
          {charter.location}
        </p>

        {/* Price pinned to bottom, brand color */}
        <div className="mt-auto pt-2">
          <span className="mr-1 text-xs text-gray-500">Trips From</span>
          <span className="text-sm font-semibold text-[#EC2227]">
            RM{minPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}
