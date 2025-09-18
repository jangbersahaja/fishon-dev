import {
  computeStarRatingFromFeedback,
  type BookingReview,
} from "@/dummy/receipts";
import Stars from "./Stars";

function formatDate(iso: string): string {
  try {
    const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function ReviewsList({ reviews }: { reviews: BookingReview[] }) {
  if (!reviews?.length) return null;
  return (
    <section className="mt-6">
      <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
        <h3 className="text-base font-semibold sm:text-lg">Anglers’ reviews</h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-4">
          {reviews.slice(0, 10).map((r) => {
            const score = r.feedback
              ? computeStarRatingFromFeedback(r.feedback)
              : r.rating;
            return (
              <article
                key={r.id}
                className="break-inside-avoid rounded-xl border border-black/10 bg-white/70 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                      {r.reviewerInitials ||
                        r.reviewerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {r.reviewerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(r.createdAt)} · {r.tripName}
                      </div>
                    </div>
                  </div>
                  <Stars value={score} />
                </div>
                {r.review && (
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {r.review}
                  </p>
                )}
              </article>
            );
          })}
        </div>
        {reviews.length > 10 && (
          <div className="mt-4 text-center">
            <button
              className="text-sm font-semibold text-[#ec2227] underline"
              disabled
            >
              View more (dummy)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
