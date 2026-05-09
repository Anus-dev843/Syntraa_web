"use client";

import React from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const fadeEase = [0.22, 1, 0.36, 1] as const;
const heroLines = ["THE SYNTRAA"] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: fadeEase },
  },
};

export function Hero() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, { stiffness: 110, damping: 22, mass: 0.55 });
  const smoothY = useSpring(pointerY, { stiffness: 110, damping: 22, mass: 0.55 });
  const glowX = useTransform(smoothX, [-1, 1], [-22, 22]);
  const glowY = useTransform(smoothY, [-1, 1], [-18, 18]);
  const inverseGlowX = useTransform(glowX, (value) => value * -0.65);
  const inverseGlowY = useTransform(glowY, (value) => value * -0.65);

  function scrollToStory() {
    document.getElementById("collections")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  function onHeroPointerMove(event: React.PointerEvent<HTMLElement>) {
    if (reduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    pointerX.set((x - 0.5) * 2);
    pointerY.set((y - 0.5) * 2);
  }

  function onHeroPointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section
      className="relative flex min-h-[calc(100svh-5.25rem)] flex-col items-center justify-center overflow-hidden border-b border-white/10 bg-black px-4 sm:px-6 md:min-h-[calc(100svh-4.25rem)]"
      aria-label="Hero"
      onPointerMove={onHeroPointerMove}
      onPointerLeave={onHeroPointerLeave}
    >
      {!reduceMotion ? (
        <>
          <motion.div
            className="pointer-events-none absolute left-[-14%] top-[8%] h-44 w-44 rounded-full bg-white/12 blur-3xl sm:h-56 sm:w-56"
            style={{ x: glowX, y: glowY }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute bottom-[12%] right-[-10%] h-56 w-56 rounded-full bg-white/8 blur-3xl sm:h-72 sm:w-72"
            style={{ x: inverseGlowX, y: inverseGlowY }}
            aria-hidden
          />
        </>
      ) : null}

      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,245,245,0.1),transparent_55%)]"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: fadeEase }}
        />
      )}

      <div className="relative z-[1] flex w-full max-w-4xl flex-col items-center text-center">
        {reduceMotion ? (
          <div className="w-full space-y-7 sm:space-y-8">
            <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-[0.01em] text-white sm:text-5xl md:text-7xl lg:text-8xl">
              THE SYNTRAA
            </h1>
            <p className="mx-auto max-w-[30ch] text-base font-light tracking-[0.16em] text-white/85 sm:text-lg sm:tracking-[0.2em] md:text-xl md:tracking-[0.28em]">
              LUXURY IN EVERY LAYER
            </p>
            <Link
              href="/products"
              className="pressable inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-4 text-[11px] font-medium uppercase tracking-[0.32em] text-black transition-colors duration-300 hover:bg-luxury-snow sm:w-auto sm:px-12"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <motion.div
            className="flex w-full flex-col items-center gap-7 sm:gap-8 md:gap-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-2 sm:space-y-3">
              {heroLines.map((line) => (
                <motion.h1
                  key={line}
                  variants={itemVariants}
                  className="font-display text-4xl font-medium leading-[1.02] tracking-[0.01em] text-white sm:text-5xl md:text-7xl lg:text-[5.25rem]"
                >
                  {line}
                </motion.h1>
              ))}
            </div>

            <motion.p
              variants={itemVariants}
              className="max-w-[30ch] text-sm font-light leading-relaxed tracking-[0.14em] text-white/88 sm:max-w-xl sm:text-base sm:tracking-[0.2em] md:text-lg md:tracking-[0.28em]"
            >
              LUXURY IN EVERY LAYER
            </motion.p>

            <motion.div variants={itemVariants} className="w-full sm:w-auto">
              <Link
                href="/products"
                className="pressable inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-4 text-[11px] font-medium uppercase tracking-[0.32em] text-black shadow-[0_0_0_1px_rgba(255,255,255,0.12)] transition-[colors,box-shadow] duration-300 hover:bg-luxury-snow hover:shadow-[0_12px_40px_-12px_rgba(255,255,255,0.35)] sm:w-auto sm:px-12"
              >
                Shop Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-8 md:pb-10">
        {reduceMotion ? (
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/40">
            Scroll
          </span>
        ) : (
          <motion.button
            type="button"
            onClick={scrollToStory}
            className="pointer-events-auto flex cursor-pointer flex-col items-center gap-2 border-0 bg-transparent text-white/55 outline-none transition hover:text-white/90 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Scroll to collections"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.9, ease: fadeEase }}
          >
            <span className="text-[10px] uppercase tracking-[0.38em]">
              Scroll
            </span>
            <motion.span
              className="flex h-11 w-7 items-start justify-center rounded-full border border-white/25 pt-2"
              aria-hidden
            >
              <motion.span
                className="block h-2 w-2 rounded-full bg-white/80"
                animate={{ y: [0, 14, 0], opacity: [1, 0.35, 1] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: [0.45, 0, 0.55, 1],
                }}
              />
            </motion.span>
            <motion.span
              className="mt-1 text-lg leading-none text-white/50"
              aria-hidden
              animate={{ y: [0, 6, 0], opacity: [0.45, 1, 0.45] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ⌄
            </motion.span>
          </motion.button>
        )}
      </div>
    </section>
  );
}
