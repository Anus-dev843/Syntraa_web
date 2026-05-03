"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartLineList } from "@/components/cart/CartLineList";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function CartPageClient() {
  const { lines, subtotal } = useCart();

  return (
    <div className="relative overflow-hidden border-b border-white/10">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(245,245,245,0.09),transparent_70%)]"
        aria-hidden
      />
      <div className="mx-auto max-w-2xl px-[var(--gutter-x)] py-[var(--section-y-lg)]">
        <AnimatedSection>
          <p className="text-[0.65rem] uppercase tracking-[0.36em] text-luxury-muted">
            The Syntraa
          </p>
          <h1 className="mt-4 font-display text-4xl tracking-tight text-luxury-snow md:text-5xl">
            Shopping bag
          </h1>
          <p className="mt-4 text-lg text-luxury-muted">
            Edit quantities or remove pieces. Your bag syncs across this device.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.06} className="mt-14">
          <CartLineList />
        </AnimatedSection>

        <AnimatedSection
          delay={0.09}
          className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.01] to-transparent px-8 py-8"
        >
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[0.28em] text-luxury-muted">
              Subtotal
            </span>
            <span className="font-display text-4xl tabular-nums text-luxury-snow">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            disabled={!lines.length}
            className="mt-8 w-full rounded-full bg-luxury-snow py-3.5 text-[11px] uppercase tracking-[0.32em] text-black transition enabled:hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
            onClick={() => {
              if (!lines.length) return;
              window.alert("Checkout opens soon — thank you for the ritual.");
            }}
          >
            Checkout
          </button>
          <Link
            href="/products"
            className="mt-5 block text-center text-[11px] uppercase tracking-[0.28em] text-luxury-muted transition hover:text-luxury-snow"
          >
            Continue shopping
          </Link>
        </AnimatedSection>
      </div>
    </div>
  );
}
