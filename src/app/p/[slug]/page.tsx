import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { readAdminStore } from "@/lib/admin-json";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { pages } = await readAdminStore();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { pages } = await readAdminStore();
  const page = pages.find((p) => p.slug === slug);
  if (!page) return { title: "Page" };
  return {
    title: page.title,
    description: page.content.slice(0, 155).replace(/\s+/g, " ").trim(),
  };
}

export default async function CustomPageView({ params }: PageProps) {
  const { slug } = await params;
  const { pages } = await readAdminStore();
  const page = pages.find((p) => p.slug === slug);
  if (!page) {
    notFound();
  }

  return (
    <div className="border-b border-white/[0.08] bg-black pb-[var(--section-y-lg)] pt-[var(--section-y)]">
      <article className="mx-auto max-w-3xl px-[var(--gutter-x)]">
        <p className="text-[0.65rem] uppercase tracking-[0.36em] text-luxury-muted">
          Editorial
        </p>
        <h1 className="mt-5 font-display text-4xl tracking-tight text-luxury-snow md:text-5xl">
          {page.title}
        </h1>
        <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-luxury-muted">
          Updated {page.updatedAt}
        </p>
        <div className="prose prose-invert mt-12 max-w-none text-base leading-[1.75] text-luxury-muted prose-p:mb-6 prose-p:mt-0 prose-headings:font-display prose-headings:tracking-tight prose-headings:text-luxury-snow">
          {page.content.split(/\n\n+/).map((block, i) => (
            <p key={i}>{block.trim()}</p>
          ))}
        </div>
        <Link
          href="/"
          className="mt-14 inline-flex text-[11px] uppercase tracking-[0.3em] text-luxury-muted transition-colors duration-300 hover:text-luxury-snow"
        >
          ← Back home
        </Link>
      </article>
    </div>
  );
}
