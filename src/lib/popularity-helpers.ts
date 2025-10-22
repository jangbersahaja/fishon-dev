/**
 * Popularity calculation helpers based on charter data
 */

import { expandDestinationSearchTerms } from "@/utils/destinationAliases";
import type { Charter } from "@fishon/ui";

/**
 * Extract location info from charter
 * Charter location format: "{district}, {state}"
 * e.g., "Klang, Selangor" or "Port Klang, Selangor"
 */
function extractLocationInfo(charter: Charter): {
  district?: string;
  state?: string;
} {
  // Location format: "District, State"
  const locationParts = charter.location
    .split(",")
    .map((part) => part.trim().toLowerCase());

  const district = locationParts[0] || undefined;
  const state = locationParts[1] || undefined;

  return { district, state };
}

/**
 * Check if charter matches a destination
 */
function charterMatchesDestination(
  charter: Charter,
  destination: string
): boolean {
  const searchTerms = expandDestinationSearchTerms(destination);
  const { district } = extractLocationInfo(charter);

  if (!district) return false;

  for (const term of searchTerms) {
    if (term && district.includes(term)) {
      return true;
    }
  }

  return false;
}

/**
 * Count charters for a destination
 */
export function countChartersForDestination(
  charters: Charter[],
  destination: string
): number {
  return charters.filter((charter) =>
    charterMatchesDestination(charter, destination)
  ).length;
}

/**
 * Get popular destinations with charter counts
 */
export interface PopularDestination {
  name: string;
  count: number;
  state?: string;
}

export function getPopularDestinations(
  charters: Charter[],
  limit?: number
): PopularDestination[] {
  // Extract all unique districts from charters
  const districtCounts = new Map<string, { count: number; state?: string }>();

  charters.forEach((charter) => {
    const { district, state } = extractLocationInfo(charter);

    if (!district || district.length < 3) return;

    // Normalize the district name
    let normalized = district;

    // Handle common variations
    if (district.includes("port klang")) {
      normalized = "port klang";
    } else if (district.includes("kuala selangor")) {
      normalized = "kuala selangor";
    } else if (district.includes("klang") && !district.includes("port")) {
      normalized = "klang";
    }

    const current = districtCounts.get(normalized);
    if (current) {
      current.count += 1;
    } else {
      districtCounts.set(normalized, { count: 1, state });
    }
  });

  // Convert to array and sort by count
  const destinations = Array.from(districtCounts.entries())
    .map(([name, data]) => ({
      // Capitalize first letter of each word for display
      name: name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      count: data.count,
      state: data.state,
    }))
    .sort((a, b) => b.count - a.count);

  return limit ? destinations.slice(0, limit) : destinations;
}

/**
 * Count charters by fishing type
 */
export function countChartersByType(charters: Charter[], type: string): number {
  return charters.filter(
    (c) => c.fishingType.toLowerCase() === type.toLowerCase()
  ).length;
}

/**
 * Count charters by technique
 */
export function countChartersByTechnique(
  charters: Charter[],
  technique: string
): number {
  const normalized = technique.toLowerCase();
  return charters.filter((c) =>
    c.techniques.some((t) => t.toLowerCase().includes(normalized))
  ).length;
}

/**
 * Get popular techniques with charter counts
 */
export interface PopularTechnique {
  name: string;
  count: number;
}

export function getPopularTechniques(
  charters: Charter[],
  techniques: string[],
  limit?: number
): PopularTechnique[] {
  const techniquesWithCounts = techniques
    .map((tech) => ({
      name: tech,
      count: countChartersByTechnique(charters, tech),
    }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);

  return limit ? techniquesWithCounts.slice(0, limit) : techniquesWithCounts;
}

/**
 * Get all fishing types with charter counts
 */
export interface FishingTypeWithCount {
  key: string;
  label: string;
  count: number;
}

export function getFishingTypesWithCounts(
  charters: Charter[]
): FishingTypeWithCount[] {
  const types = [
    { key: "lake", label: "Lake" },
    { key: "stream", label: "Stream" },
    { key: "inshore", label: "Inshore" },
    { key: "offshore", label: "Offshore" },
  ];

  return types.map((type) => ({
    ...type,
    count: countChartersByType(charters, type.key),
  }));
}
