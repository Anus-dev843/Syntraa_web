"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import type { Product } from "../../lib/types";
import {
  getAllReviews,
  getAverageRating,
  getReviewsForProducts,
} from "../../lib/products";
import { AnimatedSection } from "../ui/AnimatedSection";
import { MotionStagger } from "../ui/MotionStagger";
import { ProductCard } from "../ui/ProductCard";
import { ReviewSection } from "../ui/ReviewSection";

type FeaturedProductsProps = {
  seed: Product[];
};

export function FeaturedProducts({ seed }: FeaturedProductsProps) {
  const capsule = useMemo(() => {
    const withImage = (p: Product) => Boolean(p.image);
    const flagged = seed.filter((item) => item.featured).filter(withImage);
    if (flagged.length) {
      return flagged.slice(0, 8);
    }
    /** No featured SKUs yet — surface recent catalog picks so deploys aren’t visually empty after first imports. */
    return seed.filter(withImage).slice(0, 8);
  }, [seed]);

  const allReviews = useMemo(() => getAllReviews(), []);

  const ratingByProductId = useMemo(() => {
    const map = new Map<string, { average: number; count: number }>();
    for (const product of capsule) {
      map.set(product.id, getAverageRating(product.id, allReviews));
    }
    return map;
  }, [capsule, allReviews]);

  const testimonialReviews = useMemo(() => {
    const ids = capsule.map((p) => p.id);
    const subset = getReviewsForProducts(ids);
    return subset.length ? subset : allReviews;
  }, [capsule, allReviews]);

  return (
    <div id="featured" className="border-y border-white/[0.08] bg-black">
      <div className="mx-auto max-w-6xl px-[var(--gutter-x)] py-[var(--section-y-lg)]">
        <div className="flex flex-col items-start gap-14 md:flex-row md:items-end md:justify-between md:gap-16">
          <AnimatedSection className="max-w-xl">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-luxury-muted">
              Signature formulae
            </p>
            <h2 className="mt-6 font-display text-4xl text-luxury-snow md:text-[3.65rem]">
              Quiet objects for everyday ceremony.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-luxury-muted md:text-xl">
              Each piece carries image, name, price, and the echo of verified
              ratings. Scroll into voices from the same capsule below.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <Link
              href="/products"
              className="pressable rounded-full border border-white/14 px-8 py-[0.85rem] text-[11px] uppercase tracking-[0.34em] text-luxury-snow transition duration-300 hover:border-white/32 hover:bg-white/[0.06]"
            >
              View full catalog
            </Link>
          </AnimatedSection>
        </div>

        {capsule.length ? (
          <MotionStagger className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-9 xl:gap-10 md:mt-20">
            {capsule.slice(0, 8).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                stagger
                rating={
                  ratingByProductId.get(product.id) ?? {
                    average: 0,
                    count: 0,
                  }
                }
              />
            ))}
          </MotionStagger>
        ) : (
          <div className="mt-14 rounded-3xl border border-white/14 px-8 py-12 text-center text-sm text-luxury-muted md:mt-16">
            <p>No pieces in the rotation yet — the grid fills as soon as essentials are stocked.</p>
            <p className="mx-auto mt-5 max-w-md text-[11px] leading-relaxed text-luxury-muted/80 md:text-xs">
              Operator: add products via admin / Atlas — or leave fallback on (default) to load demos from{" "}
              <span className="font-mono text-luxury-snow">data/products.js</span>. To force an empty vitrine
              with Mongo wired, set{" "}
              <span className="font-mono text-luxury-snow">SYNTRAA_CATALOG_FALLBACK=false</span>. Health:{" "}
              <span className="font-mono text-luxury-snow">/api/health?mongo=1</span>.
            </p>
          </div>
        )}
      </div>

      <ReviewSection
        reviews={testimonialReviews}
        title="Testimonials"
        subtitle="Notes from rituals already underway — serums after red-eye flights, oils before candlelight."
        className="border-b-0 border-t border-white/10 py-20 md:py-28"
      />
    </div>
  );
}
