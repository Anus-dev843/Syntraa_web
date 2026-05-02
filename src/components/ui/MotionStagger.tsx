"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  staggerContainer,
  staggerContainerCategory,
  staggerContainerTestimonial,
} from "@/lib/motion";

const containers = {
  default: staggerContainer,
  category: staggerContainerCategory,
  testimonial: staggerContainerTestimonial,
} as const;

type MotionStaggerProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger rhythm: products grid, category grid, or testimonials. */
  variant?: keyof typeof containers;
};

export function MotionStagger({
  children,
  className,
  variant = "default",
}: MotionStaggerProps) {
  const reduceMotion = useReducedMotion();
  const variants = containers[variant];

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px", amount: 0.08 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
