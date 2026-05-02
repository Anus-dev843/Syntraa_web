import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function StorySection() {
  return (
    <section className="border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-24 px-6 py-28 md:px-10 lg:px-12">
        <div className="grid gap-14 md:grid-cols-[1fr_1.1fr] md:gap-24">
          <AnimatedSection className="md:sticky md:top-[7.25rem] md:self-start">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-luxury-muted">
              Lineage I
            </p>
            <h2 className="mt-5 font-display text-4xl text-luxury-snow md:text-5xl lg:text-[3.65rem]">
              Silence is finishing.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-luxury-muted md:text-lg">
              Minimalism for us isn’t austerity — it is signal clarity. Fewer raw
              materials, sharper ratios, obsessive stability testing beneath arctic,
              temperate, humid simulations.
            </p>
          </AnimatedSection>

          <div className="space-y-10">
            <AnimatedSection
              delay={0.08}
              className="rounded-3xl border border-white/12 bg-gradient-to-br from-white/[0.05] via-transparent to-black p-px"
            >
              <div className="rounded-[calc(1.5rem-1px)] bg-black/90 px-8 py-10 md:px-10 md:py-11">
                <p className="text-[11px] uppercase tracking-[0.32em] text-luxury-snow">
                  Material truth
                </p>
                <p className="mt-8 text-xl leading-snug text-luxury-muted">
                  Matte obsidian jars with micro-beveled shoulders. Labels set in
                  hairline serif so typography feels whispered rather than etched.
                  We ship with cotton dust bags — ceremonial, understated.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.12} className="max-w-xl">
              <div className="h-px w-16 bg-luxury-snow/60" aria-hidden />
              <p className="mt-8 text-xl font-display italic text-luxury-snow/90 md:text-2xl">
                “Every batch is bottled only when tactile slip, dry-down bloom,
                and oxidative curve align across three testers.”
              </p>
              <p className="mt-6 text-[11px] uppercase tracking-[0.32em] text-luxury-muted">
                In-house stewardship · batch 074
              </p>
            </AnimatedSection>

            <AnimatedSection
              delay={0.09}
              className="rounded-3xl border border-white/[0.06] px-9 py-10 md:px-12 md:py-12"
            >
              <div className="grid gap-8 md:grid-cols-[1.05fr_auto] md:gap-14">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-luxury-muted">
                    Lineage II
                  </p>
                  <p className="mt-8 text-xl leading-snug text-luxury-muted">
                    Our perfumists and dermatological chemists iterate in mirrored
                    rooms — daylight on one axis, ultraviolet on another. Friction
                    is logged: comb slip, razor glide, finger absorbency.
                  </p>
                </div>
                <div className="flex flex-col justify-between border-l border-white/10 pl-0 md:max-w-[12rem] md:border-l md:pl-12">
                  <span className="font-display text-5xl text-luxury-snow">∞</span>
                  <span className="mt-12 text-[10px] uppercase tracking-[0.35em] text-luxury-muted">
                    Renewal promise
                  </span>
                  <span className="mt-6 text-[10px] leading-relaxed text-luxury-muted">
                    Transparent exchanges within 45 days · See refund policy for
                    ceremonial returns.
                  </span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
