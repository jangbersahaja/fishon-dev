import type { MediaPreview } from "../types";

type MediaGridProps = {
  items: MediaPreview[];
  emptyLabel: string;
  onRemove: (index: number) => void;
};

export function MediaGrid({ items, emptyLabel, onRemove }: MediaGridProps) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 px-4 py-10 text-center text-sm text-slate-500">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={`${item.url}-${index}`}
          className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
        >
          <div
            className="h-36 bg-cover bg-center"
            style={{ backgroundImage: `url(${item.url})` }}
          />
          <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-600">
            <span className="truncate" title={item.name}>
              {item.name}
            </span>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
