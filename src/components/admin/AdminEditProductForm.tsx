"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { CATEGORY_SLUGS, type CategorySlug } from "../../lib/constants";
import type { Product } from "../../lib/types";

type Props = {
  product: Product;
};

export function AdminEditProductForm({ product }: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState({
    name: product.name,
    price: product.price,
    description: product.description,
    category: product.category,
    image: product.image,
    featured: product.featured,
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);

  function setField<K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadFile(file: File) {
    setUploadBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        secure_url?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Image upload failed.");
        return;
      }
      if (data.secure_url) {
        setField("image", data.secure_url);
      }
    } finally {
      setUploadBusy(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          price: draft.price,
          description: draft.description,
          category: draft.category,
          image: draft.image,
          featured: draft.featured,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not update product.");
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
        Edit product
      </h2>

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
          Price (USD)
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
            onChange={(event) =>
              setField("category", event.target.value as CategorySlug)
            }
          >
            {CATEGORY_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {slug}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-luxury-muted">
          Replace image
          <input
            type="file"
            accept="image/*"
            disabled={uploadBusy}
            className="text-sm text-luxury-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-[11px] file:uppercase file:tracking-[0.2em] file:text-luxury-snow"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadFile(file);
            }}
          />
        </label>

        <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-luxury-muted">
          Image URL (https)
          <input
            className="rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-luxury-snow"
            value={draft.image}
            onChange={(event) => setField("image", event.target.value)}
            required
          />
        </label>

        <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.26em] text-luxury-muted">
          <input
            type="checkbox"
            checked={draft.featured}
            onChange={(event) => setField("featured", event.target.checked)}
            className="size-4 rounded border-white/30 bg-black/50"
          />
          Featured on homepage
        </label>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy || uploadBusy}
            className="rounded-full bg-luxury-snow px-9 py-3 text-[11px] uppercase tracking-[0.32em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Saving..." : uploadBusy ? "Uploading..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-white/20 px-9 py-3 text-[11px] uppercase tracking-[0.32em] text-luxury-muted transition hover:border-white/40 hover:text-luxury-snow"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
