"use server";

import { randomUUID } from "node:crypto";

import {
  CharterPricingPlan,
  CharterStyle,
  MediaKind,
  Prisma,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export type Trip = {
  name: string;
  tripType?: string;
  price: number;
  duration: string;
  startTimes: string[];
  maxAnglers: number;
  private: boolean;
  description?: string;
  targetSpecies?: string[];
  techniques?: string[];
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
  afterPolicy?: string;
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
  operator: {
    firstName: string;
    lastName: string;
    name: string;
    phone: string;
    experienceYears?: number;
    crewCount?: number;
    bio?: string;
    avatar?: { name: string; url: string } | null;
  };
  charterType: string;
  name: string;
  locationState: string;
  locationDistrict: string;
  location: string;
  address: string;
  postcode: string;
  coordinates: { lat: number; lng: number };
  images: Array<{ name: string; url: string }>;
  videos?: Array<{ name: string; url: string }>;
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
  pricingModel: string;
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
  if (!payload.operator?.firstName?.trim())
    errors.operatorFirstName = "First name is required.";
  if (!payload.operator?.lastName?.trim())
    errors.operatorLastName = "Last name is required.";
  if (!payload.operator?.name?.trim())
    errors.operatorName = "Preferred operator name is required.";
  if (!payload.operator?.phone?.trim())
    errors.operatorPhone = "Phone number is required.";
  if (!payload.charterType?.trim())
    errors.charterType = "Select a charter type.";
  if (!payload.location?.trim()) errors.location = "Location is required.";
  if (!payload.locationState?.trim())
    errors.locationState = "State is required.";
  if (!payload.locationDistrict?.trim())
    errors.locationDistrict = "District is required.";
  if (!payload.address?.trim()) errors.address = "Starting point is required.";
  if (!payload.postcode?.trim()) errors.postcode = "Postcode is required.";
  if (
    typeof payload.coordinates?.lat !== "number" ||
    typeof payload.coordinates?.lng !== "number"
  ) {
    errors.coordinates = "Latitude and longitude must be numbers.";
  }
  if (!Array.isArray(payload.trip) || payload.trip.length === 0) {
    errors.trip = "Add at least one trip.";
  }
  if (!Array.isArray(payload.images) || payload.images.length < 3) {
    errors.images = "Upload at least 3 photos.";
  }
  if (Array.isArray(payload.images) && payload.images.length > 15) {
    errors.images = "Maximum 15 photos allowed.";
  }
  if (Array.isArray(payload.videos) && payload.videos.length > 3) {
    errors.videos = "Maximum 3 videos allowed.";
  }
  if (!payload.boat?.name?.trim()) errors.boatName = "Boat name is required.";
  if (!payload.boat?.type?.trim()) errors.boatType = "Boat type is required.";
  if (!payload.boat?.length?.trim())
    errors.boatLength = "Boat length is required.";
  if (!payload.pricingModel?.trim())
    errors.pricingModel = "Select a pricing plan.";

  if (Object.keys(errors).length) {
    return { ok: false, errors };
  }

  const pricingPlan = resolvePricingPlan(payload.pricingModel);
  const latitude = toDecimal(payload.coordinates?.lat);
  const longitude = toDecimal(payload.coordinates?.lng);
  const boatLengthFt = parseBoatLength(payload.boat.length) ?? 0;

  try {
    const { charter } = await prisma.$transaction(async (tx) => {
      const provisionalUser = await tx.user.create({
        data: {
          email: `pending-${randomUUID()}@fishon.local`,
          passwordHash: "",
        },
      });

      const captainProfile = await tx.captainProfile.create({
        data: {
          userId: provisionalUser.id,
          firstName: payload.operator.firstName,
          lastName: payload.operator.lastName,
          displayName: payload.operator.name,
          phone: payload.operator.phone,
          bio: payload.operator.bio ?? "",
          experienceYrs: payload.operator.experienceYears ?? 0,
          avatarUrl: payload.operator.avatar?.url ?? null,
        },
      });

      const charterRecord = await tx.charter.create({
        data: {
          captainId: captainProfile.id,
          charterType: payload.charterType,
          name: payload.name,
          state: payload.locationState,
          district: payload.locationDistrict,
          startingPoint: payload.address,
          postcode: payload.postcode,
          latitude: latitude ?? undefined,
          longitude: longitude ?? undefined,
          description: payload.description,
          pricingPlan,
          amenities: {
            create: (payload.includes ?? []).map((label) => ({ label })),
          },
          features: {
            create: (payload.boat.features ?? []).map((label) => ({ label })),
          },
          boat: {
            create: {
              name: payload.boat.name,
              type: payload.boat.type,
              lengthFt: boatLengthFt,
              capacity: payload.boat.capacity,
            },
          },
          pickup: payload.pickup.available
            ? {
                create: {
                  available: true,
                  fee: toDecimal(payload.pickup.fee) ?? undefined,
                  notes: payload.pickup.notes ?? null,
                  areas: {
                    create: (payload.pickup.areas ?? []).map((label) => ({ label })),
                  },
                },
              }
            : undefined,
          policies: {
            create: {
              licenseProvided: payload.licenseProvided,
              catchAndKeep: Boolean(payload.policies.catchAndKeep),
              catchAndRelease: Boolean(payload.policies.catchAndRelease),
              childFriendly: Boolean(payload.policies.childFriendly),
              liveBaitProvided: Boolean(payload.policies.liveBaitProvided),
              alcoholAllowed: Boolean(payload.policies.alcoholAllowed),
              smokingAllowed: Boolean(payload.policies.smokingAllowed),
            },
          },
          trips: {
            create: payload.trip.map((trip, index) => ({
              name: trip.name,
              tripType: trip.tripType ?? `custom-${index + 1}`,
              price: toDecimal(trip.price) ?? new Prisma.Decimal(0),
              durationHours: parseDurationHours(trip.duration) ?? 0,
              maxAnglers: trip.maxAnglers,
              style: trip.private ? CharterStyle.PRIVATE : CharterStyle.SHARED,
              description: trip.description ?? null,
              startTimes: {
                create: (trip.startTimes ?? []).map((value) => ({ value })),
              },
              species: {
                create: (trip.targetSpecies ?? []).map((value) => ({ value })),
              },
              techniques: {
                create: (trip.techniques ?? []).map((value) => ({ value })),
              },
            })),
          },
          media: {
            create: [
              ...(payload.images ?? []).map((item, index) => ({
                kind: MediaKind.CHARTER_PHOTO,
                url: item.url,
                storageKey: item.name,
                sortOrder: index,
              })),
              ...(payload.videos ?? []).map((item, index) => ({
                kind: MediaKind.CHARTER_VIDEO,
                url: item.url,
                storageKey: item.name,
                sortOrder: index,
              })),
            ],
          },
        },
        select: { id: true },
      });

      return { charter: charterRecord };
    });

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
      }
    }

    revalidatePath("/captains/register");
    return { ok: true, charterId: charter.id };
  } catch (error) {
    console.error("submitCharter error", error);
    return {
      ok: false,
      error: "Failed to save your charter. Please try again soon.",
    };
  }
}

function resolvePricingPlan(value: string): CharterPricingPlan {
  switch (value?.toUpperCase()) {
    case "SILVER":
      return CharterPricingPlan.SILVER;
    case "GOLD":
      return CharterPricingPlan.GOLD;
    default:
      return CharterPricingPlan.BASIC;
  }
}

function toDecimal(value: number | null | undefined): Prisma.Decimal | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return new Prisma.Decimal(value);
}

function parseBoatLength(length: string | null | undefined): number | null {
  if (!length) return null;
  const match = length.match(/([\d.]+)/);
  return match ? Math.round(Number(match[1])) : null;
}

function parseDurationHours(duration: string | null | undefined): number | null {
  if (!duration) return null;
  const match = duration.match(/([\d.]+)/);
  return match ? Math.round(Number(match[1])) : null;
}
