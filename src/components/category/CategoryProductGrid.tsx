"use client";

import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { MotionStagger } from "@/components/ui/MotionStagger";
import Link from "next/link";
import type { CategoryMeta } from "@/lib/types";
import { useMemo } from "react";
import { getAllReviews, getAverageRating } from "@/lib/products";

type CategoryProductGridProps = {
  slug: string;
  seedProducts: Product[];
  category: CategoryMeta;
};

export function CategoryProductGrid({
  slug,
  seedProducts,
  category,
}: CategoryProductGridProps) {
  const filtered = seedProducts.filter((product) => product.category === slug);
  const allReviews = useMemo(() => getAllReviews(), []);

  return (
    <div className="space-y-20 md:space-y-24">
      <AnimatedSection className="max-w-xl">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-luxury-muted">
          {category.title}
        </p>
        <h1 className="mt-5 font-display text-4xl text-luxury-snow md:text-[3.6rem]">
          {category.description}
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-luxury-muted md:text-xl">
          {category.subtitle}. Every lot is batched in micro-runs to protect
          glide, slip, and luminous dry-down.
        </p>
        <div className="mt-7 flex flex-wrap gap-2.5">
          <span className="rounded-full border border-white/14 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-luxury-muted">
            curated
          </span>
          <span className="rounded-full border border-white/14 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-luxury-muted">
            small batches
          </span>
          <span className="rounded-full border border-white/14 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-luxury-muted">
            ritual-ready
          </span>
        </div>
      </AnimatedSection>

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
