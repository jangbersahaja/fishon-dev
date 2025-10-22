/**
 * Charter types for fishon-market frontend
 * These types represent the UI data structure for displaying charters
 */

export type Trip = {
  name: string;
  price: number; // RM
  duration: string; // e.g. "4 hours", "8 hours"
  description?: string;
  startTimes?: string[]; // 24h strings e.g. ["07:00","13:30"]
  maxAnglers?: number; // max pax fishing
  private?: boolean; // whole boat vs shared
};

export type Policies = {
  catchAndKeep: boolean;
  catchAndRelease: boolean;
  childFriendly: boolean;
  wheelchairAccessible?: boolean;
  liveBaitProvided?: boolean;
  alcoholAllowed?: boolean;
  smokingAllowed?: boolean;
};

export type Pickup = {
  available: boolean;
  included: boolean;
  fee?: number; // RM if not included
  areas?: string[]; // pickup coverage
  notes?: string;
};

export type Captain = {
  name: string;
  avatarUrl?: string; // logo/photo
  yearsExperience: number;
  crewCount: number;
  intro: string; // short intro paragraph
};

export type FishingType = "lake" | "stream" | "inshore" | "offshore";
export type Tier = "basic" | "silver" | "gold";

export type Charter = {
  id: number;
  name: string;
  location: string; // "Klang, Selangor"
  address: string; // meeting point or jetty
  coordinates?: { lat: number; lng: number };
  images?: string[];
  imageUrl?: string;
  description: string;
  trip: Trip[];
  species: string[]; // target species
  techniques: string[]; // e.g. "Light Tackle", "Jigging"
  includes: string[]; // included in price
  excludes: string[]; // not included
  licenseProvided: boolean;
  pickup: Pickup;
  policies: Policies;
  languages?: string[]; // spoken by crew
  boat: {
    name: string;
    type: string;
    length: string;
    capacity: number; // boat pax capacity
    features: string[];
  };
  captain: Captain;
  fishingType: FishingType;
  tier: Tier;
};
