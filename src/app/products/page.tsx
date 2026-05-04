import type { Metadata } from "next";
import { ProductsExplorer } from "@/components/products/ProductsExplorer";
import { getCatalogProducts } from "@/lib/catalog";
import { getAllReviews } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop formulae",
  description:
    "Curate luminous shampoos, serums, and body choreography with sculpted filters.",
};

export default async function ProductsPage() {
  const seedProducts = await getCatalogProducts();
  const reviews = getAllReviews();

  return (
    <div className="relative overflow-hidden border-b border-white/[0.08] pb-[var(--section-y-lg)] pt-[var(--section-y)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(245,245,245,0.08),transparent_70%)]"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-[var(--gutter-x)]">
        <ProductsExplorer seedProducts={seedProducts} allReviews={reviews} />
      </div>
    </div>
  );
}
