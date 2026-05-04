import "server-only";

import { getProductById as getById, listProducts } from "@/lib/product-service";
import { normalizeProduct } from "@/lib/product-normalize";
import type { Product } from "@/lib/types";

export { getCategoryMetas } from "@/lib/products";

function logCatalogError(label: string, error: unknown) {
  console.error(`[catalog] ${label}`, error);
}

export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const list = await listProducts();
    return list.map((p) => normalizeProduct(p));
  } catch (error) {
    logCatalogError("getCatalogProducts", error);
    return [];
  }
}

export async function getProductsByCategorySlug(slug: string): Promise<Product[]> {
  const products = await getCatalogProducts();
  return products.filter((p) => p.category === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const product = await getById(id);
    return product ? normalizeProduct(product) : undefined;
  } catch (error) {
    logCatalogError("getProductById", error);
    return undefined;
  }
}
