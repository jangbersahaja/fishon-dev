/**
 * Charter data service
 *
 * This service provides a unified interface for fetching charter data.
 * It attempts to fetch from the Fishon Captain backend API first,
 * and falls back to dummy data if the API is not available.
 */

import type { Charter } from "@/dummy/charter";
import dummyCharters from "@/dummy/charter";
import { fetchCharterById, fetchCharters, searchCharters } from "./captain-api";
import {
  fetchCharterByIdFromDb,
  fetchChartersFromDb,
  isCaptainDbConfigured,
  searchChartersFromDb,
} from "./captain-db";
import {
  convertBackendChartersToFrontend,
  convertBackendCharterToFrontend,
} from "./charter-adapter";

/**
 * Check if backend API is configured
 */
function isBackendConfigured(): boolean {
  return !!process.env.FISHON_CAPTAIN_API_URL;
}

function isDbPreferred(): boolean {
  return (
    process.env.USE_CAPTAIN_DB === "1" || process.env.USE_CAPTAIN_DB === "true"
  );
}

/**
 * Get all charters
 * Tries backend API first, falls back to dummy data
 */
export async function getCharters(): Promise<Charter[]> {
  // Preference order: DB (if configured + flag) → API → dummy
  if (isDbPreferred() && isCaptainDbConfigured()) {
    try {
      const backendCharters = await fetchChartersFromDb();
      if (backendCharters.length)
        return convertBackendChartersToFrontend(backendCharters);
      console.log("Captain DB returned 0 charters; falling back to API/dummy");
    } catch (e) {
      console.error(
        "Error reading from Captain DB, falling back to API/dummy",
        e
      );
    }
  }

  if (!isBackendConfigured()) {
    console.log("Using dummy charter data (backend not configured)");
    return dummyCharters;
  }

  try {
    const backendCharters = await fetchCharters();

    if (backendCharters.length === 0) {
      console.log("No charters from backend, using dummy data");
      return dummyCharters;
    }

    return convertBackendChartersToFrontend(backendCharters);
  } catch (error) {
    console.error(
      "Error fetching charters from backend, falling back to dummy data:",
      error
    );
    return dummyCharters;
  }
}

/**
 * Get a single charter by ID
 * Tries backend API first, falls back to dummy data
 */
export async function getCharterById(
  id: string | number
): Promise<Charter | undefined> {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;

  // Try DB first when enabled
  if (isDbPreferred() && isCaptainDbConfigured()) {
    try {
      const backend = await fetchCharterByIdFromDb(String(id));
      if (backend) return convertBackendCharterToFrontend(backend);
    } catch (e) {
      console.error(
        "Error reading charter from Captain DB; will try API/dummy",
        e
      );
    }
  }

  if (!isBackendConfigured()) {
    console.log(
      `Using dummy charter data for ID ${numericId} (backend not configured)`
    );
    return dummyCharters.find((c) => c.id === numericId);
  }

  try {
    // Try to fetch from backend using the string ID (backend uses cuid)
    const backendCharter = await fetchCharterById(String(id));

    if (backendCharter) {
      return convertBackendCharterToFrontend(backendCharter);
    }

    // If not found in backend, try dummy data
    console.log(`Charter ${id} not found in backend, checking dummy data`);
    return dummyCharters.find((c) => c.id === numericId);
  } catch (error) {
    console.error(
      `Error fetching charter ${id} from backend, falling back to dummy data:`,
      error
    );
    return dummyCharters.find((c) => c.id === numericId);
  }
}

/**
 * Search charters by various criteria
 * Tries backend API first, falls back to dummy data filtering
 */
export async function searchChartersByCriteria(criteria: {
  location?: string;
  charterType?: string;
  technique?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Charter[]> {
  // DB path: currently no filtered search in SQL; fetch all and filter client-side as interim
  if (isDbPreferred() && isCaptainDbConfigured()) {
    try {
      // Use DB search for location/name/type facets
      const backendCharters = await searchChartersFromDb(
        {
          location: criteria.location,
          charterType: criteria.charterType,
          q: criteria.location, // simple text search proxy
        },
        200
      );
      if (backendCharters.length) {
        const converted = convertBackendChartersToFrontend(backendCharters);
        return filterDummyCharters(converted as any, criteria);
      }
    } catch (e) {
      console.error("Error searching via Captain DB; will try API/dummy", e);
    }
  }

  if (!isBackendConfigured()) {
    console.log("Using dummy charter data for search (backend not configured)");
    return filterDummyCharters(dummyCharters, criteria);
  }

  try {
    const backendCharters = await searchCharters(criteria);

    if (backendCharters.length === 0) {
      console.log("No results from backend search, using filtered dummy data");
      return filterDummyCharters(dummyCharters, criteria);
    }

    return convertBackendChartersToFrontend(backendCharters);
  } catch (error) {
    console.error(
      "Error searching charters from backend, falling back to dummy data:",
      error
    );
    return filterDummyCharters(dummyCharters, criteria);
  }
}

/**
 * Filter dummy charters based on search criteria
 * Used as fallback when backend is not available
 */
function filterDummyCharters(
  charters: Charter[],
  criteria: {
    location?: string;
    charterType?: string;
    technique?: string;
    minPrice?: number;
    maxPrice?: number;
  }
): Charter[] {
  return charters.filter((charter) => {
    // Filter by location
    if (criteria.location) {
      const locationMatch =
        charter.location
          .toLowerCase()
          .includes(criteria.location.toLowerCase()) ||
        charter.address.toLowerCase().includes(criteria.location.toLowerCase());
      if (!locationMatch) return false;
    }

    // Filter by charter type (fishing type)
    if (criteria.charterType) {
      const typeMatch =
        charter.fishingType.toLowerCase() ===
        criteria.charterType.toLowerCase();
      if (!typeMatch) return false;
    }

    // Filter by technique
    if (criteria.technique) {
      const techniqueMatch = charter.techniques.some((t) =>
        t.toLowerCase().includes(criteria.technique!.toLowerCase())
      );
      if (!techniqueMatch) return false;
    }

    // Filter by price range
    if (criteria.minPrice !== undefined || criteria.maxPrice !== undefined) {
      const prices = charter.trip.map((t) => t.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (criteria.minPrice !== undefined && maxPrice < criteria.minPrice)
        return false;
      if (criteria.maxPrice !== undefined && minPrice > criteria.maxPrice)
        return false;
    }

    return true;
  });
}

/**
 * Get charters by fishing type
 */
export async function getChartersByType(type: string): Promise<Charter[]> {
  const allCharters = await getCharters();
  return allCharters.filter(
    (c) => c.fishingType.toLowerCase() === type.toLowerCase()
  );
}

/**
 * Get charters by technique
 */
export async function getChartersByTechnique(
  technique: string
): Promise<Charter[]> {
  const allCharters = await getCharters();
  return allCharters.filter((c) =>
    c.techniques.some((t) => t.toLowerCase().includes(technique.toLowerCase()))
  );
}
