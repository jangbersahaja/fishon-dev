import BaseCharterCard from "@/components/charters/BaseCharterCard";
import Breadcrumbs from "@/components/search/Breadcrumbs";
import ResultsMap from "@/components/search/ResultsMap";
import SearchResultsHeader from "@/components/search/SearchResultsHeader";
import type { Charter } from "@/data/mock/charter";
import type { MapItem } from "@/utils/mapItems";

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
    <main className="w-full mx-auto">
      {/* use real count instead of string length */}
      <SearchResultsHeader title={title} count={items.length} />

      <section className="w-full px-5 py-3 mx-auto mt-10 max-w-7xl sm:px-5">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/search", label: "Search" },
            { href: "/search/category/type", label: "Fishing Type" },
            { label: prettyType },
          ]}
        />

        <h3 className="mb-3 text-base font-semibold text-gray-900 md:mb-4 md:text-lg">
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
            />
          </div>

          {/* Related (right on desktop) */}
          <div className="hidden col-span-1 pl-5 lg:col-span-2 bg-gray-50 lg:block">
            {/* Give the rail a fixed height to force overflow-y to engage */}
            <div className="h-[32rem] overflow-y-auto pr-1">
              <div className="flex flex-col h-full gap-3">
                {sideItems.map((c) => (
                  <BaseCharterCard
                    key={c.id}
                    charter={c}
                    variant="compact"
                    imageAspect="square"
                    showFavoriteButton={true}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
