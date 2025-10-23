import { auth } from "@/lib/auth";
import { getCharterById } from "@/lib/charter-service";
import { prisma } from "@/lib/prisma";
import CheckoutForm from "./ui/CheckoutForm";

type RouteSearchParams = Promise<{
  charterId?: string;
  trip_index?: string;
  date?: string;
  days?: string;
  adults?: string;
  children?: string;
  start_time?: string;
}>;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: RouteSearchParams;
}) {
  const session = await auth();
  const sp = await searchParams;
  const charterId = sp.charterId;
  const tripIndex = Number.isFinite(Number(sp.trip_index))
    ? Number(sp.trip_index)
    : 0;
  const charter = charterId ? await getCharterById(charterId) : undefined;
  const trips = Array.isArray(charter?.trip) ? charter!.trip : [];
  const selectedTrip = trips[tripIndex] ?? trips[0];
  const startTimes: string[] | undefined = Array.isArray(
    (selectedTrip as any)?.startTimes
  )
    ? (selectedTrip as any).startTimes
    : undefined;
  const defaultStartTime =
    sp.start_time && typeof sp.start_time === "string"
      ? sp.start_time
      : undefined;

  // Prefill user details if available
  let defaultUser:
    | { firstName?: string; lastName?: string; email?: string }
    | undefined;
  if (session?.user?.id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: String((session.user as any).id) },
        select: { displayName: true, email: true },
      });
      if (user) {
        const name = user.displayName || "";
        const [firstName, ...rest] = name.split(" ");
        const lastName = rest.join(" ").trim() || undefined;
        defaultUser = {
          firstName: firstName || undefined,
          lastName,
          email: user.email || undefined,
        };
      }
    } catch {}
  } else if (session?.user?.email) {
    defaultUser = { email: session.user.email || undefined };
  }
  const charterData = charter
    ? {
        id: charterId,
        name: charter.name,
        location: charter.location,
        species: charter.species,
        techniques: charter.techniques,
        images:
          Array.isArray(charter.images) && charter.images.length
            ? charter.images
            : charter.imageUrl
            ? [charter.imageUrl]
            : ["/placeholder-1.jpg"],
        boat: charter.boat,
        includes: charter.includes,
        coordinates: charter.coordinates,
        captain: charter.captain,
      }
    : undefined;

  return (
    <main className="w-full min-h-screen px-4 py-6 mx-auto bg-gray-50 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
          Complete Your Booking
        </h1>
        <p className="text-sm text-gray-600 sm:text-base">
          Review your trip details and tell the captain about yourself
        </p>
        <CheckoutForm
          startTimes={startTimes}
          defaultStartTime={defaultStartTime}
          trips={trips as any}
          selectedTripIndex={tripIndex}
          charter={charterData as any}
          defaultUser={defaultUser}
        />
      </div>
    </main>
  );
}
