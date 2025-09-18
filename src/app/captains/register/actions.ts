// Server Actions for charter registration
"use server";
import { revalidatePath } from "next/cache";

export type Trip = {
  name: string;
  price: number;
  duration: string;
  startTimes: string[];
  maxAnglers: number;
  private: boolean;
  description?: string;
};

export type Pickup = {
  available: boolean;
  included: boolean;
  fee?: number;
  areas?: string[];
  notes?: string;
};

export type Policies = {
  catchAndKeep?: boolean;
  catchAndRelease?: boolean;
  childFriendly?: boolean;
  liveBaitProvided?: boolean;
  alcoholAllowed?: boolean;
  smokingAllowed?: boolean;
};

export type Cancellation = {
  freeUntilHours: number;
  afterPolicy?: string; // e.g. "CXL_AFTER"
};

export type Boat = {
  name: string;
  type: string;
  length: string;
  capacity: number;
  features: string[];
};

export type CharterPayload = {
  id?: number;
  name: string;
  location: string;
  address: string;
  coordinates: { lat: number; lng: number };
  images: string[];
  description: string;
  trip: Trip[];
  species: string[];
  techniques: string[];
  includes: string[];
  excludes: string[];
  licenseProvided: boolean;
  pickup: Pickup;
  policies: Policies;
  cancellation: Cancellation;
  languages: string[];
  boat: Boat;
};

export async function submitCharter(formData: FormData) {
  const raw = formData.get("payload");
  if (!raw || typeof raw !== "string") {
    return { ok: false, error: "Missing payload." };
  }

  let payload: CharterPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return { ok: false, error: "Invalid JSON payload." };
  }

  const errors: Record<string, string> = {};
  if (!payload.name?.trim()) errors.name = "Charter name is required.";
  if (!payload.location?.trim()) errors.location = "Location is required.";
  if (!payload.address?.trim()) errors.address = "Address is required.";
  if (
    typeof payload.coordinates?.lat !== "number" ||
    typeof payload.coordinates?.lng !== "number"
  ) {
    errors.coordinates = "Latitude and longitude must be numbers.";
  }
  if (!Array.isArray(payload.trip) || payload.trip.length === 0) {
    errors.trip = "At least one trip is required.";
  }
  if (!Array.isArray(payload.images) || payload.images.length === 0) {
    errors.images = "Please add at least one image URL.";
  }
  if (!payload.boat?.name?.trim()) errors.boatName = "Boat name is required.";
  if (!payload.boat?.type?.trim()) errors.boatType = "Boat type is required.";
  if (!payload.boat?.length?.trim())
    errors.boatLength = "Boat length is required.";

  if (Object.keys(errors).length) {
    return { ok: false, errors };
  }

  // Optional: forward to webhook
  const webhook = process.env.CHARTER_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          source: "fishon.my/captains/register",
          timestamp: new Date().toISOString(),
          charter: payload,
        }),
      });
    } catch (err) {
      console.error("CHARTER_WEBHOOK_URL error:", err);
      // don't fail UX just for webhook failure
    }
  }

  revalidatePath("/captains/register");
  return { ok: true, charter: payload };
}
