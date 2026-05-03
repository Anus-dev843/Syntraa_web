import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const pillars = [
  {
    title: "Formulation",
    body: "Actives balanced for sensorial glide and long-form stability.",
    href: "/products",
  },
  {
    title: "Finish",
    body: "Dry-down behavior tuned under daylight, humid, and low-temp tests.",
    href: "/story",
  },
  {
    title: "Packaging",
    body: "Micro-beveled silhouettes and tactile typography for quiet confidence.",
    href: "/products",
  },
  {
    title: "Ritual",
    body: "Layering flow that turns application into a slow, intentional sequence.",
    href: "/contact",
  },
] as const;

export function CraftPillars() {
  return (
    <section className="border-b border-white/10 bg-black" aria-label="Craft pillars">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-28 lg:px-12">
        <AnimatedSection className="max-w-3xl">
          <p className="text-[0.64rem] uppercase tracking-[0.35em] text-luxury-muted">
            Our craft
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.06] text-luxury-snow md:text-5xl lg:text-6xl">
            Built with intention. Finished with restraint.
          </h2>
        </AnimatedSection>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {pillars.map((pillar, index) => (
            <AnimatedSection
              key={pillar.title}
              delay={0.06 + index * 0.04}
              className="group rounded-3xl border border-white/12 bg-white/[0.02] p-7 transition hover:border-white/25 hover:bg-white/[0.04] md:p-8"
            >
              <h3 className="font-display text-3xl text-luxury-snow md:text-[2.1rem]">
                {pillar.title}
              </h3>
              <p className="mt-4 max-w-[32ch] text-sm leading-relaxed text-luxury-muted md:text-base">
                {pillar.body}
              </p>
              <Link
                href={pillar.href}
                className="mt-8 inline-flex text-[10px] uppercase tracking-[0.32em] text-luxury-muted transition group-hover:text-luxury-snow"
              >
                Explore
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
