"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { CategoryMeta } from "@/lib/types";
import { cn } from "@/lib/utils";
import { easeLuxury, staggerItem } from "@/lib/motion";

type CategoryCardProps = {
  category: CategoryMeta;
  index?: number;
  stagger?: boolean;
};

function displayTitle(category: CategoryMeta): string {
  if (category.slug === "facewash") return "Facewash";
  return category.title;
}

export function CategoryCard({
  category,
  index = 0,
  stagger = false,
}: CategoryCardProps) {
  const reduceMotion = useReducedMotion();
  const href = `/category/${category.slug}`;
  const title = displayTitle(category);

  const wrapperClass =
    "group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-[#050505] shadow-[0_0_0_1px_rgba(255,255,255,0.035)_inset] transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-white/18 hover:shadow-[0_28px_80px_-36px_rgba(0,0,0,0.88)] motion-reduce:hover:translate-y-0 active:scale-[0.992] motion-reduce:active:scale-100";

  const placeholder = (
    <div className="relative aspect-[3/4] overflow-hidden bg-[#030303] sm:aspect-[4/5]">
      <div
        className={cn(
          "absolute inset-0 origin-center bg-gradient-to-br from-[#0c0c0c] via-[#050505] to-[#111]",
          "transition-transform duration-[760ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
          "group-hover:scale-[1.06] motion-reduce:group-hover:scale-100",
        )}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 15%, rgba(245,245,245,0.11) 0%, transparent 42%),
            radial-gradient(circle at 80% 70%, rgba(245,245,245,0.055) 0%, transparent 38%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.11]"
        style={{
          backgroundImage:
            "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.035) 45%, transparent 78%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.028) 2px, rgba(255,255,255,0.028) 3px)",
        }}
      />
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[clamp(4.5rem,18vw,7rem)] font-medium leading-none tracking-tight text-white/[0.042]"
        aria-hidden
      >
        {title.slice(0, 1)}
      </span>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/80 to-transparent" />
    </div>
  );

  const body = (
    <>
      {placeholder}
      <div className="relative border-t border-white/[0.055] bg-black/92 px-5 py-5 md:px-7 md:py-6">
        <p className="mb-1.5 text-[0.6rem] uppercase tracking-[0.38em] text-luxury-muted">
          {category.subtitle}
        </p>
        <h3 className="font-display text-2xl tracking-tight text-luxury-snow md:text-[1.65rem]">
          {title}
        </h3>
        <p className="mt-2.5 line-clamp-2 text-[0.9375rem] leading-relaxed text-luxury-muted">
          {category.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-luxury-snow/90 transition duration-300 group-hover:gap-3">
          Explore
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </>
  );

  if (reduceMotion) {
    return (
      <Link href={href} className={cn(wrapperClass)}>
        {body}
      </Link>
    );
  }

  if (stagger) {
    return (
      <motion.div variants={staggerItem} className="h-full">
        <Link href={href} className={cn(wrapperClass, "block h-full")}>
          {body}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px", amount: 0.1 }}
      transition={{
        duration: 0.72,
        ease: easeLuxury,
        delay: Math.min(index, 8) * 0.065,
      }}
    >
      <Link href={href} className={cn(wrapperClass)}>
        {body}
      </Link>
    </motion.div>
  );
}
