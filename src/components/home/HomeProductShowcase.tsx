"use client";

import React, { useMemo } from "react";
import Link from "next/link";

import type { Product } from "@/lib/types";
import { getAllReviews, getAverageRating } from "@/lib/products";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { MotionStagger } from "@/components/ui/MotionStagger";
import { ProductCard } from "@/components/ui/ProductCard";

type HomeProductShowcaseProps = {
  products: Product[];
};

export function HomeProductShowcase({ products }: HomeProductShowcaseProps) {
  const allReviews = useMemo(() => getAllReviews(), []);

  const ratingByProductId = useMemo(() => {
    const map = new Map<string, { average: number; count: number }>();
    for (const product of products) {
      map.set(product.id, getAverageRating(product.id, allReviews));
    }
    return map;
  }, [products, allReviews]);

  if (!products.length) {
    return (
      <section className="border-y border-white/[0.08] bg-[#050505] py-[var(--section-y-lg)]">
        <div className="mx-auto max-w-6xl px-[var(--gutter-x)]">
          <AnimatedSection>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-luxury-muted">
              Catalog
            </p>
            <h2 className="mt-5 font-display text-4xl text-luxury-snow md:text-5xl">
              Formulae arrive soon.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-luxury-muted">
              Connect MongoDB and seed products from the admin suite to populate the
              storefront.
            </p>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section
      id="shop-all"
      className="border-y border-white/[0.08] bg-[linear-gradient(180deg,#050505_0%,#080808_50%,#050505_100%)] py-[var(--section-y-lg)]"
    >
      <div className="mx-auto max-w-6xl px-[var(--gutter-x)]">
        <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
          <AnimatedSection className="max-w-xl">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-luxury-muted">
              Full assortment
            </p>
            <h2 className="mt-5 font-display text-4xl text-luxury-snow md:text-[3.25rem]">
              Every Syntraa object, one quiet grid.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-luxury-muted md:text-xl">
              Pulled live from MongoDB — tap through for detail, ritual copy, and cart.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.06}>
            <Link
              href="/products"
              className="pressable inline-flex rounded-full border border-white/14 px-8 py-[0.85rem] text-[11px] uppercase tracking-[0.34em] text-luxury-snow transition duration-300 hover:border-white/32 hover:bg-white/[0.06]"
            >
              Open shop view
            </Link>
          </AnimatedSection>
        </div>

        <MotionStagger className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:mt-20 lg:gap-9">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              stagger
              rating={
                ratingByProductId.get(product.id) ?? { average: 0, count: 0 }
              }
            />
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
