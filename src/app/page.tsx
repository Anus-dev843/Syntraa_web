import { Hero } from "@/components/home/Hero";
import { StorySection } from "@/components/home/StorySection";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";

import { getCatalogProducts, getCategoryMetas } from "@/lib/catalog";

export default async function Home() {
  const categories = getCategoryMetas();
  const inventory = await getCatalogProducts();

  return (
    <>
      <Hero />
      <StorySection />
      <CategoryShowcase categories={categories} />
      <FeaturedProducts seed={inventory} />
    </>
  );
}
