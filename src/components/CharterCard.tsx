// src/app/components/CharterCard.tsx
import { Charter } from "@/dummy/charter";
import { getAverageRating, getCharterReviews } from "@/lib/ratings";
import Link from "next/link";
import SafeImage from "./SafeImage";
import StarRating from "./ratings/StarRating";

export default function CharterCard({
  charter,
  context,
}: {
  charter: Charter;
  context?: {
    date?: string;
    adults?: number;
    children?: number;
    guestsParam?: number;
  };
}) {
  const c = charter;
  const img =
    (c.images && c.images[0]) || (c as any).imageUrl || "/placeholder-1.jpg";
  const minPrice =
    c.trip && c.trip.length
      ? Math.min(...c.trip.map((t) => t.price))
      : undefined;

  // Build link params preserving booking context
  const params = new URLSearchParams();
  if (context?.adults) params.set("adults", String(context.adults));
  if (context?.children) params.set("children", String(context.children));
  const total =
    (typeof context?.adults === "number" ? context!.adults : 0) +
      (typeof context?.children === "number" ? context!.children : 0) ||
    context?.guestsParam ||
    0;
  if (total) params.set("booking_persons", String(total));
  if (context?.date) params.set("date", context.date);

  // NEW: use new captain object (fallback kept for older shapes)
  const captain = (c as any).captain || null;
  const captainName =
    captain?.name || (c as any).captainName || "Not specified";
  const captainYears =
    typeof captain?.yearsExperience === "number"
      ? captain.yearsExperience
      : undefined;
  const crewCount =
    typeof captain?.crewCount === "number" ? captain.crewCount : undefined;
  const captainAvatar = captain?.avatarUrl as string | undefined;

  // NEW: fishing type pill
  const fishingType = (c as any).fishingType as string | undefined; // "lake" | "river" | "inshore" | "offshore"

  // Ratings (from dummy transactions)
  const avg = getAverageRating(charter.id);
  const reviews = getCharterReviews(charter.id);

  // Small helper for title-casing simple tokens
  const titleCase = (s?: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  return (
    <Link
      href={`/charters/view/${c.id}?${params.toString()}`}
      className="group h-full flex flex-col hover:bg-gray-50 hover:scale-101 rounded-2xl transition-all duration-300 ease-in-out"
    >
      {/* Cover image */}
      <div className="relative w-full h-56 md:h-64 rounded-2xl overflow-hidden ">
        <SafeImage
          src={img}
          alt={`${c.name} cover`}
          fill
          className="object-cover group-hover:scale-105 transition-all duration-300 ease-in-out"
        />
      </div>

      {/* Body */}
      <div className="p-3 flex-1 flex flex-col gap-3">
        <div className=" flex items-start justify-between gap-2 ">
          <div className="min-w-0">
            <h3 className="text-sm lg:text-lg font-bold leading-tight truncate">
              <span className="text-lg">{c.name}</span>
            </h3>
            <div className="mt-1 flex items-center gap-2">
              {avg ? (
                <>
                  <StarRating value={avg} size={14} />
                  <span className="text-[11px] text-gray-600">
                    {reviews.length} reviews
                  </span>
                </>
              ) : (
                <span className="text-[11px] text-gray-500">
                  No reviews yet
                </span>
              )}
            </div>
          </div>

          {fishingType && (
            <div className="shrink-0">
              <span className="inline-flex items-center rounded-full bg-[#ec2227]/10 text-[#ec2227] px-2.5 py-1 text-[11px] font-medium">
                {titleCase(fishingType)}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {/* Compact meta */}
          <div className="text-xs text-gray-600">
            <strong>Boat:</strong> {c.boat.type}
            <span className="text-gray-400"> • </span>
            {c.boat.capacity} pax
          </div>
          {/* Captain row */}
          <div className="flex items-center gap-2 text-xs text-gray-700">
            {captainAvatar ? (
              <span className="relative h-6 w-6 overflow-hidden rounded-full border border-black/10">
                <SafeImage
                  src={captainAvatar}
                  alt={`${captainName} avatar`}
                  fill
                  className="object-cover"
                />
              </span>
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[10px] text-gray-600">
                {captainName
                  .split(" ")
                  .map((p: string) => p[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            )}
            <span className="truncate">
              <strong>Captain:</strong> {captainName}
              {captainYears !== undefined && (
                <span className="text-gray-500"> • {captainYears} yrs</span>
              )}
              {crewCount !== undefined && (
                <span className="text-gray-500"> • {crewCount} crew</span>
              )}
            </span>
          </div>

          {/* Badges: species / techniques (first few) */}
          <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
            {Array.isArray(c.species) &&
              c.species.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-black/10 bg-gray-50 px-2 py-1"
                >
                  {s}
                </span>
              ))}
            {Array.isArray(c.techniques) &&
              c.techniques.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-black/10 bg-gray-50 px-2 py-1"
                >
                  {t}
                </span>
              ))}
          </div>

          {/* Trip list */}
          {Array.isArray(c.trip) && c.trip.length > 0 && (
            <div className="mt-2.5 text-xs text-gray-700">
              <strong>Trips:</strong>{" "}
              {c.trip
                .map((t) => t.name)
                .filter(Boolean)
                .join(" • ")}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          {typeof minPrice === "number" ? (
            <div className="flex items-center gap-1">
              <span className="text-gray-500 text-sm">From</span>
              <span className="text-xl font-bold text-[#ec2227]">
                RM{minPrice}
              </span>
              <span className="text-gray-500 text-sm">/Day</span>
            </div>
          ) : (
            <span />
          )}
        </div>
      </div>
    </Link>
  );
}
