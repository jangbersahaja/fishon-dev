/**
 * Test script to verify city-to-district mapping
 *
 * Run with: npx tsx scripts/test-city-mapping.ts
 */

import {
  CITY_TO_DISTRICT_MAP,
  getCityDistrict,
} from "../src/lib/helpers/city-district-mapping";
import { getDestinationImage } from "../src/lib/helpers/image-helpers";

console.log("\n=== City-to-District Mapping Test ===\n");

// Test some common Selangor cities
const testCities = [
  "Klang",
  "Port Klang",
  "Shah Alam",
  "Petaling Jaya",
  "Subang Jaya",
  "Kuala Selangor",
  "Kajang",
  "Selayang",
];

console.log("Testing Selangor cities:\n");
testCities.forEach((city) => {
  const district = getCityDistrict(city);
  const image = getDestinationImage(district, "Selangor");
  console.log(
    `${city.padEnd(20)} → ${district.padEnd(20)} → ${image || "❌ NO IMAGE"}`
  );
});

// Show mapping stats
console.log("\n=== Mapping Statistics ===\n");
const totalCities = Object.keys(CITY_TO_DISTRICT_MAP).length;
console.log(`Total city mappings: ${totalCities}`);

// Count by state
const stateStats: Record<string, number> = {};
Object.entries(CITY_TO_DISTRICT_MAP).forEach(([city, district]) => {
  // Infer state from district patterns (simplified)
  const state = "various"; // We'd need actual state info for accurate stats
  stateStats[state] = (stateStats[state] || 0) + 1;
});

console.log("\nMapping works correctly if:");
console.log("✓ All test cities map to lowercase district names");
console.log("✓ Districts match actual Malaysian administrative divisions");
console.log("✓ Image paths exist for mapped districts");
console.log("\n");
