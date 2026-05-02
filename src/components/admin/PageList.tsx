"use client";

import React from "react";
import type { CustomPage } from "../../lib/types";

type PageListProps = {
  items: CustomPage[];
  onEdit: (page: CustomPage) => void;
  onRemove: (id: string) => void;
};

export function PageList({ items, onEdit, onRemove }: PageListProps) {
  const sorted = [...items].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.34em] text-luxury-muted">
          Pages
        </p>
        <span className="text-xs text-luxury-muted">{sorted.length} live</span>
      </div>
      <ul className="mt-8 space-y-3">
        {sorted.map((page) => (
          <li
            key={page.id}
            className="flex items-center gap-4 rounded-2xl border border-white/[0.06] px-4 py-3 text-sm transition hover:border-white/14"
          >
            <button
              type="button"
              className="flex-1 text-left"
              onClick={() => onEdit(page)}
            >
              <span className="block font-display text-lg text-luxury-snow">
                {page.title}
              </span>
              <span className="text-[11px] uppercase tracking-[0.22em] text-luxury-muted">
                /p/{page.slug}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onRemove(page.id)}
              className="text-[11px] uppercase tracking-[0.28em] text-rose-300/90 transition hover:text-rose-200"
              aria-label={`Delete ${page.title}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
