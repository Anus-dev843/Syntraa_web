"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createProductFromInput,
  type AdminProductInput,
} from "../../lib/admin-product-mapper";
import { CATEGORY_SLUGS } from "../../lib/constants";
import type { AdminStore } from "../../lib/types";

const emptyDraft: AdminProductInput = {
  name: "",
  price: 0,
  description: "",
  category: CATEGORY_SLUGS[0],
  image: "",
};

export function AdminAddProductForm() {
  const router = useRouter();
  const [draft, setDraft] = useState<AdminProductInput>(emptyDraft);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function setField<K extends keyof AdminProductInput>(
    key: K,
    value: AdminProductInput[K],
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const currentRes = await fetch("/api/admin/store");
      if (!currentRes.ok) {
        setError("Could not load current product store.");
        return;
      }
      const current = (await currentRes.json()) as AdminStore;
      const newProduct = createProductFromInput(draft);
      const nextStore: AdminStore = {
        ...current,
        products: [...current.products, newProduct],
      };
      const saveRes = await fetch("/api/admin/store", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextStore),
      });
      const data = (await saveRes.json().catch(() => ({}))) as { error?: string };
      if (!saveRes.ok) {
        setError(data.error ?? "Could not save product.");
        return;
      }
      router.replace("/admin/products");
    } catch {
      setError("Save failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-luxury-muted">
        Product management
      </p>
      <h2 className="mt-4 font-display text-4xl tracking-tight text-luxury-snow">
        Add product
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-luxury-muted">
        New products are written to the shared admin store and will appear on the
        storefront automatically.
      </p>

      <form className="mt-8 space-y-5" onSubmit={onSubmit}>
        <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-luxury-muted">
          Product name
          <input
            className="rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-luxury-snow"
            value={draft.name}
            onChange={(event) => setField("name", event.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-luxury-muted">
          Price
          <input
            type="number"
            min={0}
            step={1}
            className="rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-luxury-snow"
            value={draft.price}
            onChange={(event) => setField("price", Number(event.target.value))}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-luxury-muted">
          Description
          <textarea
            className="min-h-[160px] rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-sm leading-relaxed text-luxury-snow"
            value={draft.description}
            onChange={(event) => setField("description", event.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-luxury-muted">
          Category
          <select
            className="rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-sm capitalize text-luxury-snow"
            value={draft.category}
            onChange={(event) => setField("category", event.target.value)}
          >
            {CATEGORY_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {slug}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-luxury-muted">
          Image URL
          <input
            className="rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-luxury-snow"
            value={draft.image}
            onChange={(event) => setField("image", event.target.value)}
            required
          />
        </label>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-luxury-snow px-9 py-3 text-[11px] uppercase tracking-[0.32em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Saving..." : "Add Product"}
        </button>
      </form>
    </section>
  );
}
