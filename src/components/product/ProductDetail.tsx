"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Product, Review } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";
import { ReviewSection } from "@/components/ui/ReviewSection";
import { useCart } from "@/context/CartContext";
import { easeLuxury } from "@/lib/motion";
import { cn } from "@/lib/utils";

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
      className="border-b border-white/[0.08] bg-black pb-[var(--section-y-lg)] pt-[var(--section-y)] md:pb-28 md:pt-12"
      {...motionProps}
    >
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
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/[0.09] bg-luxury-charcoal/40 shadow-[0_40px_100px_-48px_rgba(0,0,0,0.9)]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>

          <div className="flex flex-col gap-8 lg:pt-4">
            <div>
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
            </div>

            <p className="max-w-xl text-lg leading-relaxed text-luxury-muted md:text-xl">
              {product.description}
            </p>

            <div>
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
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
            </div>
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
