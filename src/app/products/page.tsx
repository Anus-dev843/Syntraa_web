import type { Metadata } from "next";
import { ProductsExplorer } from "@/components/products/ProductsExplorer";
import { getCatalogProducts } from "@/lib/catalog";
import { getAllReviews } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop formulae",
  description:
    "Curate luminous shampoos, serums, and body choreography with sculpted filters.",
};

export default async function ProductsPage() {
  const seedProducts = await getCatalogProducts();
  const reviews = getAllReviews();

  return (
    <div className="border-b border-white/[0.08] pb-[var(--section-y-lg)] pt-[var(--section-y)]">
      <div className="mx-auto max-w-6xl px-[var(--gutter-x)]">
        <ProductsExplorer seedProducts={seedProducts} allReviews={reviews} />
      </div>
    </div>
  );
}
