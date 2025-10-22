import { hasConflicts } from "@/lib/booking/overlap";
import { describe, expect, it } from "vitest";

type Candidate = { date: Date; days: number; startTime: string | null };

function d(s: string) {
  return new Date(s);
}

describe("booking overlap predicate (shared util)", () => {
  it("no overlap different days", () => {
    const candidates: Candidate[] = [
      { date: d("2025-10-20T00:00:00Z"), days: 1, startTime: null },
    ];
    const conflict = hasConflicts(candidates, d("2025-10-21T00:00:00Z"), 1, {
      usesStartTimes: false,
    });
    expect(conflict).toBe(false);
  });

  it("overlap same day when no start times", () => {
    const candidates: Candidate[] = [
      { date: d("2025-10-20T00:00:00Z"), days: 1, startTime: null },
    ];
    const conflict = hasConflicts(candidates, d("2025-10-20T00:00:00Z"), 1, {
      usesStartTimes: false,
    });
    expect(conflict).toBe(true);
  });

  it("multi-day overlap across range", () => {
    const candidates: Candidate[] = [
      { date: d("2025-10-20T00:00:00Z"), days: 3, startTime: null },
    ];
    // existing covers 20-22, incoming covers 22-23 → conflict
    const conflict = hasConflicts(candidates, d("2025-10-22T00:00:00Z"), 2, {
      usesStartTimes: false,
    });
    expect(conflict).toBe(true);
  });

  it("start time specific conflict when using times (same time)", () => {
    const candidates: Candidate[] = [
      { date: d("2025-10-20T00:00:00Z"), days: 1, startTime: "07:00" },
    ];
    const conflict = hasConflicts(candidates, d("2025-10-20T00:00:00Z"), 1, {
      usesStartTimes: true,
      selectedStartTime: "07:00",
    });
    expect(conflict).toBe(true);
  });

  it("no conflict different start times on same day when using times", () => {
    const candidates: Candidate[] = [
      { date: d("2025-10-20T00:00:00Z"), days: 1, startTime: "07:00" },
    ];
    const conflict = hasConflicts(candidates, d("2025-10-20T00:00:00Z"), 1, {
      usesStartTimes: true,
      selectedStartTime: "13:00",
    });
    expect(conflict).toBe(false);
  });
});
