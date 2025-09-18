// components/ratings/StarRating.tsx
type Props = { value?: number; size?: number };

export default function StarRating({ value = 0, size = 20 }: Props) {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <svg
          key={`f-${i}`}
          width={size}
          height={size}
          fill="gold"
          viewBox="0 0 24 24"
        >
          <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.401 8.173L12 18.896l-7.335 3.85 1.401-8.173L.132 9.211l8.2-1.193z" />
        </svg>
      ))}
      {half === 1 && (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="gold" />
              <stop offset="50%" stopColor="lightgray" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half)"
            d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.401 8.173L12 18.896l-7.335 3.85 1.401-8.173L.132 9.211l8.2-1.193z"
          />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg
          key={`e-${i}`}
          width={size}
          height={size}
          fill="lightgray"
          viewBox="0 0 24 24"
        >
          <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.401 8.173L12 18.896l-7.335 3.85 1.401-8.173L.132 9.211l8.2-1.193z" />
        </svg>
      ))}
      <span className={`text-xs text-gray-500`}>{value.toFixed(1)} / 5</span>
    </div>
  );
}
