"use client";
import CalendarPicker from "@/components/shared/CalendarPicker";
import type { Trip } from "@/data/mock/charter";
import { useState } from "react";

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function BookingWidget({
  trips,
  charterId,
  defaultPersons = 2,
  personsMax,
  childFriendly = true,
  className = "",
}: {
  trips: Trip[];
  charterId: string;
  defaultPersons?: number;
  personsMax?: number;
  childFriendly?: boolean;
  className?: string;
}) {
  let initAdults = Math.max(1, defaultPersons);
  let initChildren = 0;
  if (typeof personsMax === "number" && personsMax > 0) {
    const total = initAdults + initChildren;
    if (total > personsMax) {
      const excess = total - personsMax;
      const reduceChildren = Math.min(initChildren, excess);
      initChildren -= reduceChildren;
      const remaining = excess - reduceChildren;
      initAdults = Math.max(1, initAdults - remaining);
      if (initAdults + initChildren > personsMax) {
        initAdults = Math.max(1, personsMax - initChildren);
      }
    }
  }
  const initDate = todayIso();
  const initDays = 1;

  const [adults, setAdults] = useState(initAdults);
  const [children, setChildren] = useState(initChildren);
  const [date, setDate] = useState<string>(initDate);
  const [days, setDays] = useState<number>(initDays);
  const MAX_DAYS = 14;

  const totalGuests = adults + children;
  const overMax = personsMax !== undefined && totalGuests > (personsMax ?? 0);

  const containerClassName = [
    "rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-lg",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClassName}>
      <div className="flex items-baseline justify-between">
        <h3 className="text-base font-semibold sm:text-lg">
          Check availability
        </h3>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-medium text-gray-700">Date</label>
        <div className="mt-1">
          <CalendarPicker
            value={date}
            onChange={setDate}
            disablePast={true}
            buttonClassName="h-10 rounded-lg border border-gray-300 px-3 text-sm"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-medium text-gray-700">Days</label>
        <div className="flex items-center justify-between h-10 px-3 mt-1 border border-gray-300 rounded-lg">
          <button
            type="button"
            className="text-sm leading-none border border-gray-300 rounded-full h-7 w-7 hover:bg-gray-50"
            onClick={() => setDays((d) => Math.max(1, d - 1))}
            aria-label="Decrease days"
          >
            −
          </button>
          <span className="min-w-[2ch] text-sm text-center">{days}</span>
          <button
            type="button"
            className="text-sm leading-none border border-gray-300 rounded-full h-7 w-7 hover:bg-gray-50"
            onClick={() => setDays((d) => Math.min(MAX_DAYS, d + 1))}
            aria-label="Increase days"
          >
            +
          </button>
        </div>
        <span className="text-[11px] text-gray-500">up to {MAX_DAYS} days</span>
      </div>

      <div className="grid grid-cols-1 gap-3 mt-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-gray-700">
            Adults
          </label>
          <div className="flex items-center justify-between h-10 px-3 mt-1 border border-gray-300 rounded-lg">
            <button
              type="button"
              className="text-sm leading-none border border-gray-300 rounded-full h-7 w-7 hover:bg-gray-50"
              onClick={() => setAdults((a) => Math.max(1, a - 1))}
              aria-label="Decrease adults"
            >
              −
            </button>
            <span className="min-w-[2ch] text-sm text-center">{adults}</span>
            <button
              type="button"
              className="text-sm leading-none border border-gray-300 rounded-full h-7 w-7 hover:bg-gray-50"
              onClick={() =>
                setAdults((a) =>
                  personsMax
                    ? Math.min((personsMax ?? 0) - children, a + 1)
                    : a + 1
                )
              }
              aria-label="Increase adults"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-700">
              Children
            </label>
            {!childFriendly && (
              <span className="text-[10px] text-gray-500">
                Not child friendly
              </span>
            )}
          </div>
          <div className="flex items-center justify-between h-10 px-3 mt-1 border border-gray-300 rounded-lg">
            <button
              type="button"
              className="text-sm leading-none border border-gray-300 rounded-full h-7 w-7 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setChildren((c) => Math.max(0, c - 1))}
              aria-label="Decrease children"
              disabled={!childFriendly}
            >
              −
            </button>
            <span className="min-w-[2ch] text-sm text-center">{children}</span>
            <button
              type="button"
              className="text-sm leading-none border border-gray-300 rounded-full h-7 w-7 hover:bg-gray-50 disabled:opacity-50"
              onClick={() =>
                setChildren((c) => {
                  const next = c + 1;
                  return personsMax
                    ? Math.min((personsMax ?? 0) - adults, next)
                    : next;
                })
              }
              aria-label="Increase children"
              disabled={!childFriendly}
            >
              +
            </button>
          </div>
        </div>

        {personsMax !== undefined && (
          <p className="-mt-1 text-[11px] text-gray-500">
            Max {personsMax} guests.
          </p>
        )}
        {overMax && (
          <p className="-mt-1 text-[11px] text-red-600">
            You’ve exceeded the maximum capacity.
          </p>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {trips.map((t, i) => (
          <div
            key={t.name + i}
            className="p-3 border rounded-xl border-black/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-gray-600">
                  {t.duration}
                  {t.maxAnglers ? ` • up to ${t.maxAnglers} anglers` : ""}
                </div>
                {t.startTimes && t.startTimes.length > 0 && (
                  <div className="mt-1 text-xs text-gray-600">
                    Starts: {t.startTimes.join(", ")}
                  </div>
                )}
                {t.description && (
                  <div className="mt-2 text-xs text-gray-700">
                    {t.description}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-[#ec2227]">
                  RM{t.price * days}
                </div>
                {days > 1 && (
                  <div className="text-[11px] text-gray-500">
                    total for {days} day{days > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              className="mt-3 w-full rounded-xl bg-[#ec2227] px-4 py-2 text-sm font-semibold text-white hover:translate-y-px transition disabled:opacity-50"
              disabled={overMax}
              onClick={() => {
                const params = new URLSearchParams();
                params.set("trip_index", String(i));
                params.set("date", date);
                params.set("days", String(days));
                params.set("adults", String(adults));
                params.set("children", String(children));
                window.location.assign(
                  `/book/${charterId}?${params.toString()}`
                );
              }}
            >
              Reserve Trip
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
