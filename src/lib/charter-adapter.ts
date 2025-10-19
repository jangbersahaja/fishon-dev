/**
 * Data adapter for converting Fishon Captain backend data
 * to the frontend Charter format used by the UI components
 */

import type {
  Captain,
  Charter,
  FishingType,
  Pickup,
  Policies,
  Tier,
  Trip,
} from "@/dummy/charter";
import type { BackendCharter, BackendTrip } from "./captain-api";

/**
 * Map backend charter type to fishing type
 */
function mapFishingType(charterType: string): FishingType {
  const type = charterType.toLowerCase();
  if (type.includes("lake") || type.includes("reservoir")) return "lake";
  if (type.includes("stream") || type.includes("river")) return "stream";
  if (type.includes("offshore") || type.includes("deep")) return "offshore";
  return "inshore"; // default
}

/**
 * Map backend pricing plan to tier
 */
function mapTier(pricingPlan: string): Tier {
  const plan = pricingPlan.toLowerCase();
  if (plan === "silver") return "silver";
  if (plan === "gold") return "gold";
  return "basic";
}

/**
 * Convert backend trip to frontend trip format
 */
function convertTrip(backendTrip: BackendTrip): Trip {
  return {
    name: backendTrip.name,
    price: Number(backendTrip.price),
    duration: `${backendTrip.durationHours} hour${
      backendTrip.durationHours !== 1 ? "s" : ""
    }`,
    description: backendTrip.description || undefined,
    startTimes: backendTrip.startTimes?.map((st) => st.value) || [],
    maxAnglers: backendTrip.maxAnglers,
    private: backendTrip.style === "PRIVATE",
  };
}

/**
 * Convert backend captain to frontend captain format
 */
function convertCaptain(backendCaptain: {
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  experienceYrs: number;
  avatarUrl: string | null;
}): Captain {
  return {
    name:
      backendCaptain.displayName ||
      `${backendCaptain.firstName} ${backendCaptain.lastName}`,
    avatarUrl: backendCaptain.avatarUrl || undefined,
    yearsExperience: backendCaptain.experienceYrs,
    crewCount: 1, // Default to 1, can be enhanced later
    intro: backendCaptain.bio || "Experienced fishing captain",
  };
}

/**
 * Convert backend pickup to frontend pickup format
 */
function convertPickup(
  backendPickup: {
    available: boolean;
    fee: number | null;
    notes: string | null;
    areas: Array<{ label: string }>;
  } | null
): Pickup {
  if (!backendPickup) {
    return {
      available: false,
      included: false,
    };
  }

  return {
    available: backendPickup.available,
    included: backendPickup.fee === null || backendPickup.fee === 0,
    fee: backendPickup.fee ? Number(backendPickup.fee) : undefined,
    areas: backendPickup.areas?.map((a) => a.label) || [],
    notes: backendPickup.notes || undefined,
  };
}

/**
 * Convert backend policies to frontend policies format
 */
function convertPolicies(
  backendPolicies: {
    licenseProvided?: boolean;
    catchAndKeep: boolean;
    catchAndRelease: boolean;
    childFriendly: boolean;
    liveBaitProvided: boolean;
    alcoholAllowed: boolean;
    smokingAllowed: boolean;
  } | null
): Policies {
  if (!backendPolicies) {
    return {
      catchAndKeep: false,
      catchAndRelease: true,
      childFriendly: true,
    };
  }

  return {
    catchAndKeep: backendPolicies.catchAndKeep,
    catchAndRelease: backendPolicies.catchAndRelease,
    childFriendly: backendPolicies.childFriendly,
    liveBaitProvided: backendPolicies.liveBaitProvided,
    alcoholAllowed: backendPolicies.alcoholAllowed,
    smokingAllowed: backendPolicies.smokingAllowed,
  };
}

/**
 * Convert backend charter to frontend Charter format
 */
export function convertBackendCharterToFrontend(
  backendCharter: BackendCharter
): Charter {
  // Extract images from media
  const images =
    backendCharter.media
      ?.filter((m) => m.kind === "CHARTER_PHOTO")
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((m) => m.url) || [];

  // Build location string
  const location = `${backendCharter.district}, ${backendCharter.state}`;
  const address = backendCharter.startingPoint;

  // Get coordinates
  const coordinates =
    backendCharter.latitude && backendCharter.longitude
      ? {
          lat: Number(backendCharter.latitude),
          lng: Number(backendCharter.longitude),
        }
      : undefined;

  // Convert trips
  const trips = backendCharter.trips?.map(convertTrip) || [];

  // Extract species and techniques from all trips
  const allSpecies = new Set<string>();
  const allTechniques = new Set<string>();

  backendCharter.trips?.forEach((trip) => {
    trip.species?.forEach((s) => allSpecies.add(s.value));
    trip.techniques?.forEach((t) => allTechniques.add(t.value));
  });

  const species = Array.from(allSpecies);
  const techniques = Array.from(allTechniques);

  // Get amenities and features
  const includes = backendCharter.amenities?.map((a) => a.label) || [];
  const features = backendCharter.features?.map((f) => f.label) || [];

  // Build boat info
  const boat = backendCharter.boat
    ? {
        name: backendCharter.boat.name,
        type: backendCharter.boat.type,
        length: `${backendCharter.boat.lengthFt} ft`,
        capacity: backendCharter.boat.capacity,
        features: features,
      }
    : {
        name: "N/A",
        type: "N/A",
        length: "N/A",
        capacity: 1,
        features: [],
      };

  return {
    id: parseInt(backendCharter.id, 10) || 0,
    // Preserve backend string ID for stable keys/links across sources
    // Note: Charter type doesn't include this field; consumers can access via (charter as any).backendId
    ...(backendCharter.id ? { backendId: backendCharter.id } : {}),
    name: backendCharter.name,
    location,
    address,
    coordinates,
    images: images.length > 0 ? images : undefined,
    imageUrl: images[0] || undefined,
    description: backendCharter.description,
    trip: trips,
    species,
    techniques,
    includes,
    excludes: [], // Can be enhanced later if backend provides this
    licenseProvided: backendCharter.policies?.licenseProvided ?? false,
    pickup: convertPickup(backendCharter.pickup),
    policies: convertPolicies(backendCharter.policies),
    languages: ["English", "Bahasa Malaysia"], // Default, can be enhanced later
    boat,
    captain: convertCaptain(backendCharter.captain),
    fishingType: mapFishingType(backendCharter.charterType),
    tier: mapTier(backendCharter.pricingPlan),
  };
}

/**
 * Convert multiple backend charters to frontend format
 */
export function convertBackendChartersToFrontend(
  backendCharters: BackendCharter[]
): Charter[] {
  return backendCharters.map(convertBackendCharterToFrontend);
}
