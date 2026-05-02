"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";

import {
  createProductFromInput,
  type AdminProductInput,
} from "../../lib/admin-product-mapper";
import { CATEGORY_SLUGS } from "../../lib/constants";
import type { AdminStore, Product } from "../../lib/types";

type AdminProductsManagerProps = {
  initialProducts: Product[];
};

function draftFromProduct(product: Product): AdminProductInput {
  return {
    name: product.name,
    price: product.price,
    description: product.description,
    category: product.category,
    image: product.image,
  };
}

function emptyDraft(): AdminProductInput {
  return {
    name: "",
    price: 0,
    description: "",
    category: CATEGORY_SLUGS[0],
    image: "",
  };
}

export function AdminProductsManager({ initialProducts }: AdminProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editorProduct, setEditorProduct] = useState<Product | null>(null);
  const [editorDraft, setEditorDraft] = useState<AdminProductInput>(emptyDraft());
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products],
  );

  function setDraftField<K extends keyof AdminProductInput>(
    key: K,
    value: AdminProductInput[K],
  ) {
    setEditorDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function fetchStore(): Promise<AdminStore | null> {
    const res = await fetch("/api/admin/store");
    if (!res.ok) return null;
    return (await res.json()) as AdminStore;
  }

  async function persistProducts(nextProducts: Product[]): Promise<boolean> {
    setBusy(true);
    setError(null);
    try {
      const current = await fetchStore();
      if (!current) {
        setError("Could not load current store.");
        return false;
      }
      const nextStore: AdminStore = { ...current, products: nextProducts };
      const res = await fetch("/api/admin/store", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextStore),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Save failed.");
        return false;
      }
      setProducts(nextProducts);
      setStatus("Products updated.");
      return true;
    } finally {
      setBusy(false);
    }
  }

  function startEdit(product: Product) {
    setEditorProduct(product);
    setEditorDraft(draftFromProduct(product));
  }

  function closeEdit() {
    setEditorProduct(null);
    setEditorDraft(emptyDraft());
  }

  async function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editorProduct) return;
    const next = createProductFromInput(editorDraft, editorProduct.id);
    const nextProducts = products.map((product) =>
      product.id === editorProduct.id
        ? { ...next, featured: product.featured, ingredients: product.ingredients, rating: product.rating }
        : product,
    );
    const ok = await persistProducts(nextProducts);
    if (ok) closeEdit();
  }

  async function removeProduct(id: string) {
    if (!window.confirm("Delete this product?")) return;
    const nextProducts = products.filter((product) => product.id !== id);
    await persistProducts(nextProducts);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
        <p className="text-[11px] uppercase tracking-[0.3em] text-luxury-muted">
          Product management
        </p>
        <h2 className="mt-3 font-display text-3xl text-luxury-snow">
          Catalog table
        </h2>
        {status ? <p className="mt-3 text-sm text-emerald-300">{status}</p> : null}
        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-black/35">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                {["Image", "Name", "Price", "Category", "Actions"].map((head) => (
                  <th
                    key={head}
                    className="px-5 py-4 text-left text-[11px] uppercase tracking-[0.3em] text-luxury-muted"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-white/10 transition hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-white/10">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-luxury-snow">{product.name}</td>
                  <td className="px-5 py-4 text-sm text-luxury-snow">${product.price}</td>
                  <td className="px-5 py-4 text-sm capitalize text-luxury-muted">
                    {product.category}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="rounded-full border border-white/15 px-4 py-1.5 text-[10px] uppercase tracking-[0.26em] text-luxury-muted transition hover:border-white/35 hover:text-luxury-snow"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="rounded-full border border-rose-300/30 px-4 py-1.5 text-[10px] uppercase tracking-[0.26em] text-rose-300 transition hover:border-rose-200/60 hover:text-rose-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editorProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-white/12 bg-[#080808] p-7 shadow-[0_40px_120px_-50px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-3xl text-luxury-snow">Edit product</h3>
              <button
                type="button"
                onClick={closeEdit}
                className="text-[11px] uppercase tracking-[0.28em] text-luxury-muted"
              >
                Close
              </button>
            </div>
            <form className="mt-6 grid gap-4" onSubmit={saveEdit}>
              <input
                className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-luxury-snow"
                placeholder="Product name"
                value={editorDraft.name}
                onChange={(event) => setDraftField("name", event.target.value)}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  min={0}
                  step={1}
                  className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-luxury-snow"
                  placeholder="Price"
                  value={editorDraft.price}
                  onChange={(event) => setDraftField("price", Number(event.target.value))}
                  required
                />
                <select
                  className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm capitalize text-luxury-snow"
                  value={editorDraft.category}
                  onChange={(event) => setDraftField("category", event.target.value)}
                >
                  {CATEGORY_SLUGS.map((slug) => (
                    <option key={slug} value={slug}>
                      {slug}
                    </option>
                  ))}
                </select>
              </div>
              <input
                className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-luxury-snow"
                placeholder="Image URL"
                value={editorDraft.image}
                onChange={(event) => setDraftField("image", event.target.value)}
                required
              />
              <textarea
                className="min-h-[140px] rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-luxury-snow"
                placeholder="Description"
                value={editorDraft.description}
                onChange={(event) => setDraftField("description", event.target.value)}
                required
              />
              <button
                type="submit"
                disabled={busy}
                className="mt-2 rounded-full bg-luxury-snow px-8 py-3 text-[11px] uppercase tracking-[0.3em] text-black transition hover:bg-white disabled:opacity-50"
              >
                {busy ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
