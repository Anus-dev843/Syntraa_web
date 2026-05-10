"use client";

import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { MotionStagger } from "@/components/ui/MotionStagger";
import Link from "next/link";
import { useMemo } from "react";
import { getAllReviews, getAverageRating } from "@/lib/products";

type CategoryProductGridProps = {
  slug: string;
  seedProducts: Product[];
};

export function CategoryProductGrid({ slug, seedProducts }: CategoryProductGridProps) {
  const filtered = seedProducts.filter((product) => product.category === slug);
  const allReviews = useMemo(() => getAllReviews(), []);

  return (
    <div className="space-y-12 md:space-y-16">
      {filtered.length ? (
        <MotionStagger
          key={filtered.map((p) => p.id).join("-")}
          className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10"
        >
          {filtered.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index % 12}
              stagger
              rating={getAverageRating(product.id, allReviews)}
            />
          ))}
        </MotionStagger>
      ) : (
        <div className="rounded-3xl border border-white/14 px-8 py-16 text-center text-sm text-luxury-muted md:px-12">
          Nothing is listed in this category yet. Browse the full{" "}
          <Link
            href="/products"
            className="text-luxury-snow underline-offset-8 hover:underline"
          >
            shop
          </Link>{" "}
          or check back soon.
        </div>
      )}
    </div>
  );
}
