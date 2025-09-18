import { type BookingReview } from "@/dummy/receipts";
import Stars from "./Stars";

function MeterRow({ label, value }: { label: string; value?: number | null }) {
  if (typeof value !== "number") {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-400">—</span>
      </div>
    );
  }
  return (
    <div className="text-sm">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-500">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-amber-400"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

function getFeedbackBreakdown(list: BookingReview[]) {
  const withFb = list.filter((r) => r.feedback);
  if (withFb.length === 0) return null;
  const sum = withFb.reduce(
    (acc, r) => {
      const f = r.feedback!;
      acc.overallExperience += f.overallExperience;
      acc.boatComfort += f.boatComfort;
      acc.gearCondition += f.gearCondition;
      acc.crewProfessionalism += f.crewProfessionalism;
      acc.safety += f.safety;
      return acc;
    },
    {
      overallExperience: 0,
      boatComfort: 0,
      gearCondition: 0,
      crewProfessionalism: 0,
      safety: 0,
    }
  );
  const n = withFb.length;
  return {
    count: n,
    overallExperience: Math.round(sum.overallExperience / n),
    boatComfort: Math.round(sum.boatComfort / n),
    gearCondition: Math.round(sum.gearCondition / n),
    crewProfessionalism: Math.round(sum.crewProfessionalism / n),
    safety: Math.round(sum.safety / n),
  };
}

export default function GuestFeedbackPanel({
  reviews,
  ratingAvg,
  ratingCount,
}: {
  reviews: BookingReview[];
  ratingAvg: number;
  ratingCount: number;
}) {
  const feedback = getFeedbackBreakdown(reviews);
  if (ratingCount === 0 || !feedback) return null;

  return (
    <section className="mt-8 rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold sm:text-lg">Guest feedback</h3>
          <p className="text-xs text-gray-500 sm:text-sm">
            Based on recent verified trips
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1">
            <Stars value={ratingAvg} />
            <span className="font-medium">{ratingAvg.toFixed(1)}</span>
          </span>
          <span className="text-gray-500">
            {ratingCount} review{ratingCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-4 col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="space-y-3">
            <MeterRow
              label="⭐ Overall experience"
              value={feedback.overallExperience}
            />
            <MeterRow label="🚤 Boat comfort" value={feedback.boatComfort} />
            <MeterRow
              label="🎣 Gear condition"
              value={feedback.gearCondition}
            />
            <MeterRow
              label="👨‍✈️ Crew professionalism"
              value={feedback.crewProfessionalism}
            />
            <MeterRow label="🛟 Safety" value={feedback.safety} />
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <h4 className="text-sm font-semibold">What anglers mention</h4>
          <ul className="mt-2 space-y-2 text-sm text-gray-700">
            <li>• Friendly, professional crew</li>
            <li>• Comfortable ride with good shade</li>
            <li>• Productive spots and flexible techniques</li>
          </ul>
          <p className="mt-3 text-xs text-gray-500">
            Highlights vary per charter; this is a general summary for similar
            trips.
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <h4 className="text-sm font-semibold">At a glance</h4>
          <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-black/5 bg-gray-50 p-3">
              <div className="text-xs text-gray-500">Avg. rating</div>
              <div className="text-base font-semibold">
                {ratingAvg.toFixed(1)} / 5
              </div>
            </div>
            <div className="rounded-lg border border-black/5 bg-gray-50 p-3">
              <div className="text-xs text-gray-500">Detailed reviews</div>
              <div className="text-base font-semibold">{feedback.count}</div>
            </div>
            <div className="col-span-2 rounded-lg border border-black/5 bg-gray-50 p-3">
              <div className="text-xs text-gray-500">Recent activity</div>
              <div className="text-sm">
                {reviews[0]?.createdAt
                  ? new Date(reviews[0].createdAt).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Averages from reviews that included detailed feedback. Overall star
        rating mixes detailed scores and star-only ratings.
      </p>
    </section>
  );
}
