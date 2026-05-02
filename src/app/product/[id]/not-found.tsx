import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-lg px-[var(--gutter-x)] py-[var(--section-y-lg)] text-center">
      <p className="text-[0.65rem] uppercase tracking-[0.36em] text-luxury-muted">
        The Syntraa
      </p>
      <h1 className="mt-6 font-display text-4xl text-luxury-snow">
        This formula is not in the vault
      </h1>
      <p className="mt-4 text-luxury-muted">
        The product may have been archived or the link mistyped.
      </p>
      <Link
        href="/products"
        className="mt-10 inline-flex rounded-full border border-white/18 px-8 py-3 text-[11px] uppercase tracking-[0.28em] text-luxury-snow transition hover:border-white/35"
      >
        Back to shop
      </Link>
    </div>
  );
}
