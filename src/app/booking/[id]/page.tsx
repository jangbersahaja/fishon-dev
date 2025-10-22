import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BookingPublicPage({
  params,
}: {
  params: { id: string };
}) {
  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) {
    return (
      <main className="max-w-3xl p-6 mx-auto">
        <h1 className="text-2xl font-bold">Booking not found</h1>
        <p className="mt-2 text-gray-600">We couldn’t find that booking.</p>
        <Link href="/" className="text-[#ec2227] underline mt-4 inline-block">
          Back home
        </Link>
      </main>
    );
  }
  return (
    <main className="max-w-3xl p-6 mx-auto">
      <h1 className="text-2xl font-bold">Booking</h1>
      <section className="p-4 mt-6 border rounded">
        <dl className="text-sm text-black/70">
          <div className="flex justify-between py-1">
            <dt>ID</dt>
            <dd>{booking.id}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Charter</dt>
            <dd>{booking.charterName}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Trip</dt>
            <dd>{booking.tripName}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Date</dt>
            <dd>{booking.date.toISOString().slice(0, 10)}</dd>
          </div>
          {booking.startTime && (
            <div className="flex justify-between py-1">
              <dt>Start time</dt>
              <dd>{booking.startTime}</dd>
            </div>
          )}
          <div className="flex justify-between py-1">
            <dt>Days</dt>
            <dd>{booking.days}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Total</dt>
            <dd>RM {booking.totalPrice}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Status</dt>
            <dd>{booking.status}</dd>
          </div>
        </dl>
      </section>
      <div className="mt-6">
        <Link className="text-[#ec2227] underline" href="/">
          Back home
        </Link>
      </div>
    </main>
  );
}
