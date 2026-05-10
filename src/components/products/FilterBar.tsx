"use client";

import type { SortMode } from "./ProductsExplorer";
import { CATEGORY_LABELS, CATEGORY_SLUGS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type FilterBarProps = {
  category: "all" | string;
  onCategoryChange: (value: string) => void;
  sort: SortMode;
  onSortChange: (value: SortMode) => void;
  resultCount: number;
};

export function FilterBar({
  category,
  onCategoryChange,
  sort,
  onSortChange,
  resultCount,
}: FilterBarProps) {
  const categories = CATEGORY_SLUGS.map((slug) => ({
    slug,
    label: CATEGORY_LABELS[slug],
  }));

  return (
    <div className="relative sticky top-[4.85rem] z-30 flex flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-black/82 px-5 py-6 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:px-10">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_60%_90%_at_50%_0%,rgba(245,245,245,0.08),transparent_72%)]"
        aria-hidden
      />
      <div>
        <p className="text-[10px] uppercase tracking-[0.35em] text-luxury-muted">
          Curate capsule
        </p>
        <p className="mt-4 text-xl font-display text-luxury-snow md:text-2xl">
          {resultCount === 1
            ? "One luminous match"
            : `${resultCount} formations`}
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Filter by category</legend>
          {[
            { id: "all", label: "All" },
            ...categories.map((c) => ({ id: c.slug, label: c.label })),
          ].map((item) => {
            const selected = category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onCategoryChange(item.id)}
                className={cn(
                  "rounded-full border px-4 py-[0.42rem] text-[10px] uppercase tracking-[0.26em] transition-[color,border-color,background-color,transform] duration-300 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-luxury-snow",
                  selected
                    ? "border-transparent bg-luxury-snow text-black"
                    : "border-white/15 text-luxury-muted hover:-translate-y-0.5 hover:border-white/30 hover:text-luxury-snow",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </fieldset>

        <label className="flex flex-col gap-3 text-[10px] uppercase tracking-[0.32em] text-luxury-muted md:gap-4">
          Ordering
          <select
            className="w-full rounded-2xl border border-white/12 bg-transparent px-4 py-3 text-[11px] tracking-[0.18em] text-luxury-snow md:w-56 md:rounded-full"
            value={sort}
            onChange={(event) =>
              onSortChange(event.target.value as SortMode)
            }
          >
            <option className="bg-black text-luxury-snow" value="price-asc">
              Price ascending
            </option>
            <option className="bg-black text-luxury-snow" value="price-desc">
              Price descending
            </option>
            <option className="bg-black text-luxury-snow" value="name">
              Name alphabetical
            </option>
          </select>
        </label>
      </div>
    </div>
  );
}
