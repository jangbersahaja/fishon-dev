import CharterCard from "@/components/CharterCard";
import type { Charter } from "@/dummy/charter";
import Link from "next/link";

export default function ResultsGrid({ items }: { items: Charter[] }) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-gray-200 p-6 text-center">
        <h2 className="text-lg font-semibold">No results</h2>
        <p className="mt-1 text-sm text-gray-600">
          We couldn’t find any matches. Try another filter or{" "}
          <Link href="/book" className="text-[#ec2227] hover:underline">
            browse all
          </Link>
          .
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
      {items.map((c) => (
        <CharterCard key={c.id} charter={c} />
      ))}
    </div>
  );
}
