import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/product/ProductDetail";
import { getProductById } from "@/lib/catalog";
import { getAverageRating, getReviewsForProduct } from "@/lib/products";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return { title: "Product" };
  }
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    notFound();
  }

  const reviews = getReviewsForProduct(product.id);
  const ratingSummary = getAverageRating(product.id, reviews);

  return (
    <ProductDetail
      product={product}
      reviews={reviews}
      ratingSummary={ratingSummary}
    />
  );
}
