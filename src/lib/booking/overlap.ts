// Shared booking overlap utilities
// Contract:
// - addDays(dateUTC, n): returns new Date at UTC midnight + n days
// - rangesOverlap(aStart, aDays, bStart, bDays): true if [a..a+days-1] intersects [b..b+days-1]
// - hasConflicts(candidates, newStart, newDays, opts): determines if any overlapping booking conflicts.

export type CandidateBooking = {
  date: Date; // start date (assumed UTC midnight semantics)
  days: number;
  startTime: string | null;
};

export function addDaysUTC(date: Date, daysToAdd: number) {
  const dt = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  dt.setUTCDate(dt.getUTCDate() + daysToAdd);
  return dt;
}

export function rangesOverlap(
  aStart: Date,
  aDays: number,
  bStart: Date,
  bDays: number
) {
  const aEnd = addDaysUTC(aStart, Math.max(1, aDays) - 1);
  const bEnd = addDaysUTC(bStart, Math.max(1, bDays) - 1);
  return aStart <= bEnd && bStart <= aEnd;
}

export function hasConflicts(
  candidates: CandidateBooking[],
  newStart: Date,
  newDays: number,
  options: { usesStartTimes: boolean; selectedStartTime?: string | null }
) {
  return candidates.some((b) => {
    const bStart = new Date(
      Date.UTC(
        b.date.getUTCFullYear(),
        b.date.getUTCMonth(),
        b.date.getUTCDate()
      )
    );
    const overlap = rangesOverlap(
      bStart,
      Math.max(1, b.days),
      newStart,
      Math.max(1, newDays)
    );
    if (!overlap) return false;
    if (options.usesStartTimes) {
      const sel = options.selectedStartTime ?? null;
      return (b.startTime ?? null) === sel;
    }
    return true;
  });
}
