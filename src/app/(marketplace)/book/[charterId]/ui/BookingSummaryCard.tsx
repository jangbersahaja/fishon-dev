"use client";

import { Calendar, Clock, MapPin, Ship, Users } from "lucide-react";
import Image from "next/image";

interface Boat {
  name?: string;
  type?: string;
  features?: string[];
}

interface Charter {
  id?: string;
  name?: string;
  location?: string;
  images?: string[];
  boat?: Boat;
  includes?: string[];
  coordinates?: { lat: number; lng: number };
}

interface Captain {
  name: string;
  avatarUrl?: string;
}

interface BookingSummaryCardProps {
  charter?: Charter;
  captain?: Captain | null;
  date?: string;
  days: number;
  adults: number;
  childrenCount: number;
  tripName?: string;
  startTime?: string;
  totalPrice: number;
}

export default function BookingSummaryCard({
  charter,
  captain,
  date,
  days,
  adults,
  childrenCount,
  tripName,
  startTime,
  totalPrice,
}: BookingSummaryCardProps) {
  const images = charter?.images || [];
  const mainImage = images[0] || "/placeholder-1.jpg";
  const sideImages = images.slice(1, 3);

  const mapEmbedSrc = charter?.coordinates
    ? `https://www.google.com/maps?q=${charter.coordinates.lat},${charter.coordinates.lng}&z=13&output=embed`
    : charter?.location
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        charter.location
      )}&z=13&output=embed`
    : null;

  return (
    <aside className="p-5 bg-white border rounded-2xl border-black/10 sm:p-6 h-fit">
      <h2 className="mb-4 text-base font-semibold sm:text-lg">
        Booking Summary
      </h2>

      {/* Photo Collage */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4 overflow-hidden h-60 sm:h-60 rounded-xl">
          {/* Main large image */}
          <div className="relative h-full col-span-2 bg-gray-100 sm:col-span-1 sm:row-span-2">
            <Image
              src={mainImage}
              alt={charter?.name || "Charter"}
              fill
              sizes="(max-width: 640px) 100vw, 300px"
              className="object-cover"
            />
          </div>

          {/* Two smaller images on the right */}
          {sideImages.map((img, idx) => (
            <div
              key={idx}
              className="relative hidden overflow-hidden bg-gray-100 sm:block"
            >
              <Image
                src={img}
                alt={`${charter?.name} - ${idx + 2}`}
                fill
                sizes="150px"
                className="object-cover"
              />
            </div>
          ))}

          {/* Fallback if only one image */}
          {sideImages.length === 0 && (
            <>
              <div className="relative hidden overflow-hidden bg-gray-200 sm:block aspect-video">
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  <Ship className="w-8 h-8" />
                </div>
              </div>
              <div className="relative hidden overflow-hidden bg-gray-200 sm:block aspect-video">
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  <Ship className="w-8 h-8" />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Charter Info */}
      <div className="pb-4 mb-4 border-b border-black/10">
        <h3 className="text-base font-semibold">
          {charter?.name || "Charter"}
        </h3>
        {captain?.name && (
          <p className="mt-1 text-sm text-gray-600">
            Captain:{" "}
            <span className="font-medium text-gray-800">{captain.name}</span>
          </p>
        )}
        {charter?.location && (
          <p className="flex items-start gap-1.5 mt-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{charter.location}</span>
          </p>
        )}
      </div>

      {/* Boat Details */}
      {charter?.boat && (
        <div className="pb-4 mb-4 border-b border-black/10">
          <div className="flex items-center gap-2 mb-2">
            <Ship className="w-4 h-4 text-gray-600" />
            <h4 className="text-sm font-semibold">
              {charter.boat.name || "Vessel"}
            </h4>
            {charter.boat.type && (
              <p className="text-sm text-gray-600">- {charter.boat.type}</p>
            )}
          </div>

          {charter.boat.features && charter.boat.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {charter.boat.features.slice(0, 3).map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700"
                >
                  {feature}
                </span>
              ))}
              {charter.boat.features.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                  +{charter.boat.features.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Amenities */}
      {charter?.includes && charter.includes.length > 0 && (
        <div className="pb-4 mb-4 border-b border-black/10">
          <h4 className="mb-2 text-sm font-semibold">Included</h4>
          <div className="flex flex-wrap gap-1.5">
            {charter.includes.slice(0, 4).map((item) => (
              <span
                key={item}
                className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-700 border border-green-200"
              >
                {item}
              </span>
            ))}
            {charter.includes.length > 4 && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">
                +{charter.includes.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="pb-4 mb-4 border-b border-black/10">
        {tripName && (
          <p className="mb-2 text-sm">
            <span className="text-gray-600">Trip:</span>{" "}
            <span className="font-medium text-gray-900">{tripName}</span>
          </p>
        )}

        {/* Trip Details */}
        <div className="flex items-center gap-2 border-black/10">
          {date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
              <span className="text-gray-700">
                {(() => {
                  try {
                    const dt = new Date(`${date}T00:00:00`);
                    return new Intl.DateTimeFormat(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(dt);
                  } catch {
                    return date;
                  }
                })()}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="text-gray-700">
              {days} day{days > 1 ? "s" : ""}
              {startTime && ` • Starts ${startTime}`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="text-gray-700">
              {adults} adult{adults > 1 ? "s" : ""}
              {childrenCount > 0 &&
                `, ${childrenCount} child${childrenCount > 1 ? "ren" : ""}`}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Total (est.)</span>
          <span className="text-[#ec2227]">RM{totalPrice}</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Final price confirmed by captain. No payment required now.
        </p>
      </div>

      {/* Map */}
      {mapEmbedSrc && (
        <div className="overflow-hidden rounded-lg">
          <iframe
            src={mapEmbedSrc}
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Starting location"
            className="w-full"
          />
        </div>
      )}

      {/* Payment Info */}
      <details className="mt-4 text-xs text-gray-600">
        <summary className="font-medium cursor-pointer select-none hover:text-gray-900">
          Payment information
        </summary>
        <p className="mt-2 leading-relaxed">
          No payment is required now. Once your booking is confirmed, the
          captain will send you a secure payment link.
        </p>
      </details>
    </aside>
  );
}
