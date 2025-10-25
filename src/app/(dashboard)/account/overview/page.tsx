import { BookingCard, EmptyState, QuickStats } from "@/components/account";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";
import {
  getBookingStats,
  getUserBookings,
} from "@/lib/services/booking-service";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OverviewPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?next=/account/overview");
  }

  // Fetch booking statistics
  const stats = await getBookingStats(session.user.id);

  // Fetch recent bookings (last 5)
  const allBookings = await getUserBookings(session.user.id);
  const recentBookings = allBookings.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {session.user.name || "Angler"}!
        </h1>
        <p className="text-gray-600">
          Here&apos;s what&apos;s happening with your fishing charters.
        </p>
      </div>

      {/* Quick Stats */}
      <QuickStats
        stats={{
          total: stats.total,
          pending: stats.pending,
          approved: stats.approved,
          paid: stats.paid,
        }}
      />

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Bookings
          </h2>
          {recentBookings.length > 0 && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/account/bookings">View All</Link>
            </Button>
          )}
        </div>

        {recentBookings.length === 0 ? (
          <EmptyState
            icon="inbox"
            title="No bookings yet"
            description="Start exploring and book your first fishing charter!"
            action={{
              label: "Browse Charters",
              href: "/charters",
            }}
          />
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Need Help?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Have questions about your bookings or need assistance?
          </p>
          <Button variant="outline" asChild>
            <Link href="/account/support">Contact Support</Link>
          </Button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Explore More
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Discover new fishing charters and experiences.
          </p>
          <Button asChild>
            <Link href="/charters">Browse Charters</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
