"use client";

import { CatalogImage } from "@/components/ui/CatalogImage";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { motion, useReducedMotion } from "framer-motion";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";
import { easeLuxury, staggerItem } from "@/lib/motion";

type ProductCardProps = {
  product: Product;
  index?: number;
  /** Aggregate rating from reviews; omit on pages that do not load reviews. */
  rating?: { average: number; count: number };
  /** When true, animate via parent `MotionStagger` (staggered fade-up). */
  stagger?: boolean;
};

export function ProductCard({
  product,
  index = 0,
  rating,
  stagger = false,
}: ProductCardProps) {
  const reduceMotion = useReducedMotion();
  const hasRating = rating && rating.count > 0;

  const inner = (
    <>
      <Link
        href={`/product/${product.id}`}
        aria-label={`View ${product.name}`}
        className="absolute inset-0 z-10 rounded-2xl"
      />
      <span
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      >
        <span className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(245,245,245,0.1),transparent_75%)]" />
      </span>
      <div className="pointer-events-none relative aspect-[4/5] overflow-hidden">
        <CatalogImage
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className={cn(
            "object-cover transition-transform duration-[720ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
            "group-hover:scale-[1.06] motion-reduce:group-hover:scale-100",
          )}
        />
        <span className="absolute left-4 top-4 rounded-full border border-white/12 bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-luxury-snow/95 backdrop-blur-md transition-colors duration-300 group-hover:border-white/22">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3.5 p-6 md:gap-4 md:p-7">
        <div className="space-y-2.5">
          <h3 className="font-display text-xl tracking-tight text-luxury-snow md:text-2xl">
            {product.name}
          </h3>
          {rating != null ? (
            hasRating ? (
              <StarRating
                average={rating.average}
                count={rating.count}
                size="sm"
                className="pt-0.5"
              />
            ) : (
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/28">
                No ratings yet
              </p>
            )
          ) : null}
          <p className="line-clamp-2 text-[0.9375rem] leading-relaxed text-luxury-muted">
            {product.shortDescription}
          </p>
        </div>
        <div className="mt-auto flex items-end justify-between border-t border-white/[0.08] pt-4">
          <p className="text-sm font-medium tracking-tight text-luxury-snow">
            ${product.price}
            <span className="ml-2 text-[10px] font-normal uppercase tracking-[0.22em] text-luxury-muted">
              {product.currency}
            </span>
          </p>
          <span className="text-[10px] uppercase tracking-[0.26em] text-luxury-muted transition duration-300 group-hover:translate-x-0.5 group-hover:text-luxury-snow">
            View +
          </span>
        </div>
      </div>
    </>
  );

  const shellClass = cn(
    "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-b from-white/[0.03] via-luxury-charcoal/70 to-luxury-charcoal/60",
    "shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]",
    "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "hover:-translate-y-1.5 hover:border-white/18 hover:shadow-[0_32px_72px_-36px_rgba(0,0,0,0.92)]",
    "motion-reduce:transition-colors motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none",
    "active:scale-[0.992] motion-reduce:active:scale-100",
  );

  if (reduceMotion) {
    return (
      <article id={product.slug} className={shellClass}>
        {inner}
      </article>
    );
  }

  if (stagger) {
    return (
      <motion.article
        id={product.slug}
        variants={staggerItem}
        className={shellClass}
      >
        {inner}
      </motion.article>
    );
  }

  return (
    <motion.article
      id={product.slug}
      className={shellClass}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -14% 0px", amount: 0.1 }}
      transition={{
        duration: 0.68,
        ease: easeLuxury,
        delay: Math.min(index, 10) * 0.055,
      }}
    >
      {inner}
    </motion.article>
  );
}
