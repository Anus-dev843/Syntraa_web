"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { CartLineList } from "@/components/cart/CartLineList";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, closeCart, subtotal, lines } = useCart();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const transition = reduceMotion
    ? { duration: 0.01 }
    : { type: "tween" as const, duration: 0.42, ease: "easeOut" as const };

  return (
    <AnimatePresence>
      {isOpen ? (
        <div
          className="fixed inset-0 z-[70] flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping bag"
        >
          <motion.button
            type="button"
            aria-label="Close cart overlay"
            className="absolute inset-0 bg-black/55 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0.01 } : { duration: 0.28 }}
            onClick={closeCart}
          />
          <motion.aside
            className={cn(
              "relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#050505] shadow-[-32px_0_80px_rgba(0,0,0,0.75)]",
            )}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={transition}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.36em] text-luxury-muted">
                  The Syntraa
                </p>
                <h2 className="mt-1 font-display text-2xl tracking-tight text-luxury-snow">
                  Your bag
                </h2>
              </div>
              <button
                type="button"
                className="text-[11px] uppercase tracking-[0.3em] text-luxury-muted transition hover:text-luxury-snow"
                onClick={closeCart}
              >
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
              <CartLineList onNavigate={closeCart} />
            </div>

            <div className="shrink-0 border-t border-white/10 px-6 py-6">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[11px] uppercase tracking-[0.28em] text-luxury-muted">
                  Subtotal
                </span>
                <span className="font-display text-3xl tabular-nums text-luxury-snow">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="mt-2 text-xs text-luxury-muted/90">
                Shipping and duties calculated at checkout.
              </p>
              <button
                type="button"
                disabled={!lines.length}
                className="mt-6 w-full rounded-full bg-luxury-snow py-3.5 text-[11px] uppercase tracking-[0.32em] text-black transition enabled:hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
                onClick={() => {
                  if (!lines.length) return;
                  closeCart();
                  window.alert("Checkout opens soon — thank you for the ritual.");
                }}
              >
                Checkout
              </button>
              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-4 block text-center text-[11px] uppercase tracking-[0.28em] text-luxury-muted transition hover:text-luxury-snow"
              >
                View full bag
              </Link>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
