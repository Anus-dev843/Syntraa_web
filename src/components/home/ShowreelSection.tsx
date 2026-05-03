"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SHOWREEL_URL =
  process.env.NEXT_PUBLIC_SHOWREEL_URL ??
  "https://player.vimeo.com/video/76979871?h=8272103f6e&title=0&byline=0&portrait=0";

export function ShowreelSection() {
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [isOpen]);

  return (
    <section className="relative border-b border-white/10 bg-black" aria-label="Showreel">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-28 lg:px-12">
        <div className="grid items-end gap-12 md:grid-cols-[1fr_auto] md:gap-16">
          <div>
            <p className="text-[0.64rem] uppercase tracking-[0.35em] text-luxury-muted">
              Syntraa showreel
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[1.03] text-luxury-snow md:text-6xl lg:text-[4.4rem]">
              Crafted moments, made to be felt.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-luxury-muted md:text-base">
              A living cut of our visual language: texture closeups, directional light,
              and movement tuned to breathe instead of shout.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-8 py-3 text-[11px] uppercase tracking-[0.32em] text-luxury-snow transition hover:border-white/45 hover:bg-white/8 md:w-auto"
          >
            Watch showreel
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative mt-10 flex h-[clamp(14rem,40vw,26rem)] w-full items-end overflow-hidden rounded-[2rem] border border-white/12 bg-gradient-to-br from-white/[0.12] via-white/[0.03] to-transparent p-6 text-left md:p-8"
          aria-label="Open Syntraa showreel"
        >
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_24%_28%,rgba(245,245,245,0.28),transparent_42%),radial-gradient(circle_at_78%_75%,rgba(245,245,245,0.1),transparent_46%)]"
            animate={reduceMotion ? undefined : { scale: [1, 1.03, 1] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 8.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
            }
            aria-hidden
          />
          <div className="relative">
            <span className="text-[0.62rem] uppercase tracking-[0.34em] text-luxury-muted">
              Motion cut 2026
            </span>
            <p className="mt-3 font-display text-2xl text-luxury-snow md:text-4xl">
              Watch
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.27em] text-luxury-muted transition group-hover:text-luxury-snow/85">
              open video lightbox
            </p>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Syntraa showreel video"
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
              aria-label="Close showreel modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduceMotion ? { duration: 0.01 } : { duration: 0.22 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              ref={panelRef}
              className="relative z-[1] flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_20px_100px_rgba(0,0,0,0.7)]"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
              transition={reduceMotion ? { duration: 0.01 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                <p className="text-[0.62rem] uppercase tracking-[0.33em] text-luxury-muted">
                  Syntraa showreel
                </p>
                <button
                  type="button"
                  className="text-[11px] uppercase tracking-[0.3em] text-luxury-muted transition hover:text-luxury-snow"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={SHOWREEL_URL}
                  title="Syntraa showreel"
                  className="h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
