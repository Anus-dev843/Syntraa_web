"use client";

import React, {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import type { CustomPage } from "../../lib/types";

type PageFormProps = {
  mode: "create" | "edit";
  draft: CustomPage;
  onChange: Dispatch<SetStateAction<CustomPage>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
};

export function PageForm({
  mode,
  draft,
  onChange,
  onSubmit,
  onClear,
}: PageFormProps) {
  return (
    <>
      <p className="text-[11px] uppercase tracking-[0.34em] text-luxury-muted">
        {mode === "edit" ? "Edit page" : "New page"}
      </p>
      <form className="mt-10 space-y-6" onSubmit={onSubmit}>
        <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.35em] text-luxury-muted">
          Title
          <input
            className="rounded-2xl border border-white/12 bg-[#0a0a0a] px-4 py-3 text-sm text-luxury-snow placeholder:text-white/25"
            placeholder="House notes"
            value={draft.title}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.35em] text-luxury-muted">
          URL slug
          <input
            className="rounded-2xl border border-white/12 bg-[#0a0a0a] px-4 py-3 font-mono text-xs text-luxury-snow placeholder:text-white/25"
            placeholder="house-notes"
            value={draft.slug}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
              }))
            }
            required
          />
          <span className="text-[10px] font-normal normal-case tracking-normal text-luxury-muted/80">
            Public URL: /p/{draft.slug || "…"}
          </span>
        </label>

        <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.35em] text-luxury-muted">
          Body
          <textarea
            className="min-h-[200px] rounded-2xl border border-white/12 bg-[#0a0a0a] px-4 py-3 text-sm leading-relaxed text-luxury-snow placeholder:text-white/25"
            placeholder="Paragraphs separated by blank lines render as blocks."
            value={draft.content}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, content: e.target.value }))
            }
            required
          />
        </label>

        <div className="flex flex-wrap gap-4 pt-4">
          <button
            type="submit"
            className="rounded-full bg-luxury-snow px-8 py-3 text-[11px] uppercase tracking-[0.3em] text-black transition hover:bg-white"
          >
            Save page to JSON
          </button>
          <button
            type="button"
            className="rounded-full border border-white/15 px-8 py-[0.76rem] text-[11px] uppercase tracking-[0.28em] text-luxury-muted transition hover:border-white/35 hover:text-luxury-snow"
            onClick={onClear}
          >
            Clear form
          </button>
        </div>
      </form>
    </>
  );
}
