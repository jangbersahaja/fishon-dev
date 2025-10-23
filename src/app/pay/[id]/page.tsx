import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PayPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id)
    redirect("/login?next=" + encodeURIComponent(`/pay/${params.id}`));

  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking || booking.userId !== session.user.id) {
    redirect("/checkout/confirmation?id=" + encodeURIComponent(params.id));
  }

  if (booking.status !== "APPROVED") {
    // Only APPROVED bookings can be paid
    redirect("/checkout/confirmation?id=" + encodeURIComponent(params.id));
  }

  async function mockPay() {
    "use server";
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";
    const cookieHeader = cookies().toString();
    await fetch(`${base}/api/bookings/pay`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: cookieHeader,
      },
      body: JSON.stringify({ id: params.id }),
      cache: "no-store",
    });
    // Ignore response body; redirect regardless
    redirect("/checkout/confirmation?id=" + encodeURIComponent(params.id));
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-semibold mb-2">Mock Payment</h1>
      <p className="text-gray-600 mb-6">
        This is a placeholder payment screen. Click Pay now to mark your booking
        as paid.
      </p>
      <div className="rounded border p-4 mb-6">
        <div className="flex justify-between">
          <span>Charter</span>
          <strong>{booking.charterName}</strong>
        </div>
        <div className="flex justify-between">
          <span>Trip</span>
          <strong>{booking.tripName}</strong>
        </div>
        <div className="flex justify-between">
          <span>Total</span>
          <strong>RM {booking.totalPrice}</strong>
        </div>
      </div>
      <form action={mockPay}>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Pay now
        </button>
      </form>
    </div>
  );
}
