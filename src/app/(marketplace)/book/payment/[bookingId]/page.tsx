import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { CreditCard, Shield } from "lucide-react";
import { redirect } from "next/navigation";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?next=${encodeURIComponent(`/book/payment/${bookingId}`)}`);
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.userId !== session.user.id) {
    redirect("/");
  }

  // Only APPROVED bookings can be paid
  if (booking.status !== "APPROVED") {
    redirect(`/book/confirm?id=${bookingId}`);
  }

  async function handlePayment() {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== session.user.id) return;
    if (booking.status !== "APPROVED") return;

    // Mock payment - just update status to PAID
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    redirect(`/book/confirm?id=${bookingId}`);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl px-4 py-12 mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="mt-2 text-gray-600">Complete your booking payment</p>
        </div>

        {/* Payment Card */}
        <div className="p-8 bg-white border rounded-lg shadow-sm">
          {/* Booking Summary */}
          <div className="pb-6 mb-8 border-b">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Booking Summary
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Booking ID:</dt>
                <dd className="font-medium text-gray-900">{booking.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Charter:</dt>
                <dd className="font-medium text-gray-900">
                  {booking.charterName}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Trip:</dt>
                <dd className="font-medium text-gray-900">
                  {booking.tripName}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Date:</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(booking.date).toLocaleDateString("en-MY", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
              {booking.startTime && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Start Time:</dt>
                  <dd className="font-medium text-gray-900">
                    {booking.startTime}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-600">Guests:</dt>
                <dd className="font-medium text-gray-900">
                  {booking.adults} Adult(s)
                  {booking.children > 0 && `, ${booking.children} Child(ren)`}
                </dd>
              </div>
            </dl>
          </div>

          {/* Amount */}
          <div className="p-6 mb-8 rounded-lg bg-gray-50">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-medium text-gray-700">
                Total Amount
              </span>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#ec2227]">
                  RM {booking.totalPrice.toFixed(2)}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  ({booking.days} day{booking.days > 1 ? "s" : ""} × RM{" "}
                  {booking.unitPrice.toFixed(2)})
                </div>
              </div>
            </div>
          </div>

          {/* Mock Payment Notice */}
          <div className="p-4 mb-6 border border-yellow-200 rounded-lg bg-yellow-50">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Development Mode</p>
                <p className="mt-1">
                  This is a mock payment gateway. In production, this will
                  integrate with Senang Pay. Click the button below to simulate
                  a successful payment.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <form action={handlePayment}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ec2227] px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-[#d01f23] focus:outline-none focus:ring-2 focus:ring-[#ec2227] focus:ring-offset-2"
            >
              <CreditCard className="w-5 h-5" />
              Confirm Payment - RM {booking.totalPrice.toFixed(2)}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 text-xs text-center text-gray-500">
            <p>🔒 Your payment information is secure and encrypted</p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <a
            href={`/book/confirm?id=${bookingId}`}
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
          >
            ← Back to booking details
          </a>
        </div>
      </div>
    </main>
  );
}
