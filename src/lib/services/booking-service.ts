/**
 * Booking service for angler dashboard
 *
 * Provides unified interface to fetch and manage bookings for authenticated users.
 * All operations are scoped to the current user's bookings only.
 */

import { prisma } from "@/lib/database/prisma";
import { prismaCaptain } from "@/lib/database/prisma-captain";

export type BookingStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "PAID"
  | "CANCELLED";

export interface BookingWithDetails {
  id: string;
  userId: string;
  captainCharterId: string;
  charterName: string;
  location: string;
  tripName: string;
  unitPrice: number;
  startTime: string | null;
  date: Date;
  days: number;
  adults: number;
  children: number;
  totalPrice: number;
  status: BookingStatus;
  expiresAt: Date;
  captainDecisionAt: Date | null;
  paidAt: Date | null;
  note: string | null;
  rejectionReason: string | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Captain contact info
  captainPhone?: string | null;
  captainBackupPhone?: string | null;
  // Location details
  startingPoint?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  // Trip details
  durationHours?: number | null;
}

export interface BookingFilters {
  status?: BookingStatus | BookingStatus[];
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
}

/**
 * Enrich bookings with captain contact info and location details
 * @param bookings - Array of bookings
 * @returns Enriched bookings with captain data
 */
async function enrichBookingsWithCaptainData(
  bookings: any[]
): Promise<BookingWithDetails[]> {
  if (bookings.length === 0) return [];

  // Get unique charter IDs
  const charterIds = [...new Set(bookings.map((b) => b.captainCharterId))];

  // Fetch captain data from fishon-captain database using raw SQL
  const captainDataRaw = await prismaCaptain.$queryRaw<
    Array<{
      id: string;
      captainPhone: string;
      backupPhone: string | null;
      startingPoint: string;
      latitude: any; // Prisma Decimal type
      longitude: any; // Prisma Decimal type
    }>
  >`
    SELECT 
      c.id,
      cp.phone as "captainPhone",
      c."backupPhone",
      c."startingPoint",
      c.latitude,
      c.longitude
    FROM "Charter" c
    INNER JOIN "CaptainProfile" cp ON c."captainId" = cp.id
    WHERE c.id = ANY(${charterIds}::text[])
  `;

  // Convert Decimal types to numbers for serialization
  const captainData = captainDataRaw.map((c) => ({
    id: c.id,
    captainPhone: c.captainPhone,
    backupPhone: c.backupPhone,
    startingPoint: c.startingPoint,
    latitude: c.latitude ? Number(c.latitude) : null,
    longitude: c.longitude ? Number(c.longitude) : null,
  }));

  // Create a map for quick lookup
  const captainMap = new Map(
    captainData.map((c) => [
      c.id,
      {
        captainPhone: c.captainPhone,
        captainBackupPhone: c.backupPhone,
        startingPoint: c.startingPoint,
        latitude: c.latitude,
        longitude: c.longitude,
      },
    ])
  );

  // Enrich bookings with captain data
  return bookings.map((booking) => {
    const captain = captainMap.get(booking.captainCharterId) || {
      captainPhone: null,
      captainBackupPhone: null,
      startingPoint: null,
      latitude: null,
      longitude: null,
    };
    return {
      ...booking,
      ...captain,
    } as BookingWithDetails;
  });
}

/**
 * Get all bookings for a user with optional filters
 * @param userId - User ID
 * @param filters - Optional filters
 * @returns Array of bookings ordered by creation date (newest first)
 */
export async function getUserBookings(
  userId: string,
  filters?: BookingFilters
): Promise<BookingWithDetails[]> {
  const where: any = { userId };

  if (filters?.status) {
    where.status = Array.isArray(filters.status)
      ? { in: filters.status }
      : filters.status;
  }

  if (filters?.startDate || filters?.endDate) {
    where.date = {};
    if (filters.startDate) {
      where.date.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.date.lte = filters.endDate;
    }
  }

  if (filters?.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    where.OR = [
      { charterName: { contains: term, mode: "insensitive" } },
      { location: { contains: term, mode: "insensitive" } },
      { tripName: { contains: term, mode: "insensitive" } },
    ];
  }

  try {
    const bookings = await prisma.booking.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Enrich bookings with captain contact and location data
    return await enrichBookingsWithCaptainData(bookings);
  } catch (error) {
    console.error(`Error fetching bookings for user ${userId}:`, error);
    throw new Error("Failed to fetch bookings. Please try again later.");
  }
}

