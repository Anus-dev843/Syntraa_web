import "server-only";

import { readAdminStore } from "@/lib/admin-json";
import { normalizeProduct } from "@/lib/product-normalize";
import type { Product } from "@/lib/types";

export { getCategoryMetas } from "@/lib/products";

export async function getCatalogProducts(): Promise<Product[]> {
  const store = await readAdminStore();
  return store.products.map((p) => normalizeProduct(p));
}

export async function getProductsByCategorySlug(slug: string): Promise<Product[]> {
  const products = await getCatalogProducts();
  return products.filter((p) => p.category === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getCatalogProducts();
  return products.find((p) => p.id === id);
}
