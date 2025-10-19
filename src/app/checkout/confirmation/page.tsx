import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const sp = await searchParams;
  const id = sp.id;
  if (!id) {
    return (
      <main className="max-w-3xl p-6 mx-auto">
        <h1 className="text-2xl font-bold">Booking not found</h1>
        <p className="mt-2 text-gray-600">Missing booking id.</p>
      </main>
    );
  }

  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) {
    return (
      <main className="max-w-3xl p-6 mx-auto">
        <h1 className="text-2xl font-bold">Booking not found</h1>
        <p className="mt-2 text-gray-600">
          We couldn’t find booking <code>{id}</code>.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl p-6 mx-auto">
      <h1 className="text-2xl font-bold">Booking confirmed</h1>
      <p className="mt-2 text-gray-600">
        Your reservation was created successfully.
      </p>

      <section className="p-4 mt-6 border rounded">
        <h2 className="mb-2 font-semibold">Summary</h2>
        <dl className="text-sm text-black/70">
          <div className="flex justify-between py-1">
            <dt>Booking ID</dt>
            <dd>{booking.id}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Charter</dt>
            <dd>{booking.charterName}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Location</dt>
            <dd>{booking.location}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Trip</dt>
            <dd>{booking.tripName}</dd>
          </div>
          {booking.startTime && (
            <div className="flex justify-between py-1">
              <dt>Start time</dt>
              <dd>{booking.startTime}</dd>
            </div>
          )}
          <div className="flex justify-between py-1">
            <dt>Date</dt>
            <dd>{booking.date.toISOString().slice(0, 10)}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Days</dt>
            <dd>{booking.days}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Guests</dt>
            <dd>
              {booking.adults} adult(s)
              {booking.children ? `, ${booking.children} child(ren)` : ""}
            </dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Total</dt>
            <dd>RM{booking.totalPrice}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Status</dt>
            <dd>{booking.status}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-6">
        <Link href="/book" className="text-[#ec2227] underline">
          Back to Book
        </Link>
      </div>
    </main>
  );
}
