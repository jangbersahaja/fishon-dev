"use client";

import { Check, Clock, CreditCard, Send } from "lucide-react";

type BookingStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "PAID"
  | "CANCELLED";

interface StatusTimelineProps {
  status: BookingStatus;
  expiresAt?: Date;
}

export default function StatusTimeline({
  status,
  expiresAt,
}: StatusTimelineProps) {
  const steps = [
    {
      id: "sent",
      label: "Request Sent",
      icon: Send,
      statuses: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "EXPIRED",
        "PAID",
        "CANCELLED",
      ],
    },
    {
      id: "review",
      label: "Captain Review",
      icon: Clock,
      statuses: ["APPROVED", "PAID"],
    },
    {
      id: "payment",
      label: "Payment",
      icon: CreditCard,
      statuses: ["PAID"],
    },
    {
      id: "confirmed",
      label: "Confirmed",
      icon: Check,
      statuses: ["PAID"],
    },
  ];

  const getStepState = (step: (typeof steps)[0]) => {
    if (status === "REJECTED") {
      return step.id === "sent" ? "complete" : "rejected";
    }
    if (status === "EXPIRED") {
      return step.id === "sent" ? "complete" : "expired";
    }
    if (status === "CANCELLED") {
      return step.id === "sent" ? "complete" : "cancelled";
    }

    if (step.statuses.includes(status)) {
      return "complete";
    }

    // Check if this is the current step
    const statusOrder = ["PENDING", "APPROVED", "PAID"];
    const currentIndex = statusOrder.indexOf(status);
    const stepStatusIndex = Math.min(
      ...step.statuses.map((s) => statusOrder.indexOf(s)).filter((i) => i >= 0)
    );

    if (stepStatusIndex === currentIndex + 1) {
      return "current";
    }

    return "pending";
  };

  return (
    <div className="p-5 bg-white border rounded-2xl border-black/10 sm:p-6">
      <h2 className="mb-4 text-base font-semibold sm:text-lg">
        Booking Status
      </h2>

      <div className="relative">
        {steps.map((step, index) => {
          const state = getStepState(step);
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative pb-8 last:pb-0">
              {/* Connector line */}
              {!isLast && (
                <div
                  className={`absolute left-[19px] top-10 w-0.5 h-[calc(100%-2.5rem)] ${
                    state === "complete"
                      ? "bg-green-500"
                      : state === "current"
                      ? "bg-gray-300"
                      : state === "rejected"
                      ? "bg-red-300"
                      : state === "expired" || state === "cancelled"
                      ? "bg-gray-300"
                      : "bg-gray-200"
                  }`}
                />
              )}

              {/* Step content */}
              <div className="relative flex items-start gap-3">
                {/* Icon circle */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    state === "complete"
                      ? "bg-green-500 border-green-500 text-white"
                      : state === "current"
                      ? "bg-white border-[#ec2227] text-[#ec2227]"
                      : state === "rejected"
                      ? "bg-red-100 border-red-300 text-red-600"
                      : state === "expired" || state === "cancelled"
                      ? "bg-gray-100 border-gray-300 text-gray-500"
                      : "bg-white border-gray-200 text-gray-400"
                  }`}
                >
                  {state === "complete" ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Label and description */}
                <div className="flex-1 pt-1">
                  <p
                    className={`text-sm font-medium ${
                      state === "complete" || state === "current"
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>

                  {/* Status-specific messages */}
                  {state === "current" && step.id === "review" && (
                    <p className="mt-1 text-xs text-gray-600">
                      Waiting for captain approval
                      {expiresAt && (
                        <span className="block mt-0.5 text-gray-500">
                          Hold expires:{" "}
                          {new Intl.DateTimeFormat(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          }).format(expiresAt)}
                        </span>
                      )}
                    </p>
                  )}

                  {state === "current" && step.id === "payment" && (
                    <p className="mt-1 text-xs text-gray-600">
                      Complete payment to confirm your booking
                    </p>
                  )}

                  {state === "complete" && step.id === "confirmed" && (
                    <p className="mt-1 text-xs text-green-600">
                      Your booking is confirmed!
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status-specific alerts */}
      {status === "REJECTED" && (
        <div className="p-3 mt-4 text-sm border rounded-lg bg-red-50 border-red-200 text-red-800">
          Your booking request was declined by the captain. Please try a
          different date or charter.
        </div>
      )}

      {status === "EXPIRED" && (
        <div className="p-3 mt-4 text-sm border rounded-lg bg-orange-50 border-orange-200 text-orange-800">
          This booking hold has expired. Please create a new booking request.
        </div>
      )}

      {status === "CANCELLED" && (
        <div className="p-3 mt-4 text-sm border rounded-lg bg-gray-50 border-gray-200 text-gray-700">
          This booking has been cancelled.
        </div>
      )}
    </div>
  );
}
