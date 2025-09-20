import charters, { Charter, Trip } from "@/dummy/charter";
import { receipts, type BookingReview } from "@/dummy/receipts";
import type { Metadata } from "next";
import Link from "next/link";
import AboutSection from "@/components/charter/AboutSection";
import AmenitiesCard from "@/components/charter/AmenitiesCard";
import BoatCard from "@/components/charter/BoatCard";
import BookingWidget from "@/components/charter/BookingWidget";
import CaptainSection from "@/components/charter/CaptainSection";
import CharterGallery from "@/components/charter/CharterGallery";
import GuestFeedbackPanel from "@/components/charter/GuestFeedbackPanel";
import LocationMap from "@/components/charter/LocationMap";
import PoliciesInfoCard from "@/components/charter/PoliciesInfoCard";
import ReviewsList from "@/components/charter/ReviewsList";
import SpeciesTechniquesCard from "@/components/charter/SpeciesTechniquesCard";
import Stars from "@/components/charter/Stars";

type RouteParams = Promise<{ id: string }>;
type RouteSearchParams = Promise<{
  booking_persons?: string;
  booking_days?: string;
  trip_index?: string;
}>;

function toInt(v: string | undefined, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function getCharterReviews(charterId: number) {
  const list = (receipts as BookingReview[]).filter(
    (t) => t.charterId === charterId
  );
  const avg = list.length
    ? list.reduce((s, r) => s + (r.overallRating || 0), 0) / list.length
    : 0;

  return { list, avg, count: list.length };
}

function getImagesArray(c?: Charter): string[] {
  if (!c)
    return ["/placeholder-1.jpg", "/placeholder-2.jpg", "/placeholder-3.jpg"];
  if (Array.isArray(c.images) && c.images.length > 0) return c.images;
  if (c.imageUrl) return [c.imageUrl];
  return ["/placeholder-1.jpg", "/placeholder-2.jpg", "/placeholder-3.jpg"];
}

export async function generateMetadata(
  props: { params: RouteParams }
): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;
  const charter: Charter | undefined = Array.isArray(charters)
    ? (charters as Charter[]).find((c) => String(c.id) === String(id))
    : undefined;

  const title = charter?.name || `Charter #${id}`;
  const location = charter?.location ? ` — ${charter.location}` : "";
  const desc =
    charter?.description ||
    "Book fishing charters around Malaysia. Find availability, pricing and trip details.";
  const images = getImagesArray(charter);

  return {
    title: `${title}${location} — Fishon.my`,
    description: desc,
    robots: { index: false, follow: true },
    openGraph: {
      title: `${title}${location} — Fishon.my`,
      description: desc,
      images: images.length ? [{ url: images[0] }] : [{ url: "/og-image.jpg" }],
    },
  };
}

export default async function CharterViewPage({
  params,
  searchParams,
}: {
  params: RouteParams;
  searchParams: RouteSearchParams;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const charter: Charter | undefined = Array.isArray(charters)
    ? (charters as Charter[]).find((c) => String(c.id) === String(id))
    : undefined;

  const cid = Number(id);
  const {
    list: reviews,
    avg: ratingAvg,
    count: ratingCount,
  } = Number.isFinite(cid)
    ? getCharterReviews(cid)
    : { list: [], avg: 0, count: 0 };

  const persons = toInt(resolvedSearchParams.booking_persons, 2);

  const trips: Trip[] = Array.isArray(charter?.trip) ? charter!.trip : [];
  const tripIndex = Math.min(
    Math.max(toInt(resolvedSearchParams.trip_index, 0), 0),
    Math.max(trips.length - 1, 0)
  );
  const selectedTrip = trips[tripIndex];

  const title = charter?.name || `Charter #${id}`;
  const location = charter?.location || "Malaysia";
  const address = charter?.address;
  const desc =
    charter?.description ||
    "A great fishing charter operating in Malaysia. Trips available for lakes, rivers, inshore and offshore.";

  const images: string[] = getImagesArray(charter);

  const boat = charter?.boat;
  const tripMaxAnglers =
    selectedTrip?.maxAnglers && selectedTrip.maxAnglers > 0
      ? selectedTrip.maxAnglers
      : undefined;
  const boatCapacity =
    typeof boat?.capacity === "number" && boat!.capacity > 0
      ? boat!.capacity
      : undefined;
  const personsMax = tripMaxAnglers ?? boatCapacity;

  const mapEmbedSrc = charter?.coordinates
    ? `https://www.google.com/maps?q=${charter.coordinates.lat},${charter.coordinates.lng}&z=13&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(
        address || location
      )}&z=13&output=embed`;

  if (!charter) {
    return (
      <main className="min-h-dvh bg-white">
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h1 className="text-2xl font-bold">Charter not found</h1>
          <p className="mt-2 text-gray-600">
            We couldn&apos;t find the charter with ID <code>{id}</code>. Please
            check the URL or return to the listings.
          </p>
          <div className="mt-4">
            <Link href="/book" className="text-[#ec2227] underline">
              Back to Book
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-white">
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Breadcrumbs */}
        <nav className="pt-6 text-sm text-gray-500">
          <Link href="/book" className="hover:underline">
            Home
          </Link>{" "}
          <span>/</span> <span className="">Charters</span> <span>/</span>{" "}
          <Link
            href={`/search?destination=${charter.location.split(",")[1]}`}
            className="hover:underline"
          >
            {charter.location.split(",")[1]}
          </Link>{" "}
          <span>/</span>{" "}
          <Link
            href={`/search?destination=${charter.location}`}
            className="hover:underline"
          >
            {charter.location.split(",")[0]}
          </Link>
        </nav>

        {/* Header */}
        <header className="mt-4 flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {address && <p className="text-sm text-gray-500">{address}</p>}
          {ratingCount > 0 && (
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">
              <Stars value={ratingAvg} />
              <span className="font-medium">{ratingAvg.toFixed(1)}</span>
              <span className="text-gray-500">
                ({ratingCount} review{ratingCount === 1 ? "" : "s"})
              </span>
            </div>
          )}
        </header>

        {/* Gallery */}
        <div className="mt-6">
          <CharterGallery images={images} title={title} />
        </div>

        {/* Main grid */}
        <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-5">
          {/* Left column */}
          <div className="md:col-span-3">
            <AboutSection description={desc} />

            {/* Captain */}
            <CaptainSection charter={charter} />

            {/* Boat */}
            <BoatCard charter={charter} />

            {/* Species + Techniques */}
            <SpeciesTechniquesCard charter={charter} />

            {/* Amenities */}
            <AmenitiesCard charter={charter} />

            {/* Map */}
            <LocationMap title={title} mapEmbedSrc={mapEmbedSrc} />
          </div>

          {/* Right column: Booking */}
          <div className="h-full md:col-span-2 md:self-start">
            <div className="h-fit md:sticky md:top-6">
              <BookingWidget
                trips={trips}
                defaultPersons={persons}
                personsMax={personsMax}
                childFriendly={!!charter?.policies?.childFriendly}
              />
            </div>
          </div>
        </section>

        <PoliciesInfoCard charter={charter} />

        {/* Feedback summary */}
        <GuestFeedbackPanel
          reviews={reviews}
          ratingAvg={ratingAvg}
          ratingCount={ratingCount}
        />

        {/* Reviews (Airbnb-style two-column) */}
        <ReviewsList reviews={reviews} />
      </section>
    </main>
  );
}
