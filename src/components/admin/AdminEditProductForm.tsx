"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  CATEGORY_LABELS,
  CATEGORY_SLUGS,
  type CategorySlug,
} from "../../lib/constants";
import type { Product } from "../../lib/types";

const MAX_EXTRA_IMAGES = 7;

type Props = {
  product: Product;
  mongoConfigured: boolean;
  cloudConfigured: boolean;
};

async function uploadToCloudinary(file: File): Promise<{
  url?: string;
  error?: string;
}> {
  const fd = new FormData();
  fd.set("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    credentials: "include",
    body: fd,
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    secure_url?: string;
  };
  if (!res.ok) return { error: data.error ?? "Image upload failed." };
  return { url: data.secure_url };
}

export function AdminEditProductForm({ product, mongoConfigured, cloudConfigured }: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState({
    name: product.name,
    price: product.price,
    description: product.description,
    category: product.category,
    image: product.image,
    images: Array.isArray(product.images) ? product.images : [],
    featured: product.featured,
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [coverBusy, setCoverBusy] = useState(false);
  const [extrasBusy, setExtrasBusy] = useState(false);

  function setField<K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadCover(file: File) {
    setCoverBusy(true);
    setError(null);
    try {
      const r = await uploadToCloudinary(file);
      if (r.error) {
        setError(r.error);
        return;
      }
      if (r.url) setField("image", r.url);
    } finally {
      setCoverBusy(false);
    }
  }

  async function uploadExtras(files: File[]) {
    if (!files.length) return;
    setExtrasBusy(true);
    setError(null);
    try {
      const remaining = MAX_EXTRA_IMAGES - draft.images.length;
      if (remaining <= 0) {
        setError(`Maximum ${MAX_EXTRA_IMAGES} extra images already added.`);
        return;
      }
      const queue = files.slice(0, remaining);
      const next: string[] = [];
      for (const f of queue) {
        const r = await uploadToCloudinary(f);
        if (r.error) {
          setError(r.error);
          break;
        }
        if (r.url) next.push(r.url);
      }
      if (next.length) {
        setDraft((prev) => ({
          ...prev,
          images: [...prev.images, ...next].slice(0, MAX_EXTRA_IMAGES),
        }));
      }
      if (files.length > queue.length) {
        setError(
          `Only first ${queue.length} extra image(s) uploaded — limit is ${MAX_EXTRA_IMAGES}.`,
        );
      }
    } finally {
      setExtrasBusy(false);
    }
  }

  function removeExtra(index: number) {
    setDraft((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          price: draft.price,
          description: draft.description,
          category: draft.category,
          image: draft.image,
          images: draft.images,
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

  const anyBusy = busy || coverBusy || extrasBusy;

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-luxury-muted">
        Product management
      </p>
      <h2 className="mt-4 font-display text-4xl tracking-tight text-luxury-snow">
        Edit product
      </h2>

      {!mongoConfigured ? (
        <div
          className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-500/[0.08] px-5 py-4 text-sm text-amber-50/95"
          role="alert"
        >
          <p className="font-medium text-amber-100">MongoDB is not configured.</p>
          <p className="mt-2 text-amber-50/90">
            Set <code className="font-mono text-xs">MONGODB_URI</code> on Render and redeploy — saving changes will fail
            until the database connects.
          </p>
        </div>
      ) : null}

      {!cloudConfigured ? (
        <div
          className="mt-6 rounded-2xl border border-rose-500/35 bg-rose-500/[0.07] px-5 py-4 text-sm text-rose-50/95"
          role="alert"
        >
          <p className="font-medium text-rose-100">Cloudinary is not configured.</p>
          <p className="mt-2 text-rose-50/90">
            Image uploads are disabled; paste <code className="font-mono text-xs">https://</code> URLs or fix{" "}
            <code className="font-mono text-xs">CLOUDINARY_*</code> on Render.
          </p>
        </div>
      ) : null}

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
                {CATEGORY_LABELS[slug]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-luxury-muted">
          Replace cover image
          <input
            type="file"
            accept="image/*"
            disabled={coverBusy || !cloudConfigured}
            className="text-sm text-luxury-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-[11px] file:uppercase file:tracking-[0.2em] file:text-luxury-snow"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadCover(file);
              event.currentTarget.value = "";
            }}
          />
        </label>

        <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-luxury-muted">
          Cover image URL (https)
          <input
            className="rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-luxury-snow"
            value={draft.image}
            onChange={(event) => setField("image", event.target.value)}
            required
          />
        </label>

        <fieldset className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-5">
          <legend className="px-2 text-[11px] uppercase tracking-[0.3em] text-luxury-muted">
            Additional images ({draft.images.length}/{MAX_EXTRA_IMAGES})
          </legend>
          <p className="text-xs text-luxury-muted">
            Upload more angles / shots. Cover image is shown first on the
            product page.
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={
              extrasBusy || draft.images.length >= MAX_EXTRA_IMAGES || !cloudConfigured
            }
            className="text-sm text-luxury-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-[11px] file:uppercase file:tracking-[0.2em] file:text-luxury-snow"
            onChange={(event) => {
              const list = Array.from(event.target.files ?? []);
              if (list.length) void uploadExtras(list);
              event.currentTarget.value = "";
            }}
          />
          {draft.images.length ? (
            <ul className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {draft.images.map((src, idx) => (
                <li
                  key={`${src}-${idx}`}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Extra ${idx + 1}`}
                    className="size-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExtra(idx)}
                    aria-label="Remove image"
                    className="absolute right-1.5 top-1.5 rounded-full bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-luxury-snow opacity-0 transition group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </fieldset>

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
            disabled={anyBusy || !mongoConfigured}
            className="rounded-full bg-luxury-snow px-9 py-3 text-[11px] uppercase tracking-[0.32em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy
              ? "Saving..."
              : coverBusy
                ? "Uploading cover..."
                : extrasBusy
                  ? "Uploading extras..."
                  : "Save changes"}
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
