"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

// Must mirror buckets used server-side
const PRICE_BUCKETS = [
  { key: "0-500", label: "RM0 – RM500" },
  { key: "501-1000", label: "RM501 – RM1000" },
  { key: "1001-2000", label: "RM1001 – RM2000" },
  { key: "2001-5000", label: "RM2001 – RM5000" },
  { key: "5001+", label: "RM5001+" },
] as const;

type Props = {
  orderby: string;
  priceRange?: string;
  tripType?: string;
  pickup?: string; // "1" | "true" | undefined
  childFriendly?: string; // "1" | "true" | undefined
  destination?: string;
  date?: string;
  adults?: number;
  children?: number;
  tripNames: string[]; // unique trip names coming from server
};

export default function FiltersBar({
  orderby,
  priceRange,
  tripType,
  pickup,
  childFriendly,
  destination,
  date,
  adults,
  children,
  tripNames,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [open, setOpen] = useState(true);

  // On mount, default collapsed on mobile (< md), open on desktop (>= md)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    setOpen(mq.matches);
    const handler = (e: MediaQueryListEvent) => setOpen(e.matches);
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handler);
    } else {
      // Fallback for older browsers
      mq.addListener(handler);
    }
    return () => {
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", handler);
      } else {
        mq.removeListener(handler);
      }
    };
  }, []);

  const setParam = useCallback(
    (key: string, value: string | undefined) => {
      const qs = new URLSearchParams(sp?.toString());
      if (value == null || value === "") qs.delete(key);
      else qs.set(key, value);
      router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
    },
    [pathname, router, sp]
  );

  const toggleBool = useCallback(
    (key: string, checked: boolean) => {
      const qs = new URLSearchParams(sp?.toString());
      if (checked) qs.set(key, "1");
      else qs.delete(key);
      router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
    },
    [pathname, router, sp]
  );

  const clearAllUrl = useMemo(() => {
    const qs = new URLSearchParams();
    if (destination) qs.set("destination", destination);
    if (date) qs.set("date", date);
    if (adults && adults > 0) qs.set("adults", String(adults));
    if (children && children > 0) qs.set("children", String(children));
    // Default sort after reset
    qs.set("orderby", "recommended");
    return `${pathname}?${qs.toString()}`;
  }, [adults, children, date, destination, pathname]);

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="mt-5 rounded-xl border border-black/10 bg-white"
    >
      <summary className="cursor-pointer list-none px-3 py-3 sm:px-4 sm:py-4 md:hidden flex items-center justify-between">
        <span className="font-semibold">Filters & Sorting</span>
        {open ? (
          <IoChevronUp className="text-gray-600" />
        ) : (
          <IoChevronDown className="text-gray-600" />
        )}
      </summary>
      <div className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          {/* Sort */}
          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium">Sort by</span>
            <select
              name="orderby"
              value={orderby}
              onChange={(e) => setParam("orderby", e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="recommended">Recommended</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
              <option value="capacity_desc">Capacity</option>
              <option value="name_asc">Name (A–Z)</option>
            </select>
          </label>

          {/* Filters row */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {/* Price range */}
            <select
              name="price_range"
              value={priceRange || ""}
              onChange={(e) => setParam("price_range", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Price: Any</option>
              {PRICE_BUCKETS.map((b) => (
                <option key={b.key} value={b.key}>
                  {b.label}
                </option>
              ))}
            </select>

            {/* Trip type */}
            <select
              name="trip_type"
              value={tripType || ""}
              onChange={(e) => setParam("trip_type", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Trip: Any</option>
              {tripNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="pickup"
                checked={pickup === "1" || pickup === "true"}
                onChange={(e) => toggleBool("pickup", e.target.checked)}
              />
              <span>Pickup available</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="child_friendly"
                checked={childFriendly === "1" || childFriendly === "true"}
                onChange={(e) => toggleBool("child_friendly", e.target.checked)}
              />
              <span>Child friendly</span>
            </label>

            {/* Reset */}
            <a
              href={clearAllUrl}
              className="ml-auto rounded-lg border border-black/10 bg-white px-3 py-2 text-sm hover:bg-gray-50"
              onClick={(e) => {
                e.preventDefault();
                router.replace(clearAllUrl, { scroll: false });
              }}
            >
              Reset
            </a>
          </div>
        </div>
      </div>
    </details>
  );
}
