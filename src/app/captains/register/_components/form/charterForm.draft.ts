import type { CharterFormValues } from "./charterForm.schema";
import { defaultTrip } from "./charterForm.defaults";

function normalizeNumber(value: unknown, fallback: number = Number.NaN) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function sanitizeForDraft(values: CharterFormValues) {
  const { photos: _photos, videos: _videos, operator, ...rest } = values;
  const { avatar: _avatar, ...operatorRest } = operator;

  void _photos;
  void _videos;
  void _avatar;

  return {
    ...rest,
    operator: { ...operatorRest },
    trips: (values.trips ?? []).map((trip) => ({ ...trip })),
    boat: { ...values.boat },
    pickup: { ...values.pickup },
    policies: { ...values.policies },
  };
}

export type DraftValues = ReturnType<typeof sanitizeForDraft>;

export function hydrateDraftValues(
  defaults: CharterFormValues,
  draft: DraftValues
): CharterFormValues {
  const merged: CharterFormValues = {
    ...defaults,
    ...draft,
  };

  merged.operator = {
    ...defaults.operator,
    ...draft.operator,
    experienceYears: normalizeNumber(draft.operator?.experienceYears, Number.NaN),
    bio: draft.operator?.bio ?? defaults.operator.bio,
    avatar: undefined,
  };

  merged.latitude = normalizeNumber((draft as any).latitude, Number.NaN);
  merged.longitude = normalizeNumber((draft as any).longitude, Number.NaN);

  merged.boat = {
    ...defaults.boat,
    ...draft.boat,
    lengthFeet: normalizeNumber(draft.boat?.lengthFeet, Number.NaN),
    capacity: normalizeNumber(draft.boat?.capacity, Number.NaN),
  };

  merged.pickup = {
    ...defaults.pickup,
    ...draft.pickup,
    fee:
      draft.pickup && typeof draft.pickup.fee === "number" && Number.isFinite(draft.pickup.fee)
        ? draft.pickup.fee
        : draft.pickup?.fee === null
        ? null
        : null,
    areas: draft.pickup?.areas ?? defaults.pickup.areas,
  };

  merged.policies = {
    ...defaults.policies,
    ...draft.policies,
  };

  const draftTrips = draft.trips && draft.trips.length ? draft.trips : defaults.trips;
  merged.trips = draftTrips.map((trip, index) => {
    const base = defaults.trips[index] ?? defaultTrip();
    return {
      ...base,
      ...trip,
      price: normalizeNumber(trip?.price, Number.NaN),
      durationHours: normalizeNumber(trip?.durationHours, Number.NaN),
      maxAnglers: normalizeNumber(trip?.maxAnglers, Number.NaN),
    };
  });

  if (!merged.trips.length) {
    merged.trips = [defaultTrip()];
  }

  merged.photos = [];
  merged.videos = [];

  return merged;
}
