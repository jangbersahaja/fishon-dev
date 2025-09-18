import Link from "next/link";

type Crumb = { href?: string; label: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="inline">
            {c.href && !last ? (
              <Link href={c.href} className="hover:underline">
                {c.label}
              </Link>
            ) : (
              <span className={last ? "text-gray-900 font-medium" : ""}>
                {c.label}
              </span>
            )}
            {!last && <span className="mx-1">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