/**
 * Get a single booking by ID (with user ownership check)
 * @param bookingId - Booking ID
 * @param userId - User ID (for ownership verification)
 * @returns Booking or null if not found/unauthorized
 */
export async function getBookingById(
  bookingId: string,
  userId: string
): Promise<BookingWithDetails | null> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    // Ownership check
    if (!booking || booking.userId !== userId) {
      return null;
    }

    // Enrich with captain data
    const enriched = await enrichBookingsWithCaptainData([booking]);
    return enriched[0] || null;
  } catch (error) {
    console.error(`Error fetching booking ${bookingId}:`, error);
    throw new Error("Failed to fetch booking. Please try again later.");
  }
}

/**
 * Get booking statistics for a user
 * @param userId - User ID
 * @returns Object with counts per status and total bookings
 */
export async function getBookingStats(userId: string): Promise<{
  total: number;
  pending: number;
  approved: number;
  paid: number;
  rejected: number;
  expired: number;
  cancelled: number;
}> {
  try {
    const [total, pending, approved, paid, rejected, expired, cancelled] =
      await Promise.all([
        prisma.booking.count({ where: { userId } }),
        prisma.booking.count({ where: { userId, status: "PENDING" } }),
        prisma.booking.count({ where: { userId, status: "APPROVED" } }),
        prisma.booking.count({ where: { userId, status: "PAID" } }),
        prisma.booking.count({ where: { userId, status: "REJECTED" } }),
        prisma.booking.count({ where: { userId, status: "EXPIRED" } }),
        prisma.booking.count({ where: { userId, status: "CANCELLED" } }),
      ]);

    return {
      total,
      pending,
      approved,
      paid,
      rejected,
      expired,
      cancelled,
    };
  } catch (error) {
    console.error(`Error fetching booking stats for user ${userId}:`, error);
    throw new Error("Failed to fetch booking statistics.");
  }
}

/**
 * Get upcoming trips (PAID bookings with future dates)
 * @param userId - User ID
 * @returns Array of upcoming trips ordered by date (nearest first)
 */
export async function getUpcomingTrips(
  userId: string
): Promise<BookingWithDetails[]> {
  try {
    const now = new Date();
    const bookings = await prisma.booking.findMany({
      where: {
        userId,
        status: "PAID",
        date: { gte: now },
      },
      orderBy: {
        date: "asc",
      },
    });

    return await enrichBookingsWithCaptainData(bookings);
  } catch (error) {
    console.error(`Error fetching upcoming trips for user ${userId}:`, error);
    throw new Error("Failed to fetch upcoming trips.");
  }
}

/**
 * Get past trips (PAID bookings with past dates)
 * @param userId - User ID
 * @returns Array of past trips ordered by date (most recent first)
 */
export async function getPastTrips(
  userId: string
): Promise<BookingWithDetails[]> {
  try {
    const now = new Date();
    const bookings = await prisma.booking.findMany({
      where: {
        userId,
        status: "PAID",
        date: { lt: now },
      },
      orderBy: {
        date: "desc",
      },
    });

    return await enrichBookingsWithCaptainData(bookings);
  } catch (error) {
    console.error(`Error fetching past trips for user ${userId}:`, error);
    throw new Error("Failed to fetch past trips.");
  }
}

/**
 * Cancel a booking
 * @param bookingId - Booking ID
 * @param userId - User ID (for ownership verification)
 * @param cancellationReason - Optional reason for cancellation
 * @returns Updated booking or null if operation failed
 */
export async function cancelBooking(
  bookingId: string,
  userId: string,
  cancellationReason?: string
): Promise<BookingWithDetails | null> {
  try {
    // Verify ownership
    const booking = await getBookingById(bookingId, userId);
    if (!booking) {
      return null;
    }

    // Only allow cancellation for PENDING or APPROVED bookings
    if (booking.status !== "PENDING" && booking.status !== "APPROVED") {
      return null;
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        cancellationReason: cancellationReason || null,
      },
    });

    // Enrich with captain data
    const enriched = await enrichBookingsWithCaptainData([updated]);
    return enriched[0] || null;
  } catch (error) {
    console.error(`Error cancelling booking ${bookingId}:`, error);
    throw new Error("Failed to cancel booking. Please try again later.");
  }
}
