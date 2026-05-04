"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";

import type { Product } from "../../lib/types";

type AdminProductsManagerProps = {
  initialProducts: Product[];
};

export function AdminProductsManager({ initialProducts }: AdminProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products],
  );

  async function refreshList() {
    const res = await fetch("/api/products");
    if (!res.ok) return;
    const next = (await res.json()) as Product[];
    setProducts(next);
  }

  async function removeProduct(id: string) {
    if (!window.confirm("Delete this product?")) return;
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Delete failed.");
        return;
      }
      setStatus("Product removed.");
      await refreshList();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
        <p className="text-[11px] uppercase tracking-[0.3em] text-luxury-muted">
          Product management
        </p>
        <h2 className="mt-3 font-display text-3xl text-luxury-snow">Catalog</h2>
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
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/edit-product/${product.id}`}
                        className="rounded-full border border-white/15 px-4 py-1.5 text-[10px] uppercase tracking-[0.26em] text-luxury-muted transition hover:border-white/35 hover:text-luxury-snow"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={busyId === product.id}
                        onClick={() => removeProduct(product.id)}
                        className="rounded-full border border-rose-300/30 px-4 py-1.5 text-[10px] uppercase tracking-[0.26em] text-rose-300 transition hover:border-rose-200/60 hover:text-rose-200 disabled:opacity-50"
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
    </div>
  );
}
