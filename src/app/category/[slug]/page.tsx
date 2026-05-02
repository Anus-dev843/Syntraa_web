import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryProductGrid } from "@/components/category/CategoryProductGrid";

import { getCatalogProducts, getCategoryMetas } from "@/lib/catalog";
import { isValidCategorySlug } from "@/lib/products";

import { CATEGORY_SLUGS } from "@/lib/constants";

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
    <div className="border-b border-white/10 pb-28 pt-24 md:pb-32 md:pt-28 lg:pb-36">
      <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-12">
        <CategoryProductGrid
          slug={slug}
          seedProducts={seedProducts}
          category={category}
        />
      </div>
    </div>
  );
}
