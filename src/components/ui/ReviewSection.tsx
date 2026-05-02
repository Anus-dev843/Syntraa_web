"use client";

import type { Review } from "@/lib/types";
import { AnimatedSection } from "./AnimatedSection";
import { MotionStagger } from "./MotionStagger";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { staggerItem } from "@/lib/motion";

type ReviewSectionProps = {
  reviews: Review[];
  title?: string;
  subtitle?: string;
  className?: string;
};

export function ReviewSection({
  reviews,
  title = "Voices",
  subtitle = "What our community restores with rituals from The Syntraa.",
  className,
}: ReviewSectionProps) {
  const sorted = [...reviews].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section
      className={cn(
        "border-y border-white/10 bg-black py-[var(--section-y)] md:py-[var(--section-y-lg)]",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-[var(--gutter-x)]">
        <AnimatedSection className="max-w-2xl">
          <p className="text-[0.65rem] uppercase tracking-[0.36em] text-luxury-muted">
            Voices
          </p>
          <h2 className="mt-5 font-display text-4xl tracking-tight text-luxury-snow md:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-luxury-muted md:text-xl">
            {subtitle}
          </p>
        </AnimatedSection>

        <MotionStagger
          variant="testimonial"
          className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-9"
        >
          {sorted.map((r) => (
            <motion.div
              key={r.id}
              variants={staggerItem}
              className="group flex h-full flex-col rounded-2xl border border-white/[0.09] bg-luxury-charcoal/50 p-6 transition-[border-color,box-shadow] duration-500 hover:border-white/16 hover:shadow-[0_24px_56px_-40px_rgba(0,0,0,0.85)] md:p-7"
            >
              <StarRating
                average={r.rating}
                size="sm"
                showNumeric={false}
                className="gap-1.5"
              />
              <h3 className="mt-4 font-display text-2xl tracking-tight text-luxury-snow">
                {r.title}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-luxury-muted">
                “{r.body}”
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4 text-[11px] uppercase tracking-[0.26em] text-luxury-muted">
                <span>{r.author}</span>
                <time dateTime={r.date}>{r.date}</time>
              </div>
            </motion.div>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
