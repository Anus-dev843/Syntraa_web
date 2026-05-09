import { Hero } from "@/components/home/Hero";
import { IntroCurtain } from "@/components/home/IntroCurtain";
import { ShowreelSection } from "@/components/home/ShowreelSection";
import { ScrollManifesto } from "@/components/home/ScrollManifesto";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HomeProductShowcase } from "@/components/home/HomeProductShowcase";
import { ProductCarousel } from "@/components/ui/ProductCarousel";

import { getCatalogProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const inventory = await getCatalogProducts();

  return (
    <>
      <IntroCurtain />
      <Hero />
      <ShowreelSection />
      <ScrollManifesto />
      <FeaturedProducts seed={inventory} />
      <ProductCarousel products={inventory} />
      <HomeProductShowcase products={inventory} />
    </>
  );
}
