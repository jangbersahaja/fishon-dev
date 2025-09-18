// src/app/charters/view/page.tsx
import Link from "next/link";
export default function ViewIndex() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Charters</h1>
      <p className="mt-2">Try a sample charter:</p>
      <Link href="/charters/view/1001" className="text-red-600 underline">
        View charter #1001
      </Link>
    </main>
  );
}
