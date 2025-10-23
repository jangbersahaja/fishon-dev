"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { useState } from "react";

interface NextActionsProps {
  booking: any;
}

export default function NextActions({ booking }: NextActionsProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cancellation reason state
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");

  const commonReasons = [
    "Change of plans",
    "Found a better offer",
    "Weather concerns",
    "Unable to travel",
    "Captain unresponsive",
    "Booking mistake",
    "Other",
  ];

  function getFinalReason() {
    if (selectedReason === "Other") {
      return otherReason.trim();
    }
    return selectedReason;
  }

  async function handleCancel() {
    setLoading(true);
    setError(null);
    const reason = getFinalReason();
    if (!reason) {
      setError("Please select or enter a cancellation reason.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: booking.id, cancellationReason: reason }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to cancel booking");
      }
      // Success: optionally show a toast or reload
      // Optionally reload or redirect
      window.location.reload();
    } catch (e: any) {
      setError(e.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="p-5 bg-white border rounded-2xl border-black/10 sm:p-6">
      <h2 className="mb-4 text-base font-semibold sm:text-lg">
        What&apos;s Next?
      </h2>

      {(booking.status === "PENDING" || booking.status === "APPROVED") && (
        <div className="space-y-4">
          {booking.status === "PENDING" && (
            <div className="space-y-4">
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <p className="text-sm text-blue-900">
                  <strong className="font-semibold">
                    Waiting for captain approval
                  </strong>
                  <br />
                  The captain will review your request and respond within 24
                  hours. We&apos;ll notify you by email once a decision is made.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  While you wait:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                    <span>Check your email for confirmation details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MessageCircle className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                    <span>
                      Prepare any questions you&apos;d like to ask the captain
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {booking.status === "APPROVED" && (
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <p className="mb-3 text-sm text-green-900">
                <strong className="font-semibold">Great news!</strong>
                <br />
                The captain has approved your request. Complete payment to
                confirm your booking.
              </p>
              <Link
                href={`/book/payment/${booking.id}`}
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white transition-colors bg-[#ec2227] rounded-lg hover:bg-[#d11f24]"
              >
                Complete Payment
              </Link>
            </div>
          )}

          {/* Cancel Booking Action */}
          <button
            type="button"
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-[#ec2227] border border-[#ec2227] rounded-lg hover:bg-[#ec2227] hover:text-white transition-colors mt-2"
            onClick={() => {
              setShowModal(true);
              setError(null);
              setSelectedReason("");
              setOtherReason("");
            }}
            disabled={loading}
          >
            Cancel Booking
          </button>

          {showModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-200 bg-black/50"
              aria-modal="true"
              role="dialog"
              tabIndex={-1}
            >
              <div className="relative w-full max-w-md p-0 sm:p-0">
                <div className="p-6 bg-white shadow-2xl rounded-2xl sm:p-8 animate-fadeIn">
                  {/* Close button */}
                  <button
                    className="absolute text-gray-400 top-3 right-3 hover:text-gray-600 focus:outline-none"
                    aria-label="Close"
                    onClick={() => setShowModal(false)}
                    tabIndex={0}
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 6 6 18M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    Cancel Booking?
                  </h3>
                  <p className="mb-4 text-sm text-gray-700">
                    Are you sure you want to cancel this booking?{" "}
                    <span className="font-medium text-[#ec2227]">
                      This action cannot be undone.
                    </span>
                  </p>
                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Reason for cancellation
                    </label>
                    <fieldset>
                      <legend className="sr-only">Select a reason</legend>
                      <div className="flex flex-col gap-2">
                        {commonReasons.map((reason) => (
                          <label
                            key={reason}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                              selectedReason === reason
                                ? "border-[#ec2227] bg-[#fff0f1]"
                                : "border-gray-200 bg-white hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="cancel-reason"
                              value={reason}
                              checked={selectedReason === reason}
                              onChange={() => setSelectedReason(reason)}
                              className="accent-[#ec2227] focus:ring-2 focus:ring-[#ec2227]"
                            />
                            <span className="text-sm font-medium text-gray-900">
                              {reason}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    {selectedReason === "Other" && (
                      <input
                        type="text"
                        className="mt-3 w-full border-2 border-[#ec2227] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                        placeholder="Please specify your reason..."
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        maxLength={120}
                        autoFocus
                        aria-label="Other reason"
                      />
                    )}
                  </div>
                  {error && (
                    <div className="mb-3 text-sm font-medium text-red-600">
                      {error}
                    </div>
                  )}
                  <div className="flex flex-row-reverse gap-2 mt-2">
                    <button
                      className="px-4 py-2 text-sm rounded-lg bg-[#ec2227] text-white font-semibold hover:bg-[#d11f24] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                      onClick={handleCancel}
                      disabled={loading || !getFinalReason()}
                    >
                      {loading ? "Cancelling..." : "Yes, Cancel"}
                    </button>
                    <button
                      className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none"
                      onClick={() => setShowModal(false)}
                      disabled={loading}
                    >
                      Nevermind
                    </button>
                  </div>
                </div>
                {/* Simple fade-in animation */}
                <style jsx>{`
                  .animate-fadeIn {
                    animation: fadeIn 0.18s cubic-bezier(0.4, 0, 0.2, 1);
                  }
                  @keyframes fadeIn {
                    from {
                      opacity: 0;
                      transform: translateY(16px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                `}</style>
              </div>
            </div>
          )}
        </div>
      )}

      {booking.status === "PAID" && (
        <div className="space-y-4">
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <p className="text-sm text-green-900">
              <strong className="font-semibold">You&apos;re all set!</strong>
              <br />
              Your booking is confirmed and paid. Get ready for your fishing
              adventure!
            </p>
          </div>

          {/* Download Receipt - Full width button */}
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-semibold transition-colors bg-white border-2 border-[#ec2227] text-[#ec2227] rounded-lg hover:bg-[#ec2227] hover:text-white"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Receipt
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
              <MessageCircle className="w-4 h-4" />
              Message Captain
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
              <Phone className="w-4 h-4" />
              Contact Info
            </button>
          </div>
        </div>
      )}

      {(booking.status === "REJECTED" ||
        booking.status === "EXPIRED" ||
        booking.status === "CANCELLED") && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This booking is no longer active. You can browse other charters or
            try a different date.
          </p>
          <Link
            href="/home"
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white transition-colors bg-[#ec2227] rounded-lg hover:bg-[#d11f24]"
          >
            Browse Charters
          </Link>
        </div>
      )}
    </section>
  );
}
