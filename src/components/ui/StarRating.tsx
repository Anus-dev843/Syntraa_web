import { cn } from "@/lib/utils";

type StarRatingProps = {
  average: number;
  count?: number;
  size?: "sm" | "md";
  /** When false, only the star row is shown (e.g. single-review cards). */
  showNumeric?: boolean;
  className?: string;
};

export function StarRating({
  average,
  count,
  size = "md",
  showNumeric = true,
  className,
}: StarRatingProps) {
  const full = Math.min(5, Math.max(0, Math.round(average)));
  const label =
    count && count > 0
      ? `Rated ${average.toFixed(1)} out of 5 stars, ${count} reviews`
      : `Rated ${average.toFixed(1)} out of 5 stars`;

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      role="img"
      aria-label={label}
    >
      <span
        className={cn(
          "inline-flex gap-0.5",
          size === "sm" ? "text-[0.85rem] leading-none" : "text-base leading-none",
        )}
        aria-hidden
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={cn(n <= full ? "text-luxury-snow" : "text-white/20")}
          >
            ★
          </span>
        ))}
      </span>
      {showNumeric ? (
        <span
          className={cn(
            "tabular-nums text-luxury-muted",
            size === "sm" ? "text-[11px]" : "text-xs",
          )}
        >
          {average.toFixed(1)}
          {count != null && count > 0 ? (
            <span className="text-luxury-muted/80"> · {count}</span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}
