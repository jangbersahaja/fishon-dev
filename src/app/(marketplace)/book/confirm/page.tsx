import BookingSummaryCard from "@/app/(marketplace)/book/[charterId]/ui/BookingSummaryCard";
import { prisma } from "@/lib/database/prisma";
import { getCharterById } from "@/lib/services/charter-service";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import NextActions from "./NextActions";
import StatusTimeline from "./StatusTimeline";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const sp = await searchParams;
  const id = sp.id;
  if (!id) {
    return (
      <main className="w-full px-4 py-6 mx-auto max-w-7xl sm:px-6">
        <h1 className="text-2xl font-bold">Booking not found</h1>
        <p className="mt-2 text-gray-600">Missing booking id.</p>
      </main>
    );
  }

  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) {
    return (
      <main className="w-full px-4 py-6 mx-auto max-w-7xl sm:px-6">
        <h1 className="text-2xl font-bold">Booking not found</h1>
        <p className="mt-2 text-gray-600">
          We couldn&apos;t find booking <code>{id}</code>.
        </p>
      </main>
    );
  }

  // Fetch charter data for rich display
  const charter = await getCharterById(booking.captainCharterId);

  const charterData = charter
    ? {
        id: String(charter.id),
        name: charter.name,
        location: charter.location,
        images: Array.isArray(charter.images)
          ? charter.images
          : charter.imageUrl
          ? [charter.imageUrl]
          : [],
        boat: charter.boat,
        includes: charter.includes,
        coordinates: charter.coordinates,
      }
    : undefined;

  const captainData = charter?.captain?.name
    ? {
        name: charter.captain.name,
        avatarUrl: charter.captain.avatarUrl,
      }
    : null;

  return (
    <main className="w-full py-6 mx-auto max-w-7xl sm:px-6 sm:py-10">
      {/* Hero Section */}
      <div className="py-8">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {booking.status === "PAID"
              ? "Booking Confirmed!"
              : "Request Received!"}
          </h1>
        </div>

        <p className="mt-2 text-gray-600">
          {booking.status === "PAID"
            ? "Your fishing trip is confirmed. Get ready for an amazing experience!"
            : "Your booking request has been sent to the captain for review."}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Booking reference:{" "}
          <code className="px-2 py-0.5 text-xs font-mono bg-gray-100 rounded">
            {booking.id}
          </code>
        </p>
      </div>

      {/* Main Grid: Timeline + Actions (left) | Summary (right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left Column - Shows on mobile first, then left on desktop */}
        <div className="order-2 space-y-6 lg:col-span-3 lg:order-1">
          {/* Booking Details Card */}
          <section className="p-5 bg-white border rounded-2xl border-black/10 sm:p-6">
            <h2 className="mb-4 text-base font-semibold sm:text-lg">
              Booking Details
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-gray-600">Charter</dt>
                <dd className="font-medium text-gray-900">
                  {booking.charterName}
                </dd>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-gray-600">Trip</dt>
                <dd className="font-medium text-gray-900">
                  {booking.tripName}
                </dd>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-gray-600">Date</dt>
                <dd className="font-medium text-gray-900">
                  {new Intl.DateTimeFormat(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }).format(booking.date)}
                </dd>
              </div>
              {booking.startTime && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-gray-600">Start time</dt>
                  <dd className="font-medium text-gray-900">
                    {booking.startTime}
                  </dd>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-gray-600">Duration</dt>
                <dd className="font-medium text-gray-900">
                  {booking.days} day{booking.days > 1 ? "s" : ""}
                </dd>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-gray-600">Guests</dt>
                <dd className="font-medium text-gray-900">
                  {booking.adults} adult{booking.adults > 1 ? "s" : ""}
                  {booking.children > 0 &&
                    `, ${booking.children} child${
                      booking.children > 1 ? "ren" : ""
                    }`}
                </dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-base font-semibold text-gray-900">Total</dt>
                <dd className="text-base font-bold text-[#ec2227]">
                  RM{booking.totalPrice}
                </dd>
              </div>
            </dl>
          </section>

          <StatusTimeline
            status={booking.status}
            expiresAt={booking.expiresAt}
          />

          {/* Next Steps / Actions */}
          <NextActions booking={booking} />
        </div>

        {/* Right Column - Summary (shows first on mobile) */}
        <div className="order-1 lg:col-span-2 lg:order-2">
          <BookingSummaryCard
            charter={charterData}
            captain={captainData}
            date={booking.date.toISOString().slice(0, 10)}
            days={booking.days}
            adults={booking.adults}
            childrenCount={booking.children}
            tripName={booking.tripName}
            startTime={booking.startTime || undefined}
            totalPrice={booking.totalPrice}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-8 mt-8 border-t border-gray-200">
        <Link
          href="/home"
          className="text-sm font-medium text-[#ec2227] hover:underline"
        >
          Browse More Charters
        </Link>
        <span className="text-gray-300">•</span>
        <Link
          href="/account/bookings"
          className="text-sm font-medium text-gray-600 hover:underline"
        >
          View All Bookings
        </Link>
        <span className="text-gray-300">•</span>
        <Link
          href="/help"
          className="text-sm font-medium text-gray-600 hover:underline"
        >
          Need Help?
        </Link>
      </div>
    </main>
  );
}
