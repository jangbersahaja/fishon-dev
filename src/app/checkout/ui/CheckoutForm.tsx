"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

function toInt(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
}

export default function CheckoutForm({
  startTimes,
  defaultStartTime,
}: {
  startTimes?: string[];
  defaultStartTime?: string;
}) {
  const sp = useSearchParams();
  const router = useRouter();

  const charterId = sp.get("charterId"); // cuid or numeric string
  const tripIndex = toInt(sp.get("trip_index"), 0);
  const date = sp.get("date") || "";
  const days = toInt(sp.get("days"), 1);
  const adults = toInt(sp.get("adults"), 2);
  const children = toInt(sp.get("children"), 0);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | undefined>(
    defaultStartTime
  );

  const canSubmit = useMemo(() => {
    const startTimeOk =
      Array.isArray(startTimes) && startTimes.length > 0
        ? Boolean(startTime)
        : true;
    return Boolean(
      charterId && date && days > 0 && adults >= 1 && fullName && startTimeOk
    );
  }, [charterId, date, days, adults, fullName, startTime, startTimes]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !charterId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          charterId,
          tripIndex,
          date,
          days,
          adults,
          children,
          startTime,
          // customer info kept client-side for now; add to model later
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to create booking");
      }
      const data = await res.json();
      const bookingId = data?.booking?.id;
      if (bookingId) {
        router.push(
          `/checkout/confirmation?id=${encodeURIComponent(bookingId)}`
        );
      } else {
        throw new Error("Missing booking id");
      }
    } catch (err: any) {
      setError(err?.message || String(err));
      setSubmitting(false);
    }
  }

  return (
    <section className="grid gap-4 mt-6 md:grid-cols-3">
      <form onSubmit={onSubmit} className="p-4 border rounded md:col-span-2">
        <h2 className="mb-2 font-semibold">Traveler details</h2>
        {Array.isArray(startTimes) && startTimes.length > 0 && (
          <label className="block mt-1 text-sm">
            <span className="block text-xs text-gray-600">
              Choose start time
            </span>
            <select
              className="w-full px-3 py-2 mt-1 border rounded"
              value={startTime || ""}
              onChange={(e) => setStartTime(e.target.value || undefined)}
              required
            >
              <option value="" disabled>
                Select a time
              </option>
              {startTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="block text-xs text-gray-600">Full name</span>
            <input
              className="w-full px-3 py-2 mt-1 border rounded"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              required
            />
          </label>
          <label className="text-sm">
            <span className="block text-xs text-gray-600">Phone</span>
            <input
              className="w-full px-3 py-2 mt-1 border rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +60..."
            />
          </label>
        </div>
        <label className="block mt-3 text-sm">
          <span className="block text-xs text-gray-600">Notes (optional)</span>
          <textarea
            className="w-full px-3 py-2 mt-1 border rounded"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any special requests"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-4">
          <button
            type="submit"
            className="rounded bg-[#ec2227] text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
            disabled={!canSubmit || submitting}
          >
            {submitting ? "Creating booking…" : "Confirm booking"}
          </button>
        </div>
      </form>

      <aside className="p-4 border rounded">
        <h2 className="mb-2 font-semibold">Trip summary</h2>
        <dl className="text-sm text-black/70">
          <div className="flex justify-between py-1">
            <dt>Charter</dt>
            <dd>{charterId}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Date</dt>
            <dd>{date || "–"}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Days</dt>
            <dd>{days}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Adults</dt>
            <dd>{adults}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Children</dt>
            <dd>{children}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt>Trip</dt>
            <dd>#{tripIndex + 1}</dd>
          </div>
          {Array.isArray(startTimes) && startTimes.length > 0 && (
            <div className="flex justify-between py-1">
              <dt>Start time</dt>
              <dd>{startTime || "–"}</dd>
            </div>
          )}
        </dl>
        <p className="mt-3 text-xs text-black/50">
          Final price is calculated server-side from the trip snapshot.
        </p>
      </aside>
    </section>
  );
}
