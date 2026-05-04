import { Hero } from "@/components/home/Hero";
import { IntroCurtain } from "@/components/home/IntroCurtain";
import { ShowreelSection } from "@/components/home/ShowreelSection";
import { CraftPillars } from "@/components/home/CraftPillars";
import { ScrollManifesto } from "@/components/home/ScrollManifesto";
import { StorySection } from "@/components/home/StorySection";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HomeProductShowcase } from "@/components/home/HomeProductShowcase";
import { ProductCarousel } from "@/components/ui/ProductCarousel";

import { getCatalogProducts, getCategoryMetas } from "@/lib/catalog";

export const dynamic = "force-dynamic";

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
      <ProductCarousel products={inventory} />
      <HomeProductShowcase products={inventory} />
    </>
  );
}
