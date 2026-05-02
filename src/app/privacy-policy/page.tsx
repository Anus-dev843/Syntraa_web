import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How The Syntraa receives, shields, and disposes of your ritual data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="border-b border-white/10 pb-28 pt-20 md:pb-32 md:pt-28">
      <div className="mx-auto max-w-3xl space-y-12 px-6 text-sm leading-relaxed text-luxury-muted md:text-base md:px-10 lg:px-12">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-luxury-snow">
            Stewardship veil
          </p>
          <h1 className="mt-4 font-display text-4xl tracking-tight text-luxury-snow md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-lg text-luxury-snow">
            Updated {new Date().getFullYear()}. Mirrors our promise: gather
            sparingly, secure obsessively.
          </p>
        </div>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-luxury-snow md:text-2xl">
            What arrives in our ledger
          </h2>
          <p>
            Contact glyphs, ceremonial shipping coordinates, concierge threads,
            and transaction chronology when you procure objects from this site —
            analogue to digital — are encrypted in vaults adhering to SOC-minded
            practice even as we remain artisan-scale.
          </p>
          <p>
            Browsing incense (cookies imbued lightly) gauges silhouette interest
            to refine monochrome layouts — never traded to scent houses abroad.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-luxury-snow md:text-2xl">
            Use &amp; luminous sharing
          </h2>
          <p>
            Data powers fulfillment, choreography of replacements, handwritten
            thankings when batch codes align poetically with your constellation.
          </p>
          <p>
            Payment sigils route through audited processors — we never stockpile
            full card hymns on-premises.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-luxury-snow md:text-2xl">
            Retention dusk
          </h2>
          <p>
            Commerce records persist for requisite tax moons unless law commands
            longer shadows. Narrative concierge threads trim after serenity
            unless you tether them for warranty songlines.
          </p>
          <p>
            Request summaries, corrections, removals where jurisdiction breathes —
            concierge@thesyntraa.example whispers replies within luminous week
            windows.
          </p>
        </section>
      </div>
    </div>
  );
}
