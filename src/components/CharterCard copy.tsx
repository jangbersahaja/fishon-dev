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
      className="flex flex-col h-full overflow-hidden transition-shadow bg-white border shadow-sm group rounded-2xl border-black/10 hover:shadow-md"
    >
      {/* Cover image */}
      <div className="relative w-full h-56 md:h-64">
        {/* Glass overlay: title + rating + type pill */}
        <div className="absolute left-0 right-0 bottom-0 z-[1] flex items-start justify-between gap-2 bg-white/70 px-5 py-2.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="min-w-0">
            <h3 className="text-sm font-bold leading-tight truncate lg:text-lg">
              <span className="hover:underline">{c.name}</span>
            </h3>
            <div className="flex items-center gap-2 mt-1">
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
        <SafeImage
          src={img}
          alt={`${c.name} cover`}
          fill
          className="object-cover"
        />
      </div>

      {/* Body */}
      <div className="px-4 py-2.5 sm:px-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="" />
          {/* Captain row */}
          <div className="flex items-center gap-2 text-xs text-gray-700">
            {captainAvatar ? (
              <span className="relative w-6 h-6 overflow-hidden border rounded-full border-black/10">
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

          {/* Compact meta */}
          <div className="mt-2 text-xs text-gray-600">
            <strong>Boat:</strong> {c.boat.type}
            <span className="text-gray-400"> • </span>
            {c.boat.capacity} pax
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

          {/* Badges: species / techniques (first few) */}
          <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
            {Array.isArray(c.species) &&
              c.species.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="px-2 py-1 border rounded-full border-black/10 bg-gray-50"
                >
                  {s}
                </span>
              ))}
            {Array.isArray(c.techniques) &&
              c.techniques.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 border rounded-full border-black/10 bg-gray-50"
                >
                  {t}
                </span>
              ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 mt-4 border-t border-black/10">
          {typeof minPrice === "number" ? (
            <div className="leading-tight">
              <span className="text-sm text-gray-500">Trips From</span>{" "}
              <span className="text-xl font-bold text-[#ec2227]">
                RM{minPrice}
              </span>
            </div>
          ) : (
            <span />
          )}

          <Link
            href={`/charters/view/${c.id}?${params.toString()}`}
            className="rounded-md bg-[#ec2227] px-3 py-2 text-sm font-semibold text-white hover:translate-y-px transition"
          >
            View details
          </Link>
        </div>
      </div>
    </Link>
  );
}
