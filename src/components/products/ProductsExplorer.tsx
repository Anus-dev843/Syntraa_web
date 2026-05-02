"use client";

import React, { useMemo, useState } from "react";
import type { Product, Review } from "../../lib/types";
import { getAverageRating } from "../../lib/products";
import { AnimatedSection } from "../ui/AnimatedSection";
import { MotionStagger } from "../ui/MotionStagger";
import { ProductCard } from "../ui/ProductCard";
import { ReviewSection } from "../ui/ReviewSection";
import { FilterBar } from "./FilterBar";

export type SortMode = "price-asc" | "price-desc" | "name";

type ProductsExplorerProps = {
  seedProducts: Product[];
  allReviews: Review[];
};

export function ProductsExplorer({
  seedProducts,
  allReviews,
}: ProductsExplorerProps) {
  const products = seedProducts;
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortMode>("price-asc");

  const filtered = useMemo(() => {
    const next =
      category === "all"
        ? products
        : products.filter((product) => product.category === category);
    const copy = [...next];
    if (sort === "price-asc") {
      copy.sort((a, b) => a.price - b.price);
    }
    if (sort === "price-desc") {
      copy.sort((a, b) => b.price - a.price);
    }
    if (sort === "name") {
      copy.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      );
    }
    return copy;
  }, [products, category, sort]);

  const filteredReviews = useMemo(() => {
    const ids = new Set(products.map((product) => product.id));
    return allReviews.filter((review) => ids.has(review.productId));
  }, [allReviews, products]);

  return (
    <div className="space-y-20 md:space-y-24">
      <AnimatedSection className="max-w-xl">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-luxury-muted">
          Shop
        </p>
        <h1 className="mt-5 font-display text-4xl text-luxury-snow md:text-5xl">
          Artifacts distilled for luminous routine.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-luxury-muted md:text-xl">
          Filter by intention. Each object is keyed to choreography — slip,
          glide, resonance. Reviews echo from rituals already underway.
        </p>
      </AnimatedSection>

      <FilterBar
        category={category}
        onCategoryChange={(value) => setCategory(value)}
        sort={sort}
        onSortChange={setSort}
        resultCount={filtered.length}
      />

      <MotionStagger
        key={`${category}-${sort}-${filtered.map((p) => p.id).join(",")}`}
        className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-10"
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

      {filtered.length === 0 ? (
        <p className="rounded-3xl border border-white/15 px-10 py-16 text-center text-sm text-luxury-muted">
          No formulae reside in this filter yet — revisit another category chord.
        </p>
      ) : null}

      <ReviewSection
        reviews={filteredReviews.length ? filteredReviews : allReviews}
        title="Rituals in review"
        subtitle="Collected notes from devotees pairing serums after midnight flights and shampoos after ocean swims."
      />
    </div>
  );
}
