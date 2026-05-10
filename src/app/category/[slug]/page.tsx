import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

import { CategoryProductGrid } from "@/components/category/CategoryProductGrid";

import { getCatalogProducts, getCategoryMetas } from "@/lib/catalog";
import { isValidCategorySlug } from "@/lib/products";

import { CATEGORY_SLUGS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ slug }));
}

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isValidCategorySlug(slug)) {
    return { title: "Collection" };
  }
  const category = getCategoryMetas().find((item) => item.slug === slug);
  const title =
    category?.title ??
    slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title,
    description: `${title} choreography by The Syntraa.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  if (!isValidCategorySlug(slug)) {
    notFound();
  }

  const category = getCategoryMetas().find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const seedProducts = await getCatalogProducts();

  return (
    <div className="relative overflow-hidden border-b border-white/10 pb-28 pt-24 md:pb-32 md:pt-28 lg:pb-36">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(245,245,245,0.08),transparent_70%)]"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-12">
        <AnimatedSection className="mb-14 max-w-3xl">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-luxury-muted">
            Curated category
          </p>
          <h1 className="mt-4 font-display text-4xl tracking-tight text-luxury-snow md:text-6xl">
            {category.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-luxury-snow/95 md:text-xl">
            {category.description}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-luxury-muted md:text-lg">
            {category.subtitle}
          </p>
        </AnimatedSection>
        <CategoryProductGrid slug={slug} seedProducts={seedProducts} />
      </div>
    </div>
  );
}
