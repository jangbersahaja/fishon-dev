/**
 * Booking Status Helpers
 * Utilities for determining booking lifecycle states
 */

import type { BookingWithDetails } from "@/lib/services/booking-service";
import { BookingStatus } from "@prisma/client";

/**
 * Calculate trip end time based on booking date, startTime, and days
 */
export function calculateTripEndTime(booking: {
  date: Date;
  startTime: string | null;
  days: number;
}): Date {
  const { date, startTime, days } = booking;

  // Create a date object from booking date
  const tripStart = new Date(date);

  // If startTime exists (e.g., "07:00"), parse and set the time
  if (startTime) {
    const [hours, minutes] = startTime.split(":").map(Number);
    tripStart.setHours(hours || 0, minutes || 0, 0, 0);
  } else {
    // Default to start of day if no startTime
    tripStart.setHours(0, 0, 0, 0);
  }

  // Add the duration in days
  // Assuming 8-hour fishing trips (standard charter duration)
  const tripDurationHours = days * 8;
  const tripEnd = new Date(tripStart);
  tripEnd.setHours(tripEnd.getHours() + tripDurationHours);

  return tripEnd;
}

/**
 * Check if a booking's trip has been completed (trip end time has passed)
 */
export function isTripCompleted(booking: BookingWithDetails): boolean {
  if (booking.status !== BookingStatus.PAID) {
    return false;
  }

  const tripEndTime = calculateTripEndTime(booking);
  const now = new Date();

  return now >= tripEndTime;
}

/**
 * Check if booking is in "In Progress" state
 */
export function isInProgress(booking: BookingWithDetails): boolean {
  // PENDING - waiting for captain approval
  // APPROVED - waiting for payment
  // PAID (future) - trip confirmed, waiting for trip date
  if (
    booking.status === BookingStatus.PENDING ||
    booking.status === BookingStatus.APPROVED
  ) {
    return true;
  }

  if (booking.status === BookingStatus.PAID) {
    return !isTripCompleted(booking); // PAID but trip not completed yet
  }

  return false;
}

/**
 * Check if booking is "Completed"
 */
export function isCompleted(booking: BookingWithDetails): boolean {
  return booking.status === BookingStatus.PAID && isTripCompleted(booking);
}

/**
 * Check if booking is "Cancelled"
 */
export function isCancelled(booking: BookingWithDetails): boolean {
  return (
    booking.status === BookingStatus.REJECTED ||
    booking.status === BookingStatus.EXPIRED ||
    booking.status === BookingStatus.CANCELLED
  );
}

/**
 * Get cancellation reason display text
 */
export function getCancellationReason(booking: BookingWithDetails): {
  title: string;
  description: string;
} {
  switch (booking.status) {
    case BookingStatus.REJECTED:
      return {
        title: "Rejected by Captain",
        description:
          booking.rejectionReason ||
          "The captain is unable to accommodate this booking.",
      };
    case BookingStatus.EXPIRED:
      return {
        title: "Booking Expired",
        description:
          "The captain didn't respond within 12 hours. Your booking has been automatically cancelled.",
      };
    case BookingStatus.CANCELLED:
      return {
        title: "Cancelled by You",
        description:
          booking.cancellationReason || "You cancelled this booking.",
      };
    default:
      return {
        title: "Cancelled",
        description: "This booking was cancelled.",
      };
  }
}

/**
 * Categorize booking into tab groups
 */
export type BookingTab = "in-progress" | "completed" | "cancelled";

export function getBookingTab(booking: BookingWithDetails): BookingTab {
  if (isInProgress(booking)) return "in-progress";
  if (isCompleted(booking)) return "completed";
  if (isCancelled(booking)) return "cancelled";
  return "in-progress"; // fallback
}
