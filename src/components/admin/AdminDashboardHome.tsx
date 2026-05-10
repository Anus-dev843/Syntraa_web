import Link from "next/link";

import { AdminImportSeedProducts } from "./AdminImportSeedProducts";

type AdminDashboardHomeProps = {
  pageCount: number;
  productTotal: number;
  featuredTotal: number;
  mongoConfigured: boolean;
};

export function AdminDashboardHome({
  pageCount,
  productTotal,
  featuredTotal,
  mongoConfigured,
}: AdminDashboardHomeProps) {
  const cards = [
    {
      label: "Products",
      value: productTotal,
      href: "/admin/products",
    },
    {
      label: "Pages",
      value: pageCount,
      href: "/admin/pages",
    },
    {
      label: "Featured",
      value: featuredTotal,
      href: "/admin/products",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_32px_72px_-50px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-luxury-muted">
          The Syntraa
        </p>
        <h2 className="mt-4 font-display text-4xl tracking-tight text-luxury-snow">
          Welcome back to your command center.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-luxury-muted">
          Manage products (MongoDB + Cloudinary), publish editorial pages, and keep the
          storefront synchronized from one secure dashboard.
        </p>
        {productTotal === 0 ? (
          <div className="mt-6 space-y-1 rounded-2xl border border-amber-500/35 bg-amber-500/[0.07] px-5 py-4 text-sm leading-relaxed text-amber-100/95">
            <p>
              <span className="font-medium text-amber-50">MongoDB catalogue is empty.</span> The
              storefront still shows the demo list from{" "}
              <code className="rounded-md bg-black/40 px-1.5 py-0.5 font-mono text-xs text-luxury-snow">
                data/products.js
              </code>{" "}
              and <span className="font-mono text-xs text-luxury-snow">/mockups/</span> until Atlas
              has products.
            </p>
            <p className="text-amber-100/80">
              Use the button below to copy that seed file into MongoDB (replaces any existing
              products), or add SKUs manually under Products.
            </p>
            <AdminImportSeedProducts mongoConfigured={mongoConfigured} />
          </div>
        ) : null}
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-2xl border border-white/10 bg-black/35 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]"
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-luxury-muted">
              {card.label}
            </p>
            <p className="mt-4 font-display text-5xl tracking-tight text-luxury-snow">
              {card.value}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.24em] text-luxury-muted transition group-hover:text-luxury-snow">
              Open section
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
