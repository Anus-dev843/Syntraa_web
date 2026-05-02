import Link from "next/link";

import type { AdminStore } from "../../lib/types";

type AdminDashboardHomeProps = {
  store: AdminStore;
};

export function AdminDashboardHome({ store }: AdminDashboardHomeProps) {
  const cards = [
    {
      label: "Products",
      value: store.products.length,
      href: "/admin/products",
    },
    {
      label: "Pages",
      value: store.pages.length,
      href: "/admin/pages",
    },
    {
      label: "Featured",
      value: store.products.filter((p) => p.featured).length,
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
          Manage products, publish editorial pages, and keep the storefront
          synchronized from one secure dashboard.
        </p>
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
