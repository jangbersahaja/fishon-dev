"use client";

import { useAuthModal } from "@/components/auth/AuthModalContext";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import BookingSummaryCard from "./BookingSummaryCard";
import DateGuestsCard from "./DateGuestsCard";
import StartConversationCard from "./StartConversationCard";
import StartTimeSelection from "./StartTimeSelection";
import TripSelectionCard from "./TripSelectionCard";
import YourDetailsCard from "./YourDetailsCard";

function toInt(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
}

type Trip = {
  name: string;
  duration?: string;
  description?: string;
  price: number;
  maxAnglers?: number;
  startTimes?: string[];
  targetSpecies?: string[];
  techniques?: string[];
};

interface Boat {
  name?: string;
  type?: string;
  features?: string[];
  capacity?: number;
}

interface Captain {
  name: string;
  avatarUrl?: string;
  yearsExperience: number;
  crewCount: number;
  intro?: string;
}

type CharterData = {
  id?: string;
  name?: string;
  location?: string;
  images?: string[];
  boat?: Boat;
  includes?: string[];
  coordinates?: { lat: number; lng: number };
  captain?: Captain | null;
  species?: string[];
  techniques?: string[];
};

export default function CheckoutForm({
  startTimes,
  defaultStartTime,
  trips,
  selectedTripIndex,
  charter,
  defaultUser,
}: {
  startTimes?: string[];
  defaultStartTime?: string;
  trips?: Trip[];
  selectedTripIndex?: number;
  charter?: CharterData;
  defaultUser?: { firstName?: string; lastName?: string; email?: string };
}) {
  const sp = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { openModal } = useAuthModal();
  const isLoggedIn = !!session?.user;

  const charterId = sp.get("charterId");
  const date = sp.get("date") || "";
  const days = toInt(sp.get("days"), 1);
  const adults = toInt(sp.get("adults"), 2);
  const children = toInt(sp.get("children"), 0);
  const tripIndexParam = toInt(sp.get("trip_index"), selectedTripIndex ?? 0);

  const [tripIndex, setTripIndex] = useState<number>(tripIndexParam);
  const [firstName, setFirstName] = useState(defaultUser?.firstName || "");
  const [lastName, setLastName] = useState(defaultUser?.lastName || "");
  const [email, setEmail] = useState(defaultUser?.email || "");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | undefined>(
    defaultStartTime
  );

  // Prefill after in-page login if fields are still blank
  useEffect(() => {
    if (!session?.user) return;
    if (!email && session.user.email) setEmail(session.user.email);
    if (!firstName && session.user.name) {
      const [fn, ...rest] = (session.user.name || "").split(" ");
      setFirstName(fn || "");
      const ln = rest.join(" ").trim();
      if (!lastName && ln) setLastName(ln);
    }
  }, [session?.user, email, firstName, lastName]);

  const effectiveStartTimes = useMemo(() => {
    const t = trips?.[tripIndex];
    if (Array.isArray(t?.startTimes) && t!.startTimes!.length > 0)
      return t!.startTimes as string[];
    return startTimes;
  }, [trips, tripIndex, startTimes]);

  const canSubmit = useMemo(() => {
    const startTimeOk =
      Array.isArray(effectiveStartTimes) && effectiveStartTimes.length > 0
        ? Boolean(startTime)
        : true;
    return Boolean(
      charterId &&
        date &&
        days > 0 &&
        adults >= 1 &&
        firstName &&
        lastName &&
        email &&
        startTimeOk
    );
  }, [
    charterId,
    date,
    days,
    adults,
    firstName,
    lastName,
    email,
    startTime,
    effectiveStartTimes,
  ]);

  function handleTripSelect(idx: number) {
    setTripIndex(idx);
    const params = new URLSearchParams(sp as any);
    params.set("trip_index", String(idx));
    if (startTime) params.set("start_time", startTime);
    router.replace(`/checkout?${params.toString()}`, { scroll: false });
    // reset start time when switching trips
    setStartTime(undefined);
  }

  const updateSearchParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(sp as any);
      params.set(key, value);
      router.replace(`/checkout?${params.toString()}`, { scroll: false });
    },
    [sp, router]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!charterId) return;

    // Enforce login before proceeding
    if (!isLoggedIn) {
      openModal("signin", undefined, { showHomeButton: true });
      return;
    }

    if (!canSubmit) return;
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
          firstName,
          lastName,
          email,
          phone,
          note,
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

  const chosenTrip = trips?.[tripIndex];
  const maxGuests = useMemo(() => {
    const tripMax =
      chosenTrip?.maxAnglers && chosenTrip.maxAnglers > 0
        ? chosenTrip.maxAnglers
        : undefined;
    const boatCap =
      charter?.boat?.capacity && charter.boat.capacity > 0
        ? charter.boat.capacity
        : undefined;
    return tripMax ?? boatCap;
  }, [chosenTrip?.maxAnglers, charter?.boat?.capacity]);

  // Clamp adults/children when maxGuests changes
  useEffect(() => {
    if (!maxGuests) return;
    const total = adults + children;
    if (total > maxGuests) {
      // Prefer reducing children first
      const excess = total - maxGuests;
      const newChildren = Math.max(0, children - excess);
      const rem = excess - (children - newChildren);
      const newAdults = Math.max(1, adults - rem);
      updateSearchParam("children", String(newChildren));
      updateSearchParam("adults", String(newAdults));
    }
  }, [maxGuests, adults, children, updateSearchParam]);
  const estTotal = useMemo(() => {
    const p = chosenTrip?.price ?? 0;
    return p * Math.max(1, days);
  }, [chosenTrip?.price, days]);

  return (
    <form onSubmit={onSubmit} className="mt-6">
      {/* Error display */}
      {error && (
        <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Mobile: Summary first */}
      <div className="mb-6 lg:hidden">
        <BookingSummaryCard
          charter={charter}
          captain={charter?.captain}
          date={date}
          days={days}
          adults={adults}
          childrenCount={children}
          tripName={chosenTrip?.name}
          startTime={startTime}
          totalPrice={estTotal}
        />
      </div>

      {/* Main grid */}
      <section className="grid gap-6 lg:grid-cols-5">
        {/* Left column: Form sections */}
        <div className="space-y-6 lg:col-span-3">
          {/* Your Details */}
          <YourDetailsCard
            firstName={firstName}
            lastName={lastName}
            email={email}
            phone={phone}
            disabled={!isLoggedIn}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onEmailChange={setEmail}
            onPhoneChange={setPhone}
          />

          {/* Date + Guests (Search box style) */}
          <DateGuestsCard
            date={date}
            onDateChange={(d) => updateSearchParam("date", d)}
            days={days}
            onDaysChange={(v) => updateSearchParam("days", String(v))}
            adults={adults}
            onAdultsChange={(nextAdults) => {
              const max = maxGuests ?? Infinity;
              const clampedAdults = Math.max(
                1,
                Math.min(nextAdults, max - children)
              );
              updateSearchParam("adults", String(clampedAdults));
            }}
            childrenCount={children}
            onChildrenChange={(nextChildren) => {
              const max = maxGuests ?? Infinity;
              const clampedChildren = Math.max(
                0,
                Math.min(nextChildren, max - adults)
              );
              updateSearchParam("children", String(clampedChildren));
            }}
            maxGuests={maxGuests}
          />

          {/* Trip Selection */}
          <TripSelectionCard
            trips={trips || []}
            selectedIndex={tripIndex}
            days={days}
            charterSpecies={charter?.species || []}
            charterTechniques={charter?.techniques || []}
            onTripSelect={handleTripSelect}
          />

          {/* Start Time Selection */}
          {effectiveStartTimes && effectiveStartTimes.length > 0 && (
            <StartTimeSelection
              startTimes={effectiveStartTimes}
              selectedTime={startTime}
              onTimeSelect={setStartTime}
            />
          )}

          {/* Start Conversation */}
          <StartConversationCard
            captain={charter?.captain}
            charterName={charter?.name}
            location={charter?.location}
            species={charter?.species || []}
            techniques={charter?.techniques || []}
            note={note}
            onNoteChange={setNote}
          />

          {/* Submit Button */}
          <div className="flex flex-col gap-3 p-5 bg-white border rounded-2xl border-black/10 sm:p-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="w-full sm:w-auto rounded-lg bg-[#ec2227] text-white px-8 py-3.5 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d01f24] transition-colors"
            >
              {submitting ? "Submitting..." : "Request to Book"}
            </button>
            {!isLoggedIn && (
              <p className="text-sm text-gray-700">
                Please{" "}
                <button
                  type="button"
                  className="font-semibold text-[#ec2227] underline underline-offset-2"
                  onClick={() =>
                    openModal("signin", undefined, { showHomeButton: true })
                  }
                >
                  sign in
                </button>{" "}
                or{" "}
                <button
                  type="button"
                  className="font-semibold text-[#ec2227] underline underline-offset-2"
                  onClick={() =>
                    openModal("register", undefined, { showHomeButton: true })
                  }
                >
                  create an account
                </button>{" "}
                to continue.
              </p>
            )}
            {!canSubmit && (
              <p className="text-sm text-gray-600">
                Please complete all required fields
              </p>
            )}
          </div>
        </div>

        {/* Right column: Summary (desktop only) */}
        <div className="hidden lg:block lg:col-span-2">
          <div className="">
            <BookingSummaryCard
              charter={charter}
              captain={charter?.captain}
              date={date}
              days={days}
              adults={adults}
              childrenCount={children}
              tripName={chosenTrip?.name}
              startTime={startTime}
              totalPrice={estTotal}
            />
          </div>
        </div>
      </section>
    </form>
  );
}
