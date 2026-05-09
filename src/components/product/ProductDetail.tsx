"use client";

import { CatalogImage } from "@/components/ui/CatalogImage";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import type { Product, Review } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";
import { ReviewSection } from "@/components/ui/ReviewSection";
import { useCart } from "@/context/CartContext";
import { easeLuxury } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

type ProductDetailProps = {
  product: Product;
  reviews: Review[];
  ratingSummary: { average: number; count: number };
};

export function ProductDetail({
  product,
  reviews,
  ratingSummary,
}: ProductDetailProps) {
  const reduceMotion = useReducedMotion();
  const { addItem, openCart } = useCart();
  const imageWrapRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: imageWrapRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [4, -4]);

  const gallery = useMemo(() => {
    const seen = new Set<string>();
    const items: string[] = [];
    if (product.image) {
      seen.add(product.image);
      items.push(product.image);
    }
    for (const u of product.images ?? []) {
      if (typeof u === "string" && u && !seen.has(u)) {
        seen.add(u);
        items.push(u);
      }
    }
    return items;
  }, [product.image, product.images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = gallery[activeIndex] ?? product.image;

  const hasReviews = ratingSummary.count > 0;
  const starsAverage = hasReviews
    ? ratingSummary.average
    : product.rating;
  const starsCount = hasReviews ? ratingSummary.count : 0;

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.72, ease: easeLuxury },
      };

  return (
    <motion.div
      className="relative overflow-hidden border-b border-white/[0.08] bg-black pb-[var(--section-y-lg)] pt-[var(--section-y)] md:pb-28 md:pt-12"
      {...motionProps}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_72%_100%_at_50%_0%,rgba(245,245,245,0.1),transparent_70%)]"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-[var(--gutter-x)]">
        <nav className="mb-10 text-[11px] uppercase tracking-[0.28em] text-luxury-muted">
          <Link href="/products" className="transition hover:text-luxury-snow">
            Shop
          </Link>
          <span className="mx-2 text-white/25">/</span>
          <Link
            href={`/category/${product.category}`}
            className="transition hover:text-luxury-snow"
          >
            {product.category}
          </Link>
          <span className="mx-2 text-white/25">/</span>
          <span className="text-luxury-snow/80">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div className="flex flex-col gap-4">
            <div
              ref={imageWrapRef}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/[0.09] bg-luxury-charcoal/40 shadow-[0_40px_100px_-48px_rgba(0,0,0,0.9)]"
            >
              <motion.div
                key={activeImage}
                className="absolute inset-0"
                style={{ y: imageY }}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: easeLuxury }}
              >
                <CatalogImage
                  src={activeImage}
                  alt={product.name}
                  fill
                  priority={activeIndex === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(245,245,245,0.12),transparent_76%)]"
                aria-hidden
              />
            </div>

            {gallery.length > 1 ? (
              <ul
                className="flex gap-3 overflow-x-auto pb-1"
                role="listbox"
                aria-label="Product gallery"
              >
                {gallery.map((src, idx) => {
                  const selected = idx === activeIndex;
                  return (
                    <li key={`${src}-${idx}`} className="shrink-0">
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        aria-label={`View image ${idx + 1} of ${gallery.length}`}
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                          "relative size-20 overflow-hidden rounded-xl border bg-luxury-charcoal/40 transition",
                          selected
                            ? "border-luxury-snow/80"
                            : "border-white/10 hover:border-white/30",
                        )}
                      >
                        <CatalogImage
                          src={src}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:pt-4">
            <AnimatedSection>
              <p className="text-[0.65rem] uppercase tracking-[0.36em] text-luxury-muted">
                The Syntraa · {product.currency}
              </p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-luxury-snow md:text-5xl lg:text-[3.25rem]">
                {product.name}
              </h1>
              <p className="mt-6 text-3xl font-light tabular-nums text-luxury-snow md:text-4xl">
                ${product.price}
              </p>
              <div className="mt-5">
                <StarRating
                  average={starsAverage}
                  count={starsCount}
                  size="md"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.04}>
              <p className="max-w-xl text-lg leading-relaxed text-luxury-muted md:text-xl">
                {product.description}
              </p>
            </AnimatedSection>

            <AnimatedSection
              delay={0.07}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-transparent to-black p-6 md:p-7"
            >
              <h2 className="text-[11px] uppercase tracking-[0.34em] text-luxury-muted">
                Formulation notes
              </h2>
              {product.ingredients.length ? (
                <ul className="mt-4 space-y-2.5 border-l border-white/15 pl-5">
                  {product.ingredients.map((line, i) => (
                    <li
                      key={`${i}-${line.slice(0, 24)}`}
                      className="text-sm leading-relaxed text-luxury-snow/90"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-luxury-muted">
                  Full INCI disclosure is being finalized for this lot.
                </p>
              )}
            </AnimatedSection>

            <AnimatedSection
              delay={0.09}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                className={cn(
                  "rounded-full bg-luxury-snow px-10 py-4 text-[11px] uppercase tracking-[0.32em] text-black transition",
                  "hover:bg-white active:scale-[0.99]",
                )}
                onClick={() => {
                  addItem({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1,
                  });
                  openCart();
                }}
              >
                Add to cart
              </button>
              <Link
                href="/products"
                className="rounded-full border border-white/18 px-8 py-3.5 text-center text-[11px] uppercase tracking-[0.28em] text-luxury-muted transition hover:border-white/35 hover:text-luxury-snow"
              >
                Continue shopping
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </div>

      <ReviewSection
        reviews={reviews}
        title="Ritual reviews"
        subtitle="Verified voices from the same choreography — slip, glide, and quiet finish."
        className="mt-20 border-b-0 md:mt-28"
      />
    </motion.div>
  );
}
