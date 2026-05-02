import type { Metadata } from "next";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Story",
  description:
    "Quiet lineage rooted in monochrome craft, obsessive finish tests, and whispered rituals.",
};

export default function StoryPage() {
  return (
    <div className="border-b border-white/10 pb-28 pt-20 md:pb-36 md:pt-28">
      <div className="mx-auto flex max-w-3xl flex-col gap-24 px-6 md:gap-28 md:px-10 lg:px-12">
        <AnimatedSection className="space-y-6">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-luxury-muted">
            Lineage archive
          </p>
          <h1 className="font-display text-4xl tracking-tight text-luxury-snow md:text-6xl">
            The quiet becomes signal.
          </h1>
          <p className="text-xl leading-relaxed text-luxury-muted md:text-2xl">
            The Syntraa emerged from mirrored labs where acoustics dictate pace.
            We bottle only when glide, resonance, dry-down bloom, and slip speak
            the same tonal language across three climatic chambers.
          </p>
        </AnimatedSection>

        <AnimatedSection className="space-y-10 text-lg leading-relaxed text-luxury-muted">
          <p>
            Silence is mistaken for neutrality; for us it is contrast. Removing
            raw material noise frees each accord — niacinamide shimmers louder,
            peptides stretch longer, jasmine absolute unfurls softer.
          </p>
          <p>
            You will rarely see trend-led ingredient storms. Capsules assemble
            as wardrobe essentials: monochrome packaging, restrained scent
            footprints, ceremonial opening gestures.
          </p>
          <p>
            Stewardship persists after dispense — carbon-balanced packaging cloth,
            return pathways for emptied obsidian jars, transparent refund
            choreography when a formula simply does not align with your skin.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="rounded-3xl border border-white/12 bg-black/85 px-8 py-11 md:px-10">
            <p className="font-display text-3xl italic text-luxury-snow md:text-4xl">
              “Minimal only when fidelity remains absolute.”
            </p>
            <p className="mt-6 text-sm uppercase tracking-[0.34em] text-luxury-muted">
              Stewardship oath · archived batch 089
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <Link
            href="/products"
            className="inline-flex rounded-full border border-white/15 px-8 py-[0.8rem] text-[11px] uppercase tracking-[0.32em] text-luxury-snow transition hover:border-white/35"
          >
            Return to formulae capsule
          </Link>
        </AnimatedSection>
      </div>
    </div>
  );
}
