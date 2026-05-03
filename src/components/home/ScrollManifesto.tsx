"use client";

import { motion, useReducedMotion } from "framer-motion";

const lines = [
  "Design that breathes before it speaks.",
  "Experience first. Noise removed.",
] as const;

export function ScrollManifesto() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-b border-white/10 bg-black" aria-label="Manifesto">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-28 lg:px-12">
        <p className="text-[0.62rem] uppercase tracking-[0.35em] text-luxury-muted">
          Manifesto
        </p>
        <div className="mt-8 space-y-5 md:space-y-6">
          {lines.map((line, index) => (
            <motion.p
              key={line}
              className="font-display text-4xl leading-[1.05] text-luxury-snow sm:text-5xl md:text-6xl lg:text-[4.7rem]"
              initial={reduceMotion ? undefined : { opacity: 0.24, y: 32 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 0.75,
                      ease: [0.16, 1, 0.3, 1],
                      delay: index * 0.08,
                    }
              }
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
