// utils/ratings.ts
// Build an avg rating map from receipts once, reused across pages.
import { receipts } from "@/dummy/receipts";

export type RatingMap = Record<number, { avg: number; count: number }>;

let _cache: RatingMap | null = null;

export function getRatingMap(): RatingMap {
  if (_cache) return _cache;
  const map: RatingMap = {};
  (receipts as any[]).forEach((r: any) => {
    const id = Number(r.charterId);
    if (!map[id]) map[id] = { avg: 0, count: 0 };
    map[id].avg += Number(r.rating || 0);
    map[id].count += 1;
  });
  Object.keys(map).forEach((k) => {
    const v = map[Number(k)];
    map[Number(k)] = {
      avg: v.count ? Math.round((v.avg / v.count) * 10) / 10 : 0,
      count: v.count,
    };
  });
  _cache = map;
  return map;
}
