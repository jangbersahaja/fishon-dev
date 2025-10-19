import { auth } from "@/lib/auth";
import { getCharterById } from "@/lib/charter-service";
import { redirect } from "next/navigation";
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
  if (!session) redirect("/login");
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
  return (
    <main className="max-w-4xl p-6 mx-auto">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <CheckoutForm
        startTimes={startTimes}
        defaultStartTime={defaultStartTime}
      />
    </main>
  );
}
