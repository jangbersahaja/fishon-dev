import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function MyBookingPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <main className="max-w-4xl p-6 mx-auto">
        <h1 className="text-2xl font-bold">My bookings</h1>
        <p className="mt-2 text-gray-600">
          Please sign in to view your bookings.
        </p>
      </main>
    );
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  async function cancelAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    await fetch("/api/bookings/cancel", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <main className="max-w-4xl p-6 mx-auto">
      <h1 className="text-2xl font-bold">My bookings</h1>
      <div className="mt-4 grid gap-4">
        {bookings.map((b) => (
          <div key={b.id} className="border rounded p-4">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{b.charterName}</div>
                <div className="text-sm text-gray-600">{b.tripName}</div>
                <div className="text-sm text-gray-600">
                  {b.date.toISOString().slice(0, 10)}
                  {b.startTime ? ` • ${b.startTime}` : ""}
                  {` • ${b.days} day(s)`}
                </div>
                <div className="text-sm">Status: {b.status}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">RM {b.totalPrice}</div>
                <div className="mt-2 flex items-center gap-2 justify-end">
                  <Link
                    href={`/booking/${b.id}`}
                    className="text-[#ec2227] underline text-sm"
                  >
                    View
                  </Link>
                  {b.status === "APPROVED" && (
                    <Link
                      href={`/pay/${b.id}`}
                      className="text-white bg-[#ec2227] px-3 py-1 rounded text-sm"
                    >
                      Pay
                    </Link>
                  )}
                  {(b.status === "PENDING" || b.status === "APPROVED") && (
                    <form action={cancelAction}>
                      <input type="hidden" name="id" value={b.id} />
                      <button
                        className="text-sm text-red-600 hover:underline"
                        type="submit"
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
