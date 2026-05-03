import { Hero } from "@/components/home/Hero";
import { IntroCurtain } from "@/components/home/IntroCurtain";
import { ShowreelSection } from "@/components/home/ShowreelSection";
import { CraftPillars } from "@/components/home/CraftPillars";
import { ScrollManifesto } from "@/components/home/ScrollManifesto";
import { StorySection } from "@/components/home/StorySection";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";

import { getCatalogProducts, getCategoryMetas } from "@/lib/catalog";

export default async function Home() {
  const categories = getCategoryMetas();
  const inventory = await getCatalogProducts();

  return (
    <>
      <IntroCurtain />
      <Hero />
      <ShowreelSection />
      <CraftPillars />
      <ScrollManifesto />
      <StorySection />
      <CategoryShowcase categories={categories} />
      <FeaturedProducts seed={inventory} />
    </>
  );
}
