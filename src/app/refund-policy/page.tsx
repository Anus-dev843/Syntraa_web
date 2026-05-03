import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund policy",
  description:
    "Ceremonial return windows, condition notes, and support paths for The Syntraa.",
};

export default function RefundPolicyPage() {
  return (
    <div className="relative overflow-hidden border-b border-white/10 pb-28 pt-20 md:pb-32 md:pt-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(245,245,245,0.08),transparent_70%)]"
        aria-hidden
      />
      <div className="mx-auto max-w-3xl space-y-10 px-6 text-sm leading-relaxed text-luxury-muted md:text-base md:px-10 lg:px-12">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-luxury-snow">
            Refund choreography
          </p>
          <h1 className="mt-4 font-display text-4xl tracking-tight text-luxury-snow md:text-5xl">
            Refund Policy
          </h1>
        </div>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-luxury-snow md:text-2xl">
            45-day luminous trial
          </h2>
          <p>
            Unopened artefacts may return within forty-five nights of outbound
            scan for a full ceremonial refund excluding tracked freight. Notify
            concierge with order glyph and rationale — we orchestrate pickups
            where regionally courteous.
          </p>
          <p>
            Gently commenced jars require photographic chronicle and residue
            description. Stewardship reviewers assess slip variance; partial
            store credit may illuminate when tactile metrics diverge mildly from
            published orchestration notes.
          </p>
          <p>
            Micro-lots bearing batch engravings supersede storefront imagery —
            tonal variance under sunlight is artistry, never defect unless
            microbial thresholds breach assay logs.
          </p>
          <p>
            Ritual bundles refund as unified capsule — individual flacons inside
            unsealed triptychs defer to discretionary review.
          </p>
          <p>
            Contact concierge@thesyntraa.example for orchestration IDs. Typical
            review cadence resolves within nine business sunrises across major
            meridians.
          </p>
        </section>
      </div>
    </div>
  );
}
