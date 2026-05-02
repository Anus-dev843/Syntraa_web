import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach The Syntraa concierge for orders, rituals, and wholesale.",
};

export default function ContactPage() {
  return (
    <div className="border-b border-white/10 pb-28 pt-20 md:pb-36 md:pt-28">
      <div className="mx-auto max-w-3xl px-6 md:px-10 lg:px-12">
        <AnimatedSection>
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-luxury-muted">
            Concierge
          </p>
          <h1 className="mt-5 font-display text-4xl text-luxury-snow md:text-5xl">
            Contact
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-luxury-muted md:text-xl">
            For order notes, ritual guidance, or studio visits — write in measured
            sentences. We reply within a few sunrises.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.08} className="mt-14 space-y-10">
          <div className="rounded-2xl border border-white/10 bg-luxury-charcoal/40 p-8 md:p-10">
            <p className="text-[11px] uppercase tracking-[0.32em] text-luxury-muted">
              Direct line
            </p>
            <a
              href="mailto:concierge@thesyntraa.example"
              className="mt-4 block font-display text-2xl text-luxury-snow transition hover:text-white md:text-3xl"
            >
              concierge@thesyntraa.example
            </a>
            <p className="mt-6 text-sm leading-relaxed text-luxury-muted">
              Include your region and preferred contact window. Wholesale and press
              inquiries are welcome with portfolio or line sheet links.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex rounded-full border border-white/15 px-8 py-3 text-[11px] uppercase tracking-[0.3em] text-luxury-snow transition hover:border-white/35"
          >
            Browse products
          </Link>
        </AnimatedSection>
      </div>
    </div>
  );
}
