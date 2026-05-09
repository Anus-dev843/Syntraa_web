import "server-only";

import { getSeedProductPartials } from "@/lib/catalog-seed";
import { resolveMongoUri } from "@/lib/mongo-uri";
import { getProductById as getById, listProducts } from "@/lib/product-service";
import { normalizeProduct } from "@/lib/product-normalize";
import type { Product } from "@/lib/types";

export { getCategoryMetas } from "@/lib/products";

function logCatalogError(label: string, error: unknown) {
  console.error(`[catalog] ${label}`, error);
}

function catalogFallbackAllowed(): boolean {
  const raw = process.env.SYNTRAA_CATALOG_FALLBACK?.trim().toLowerCase();
  return raw !== "false" && raw !== "0" && raw !== "no";
}

let cachedNormalizedSeed: Product[] | undefined;

function normalizedFallbackProducts(): Product[] {
  cachedNormalizedSeed ??= getSeedProductPartials().map((p) => normalizeProduct(p as Product));
  return cachedNormalizedSeed;
}

let warnedServingSeedNoMongo = false;

/**
 * Prefer Mongo catalogue; if it is empty and fallback is enabled, serve `data/products.js`.
 * Disable fallback in production-only Mongo mode with `SYNTRAA_CATALOG_FALLBACK=false`.
 */
export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const list = await listProducts();
    if (list.length > 0) {
      return list.map((p) => normalizeProduct(p));
    }

    const uriSet = Boolean(resolveMongoUri());
    // When URI is unset, always show fallback (demo shop). When URI is set but DB is empty,
    // still serve fallback unless operator disabled it — avoids blank storefront during setup.
    if (catalogFallbackAllowed()) {
      if (!uriSet) {
        if (!warnedServingSeedNoMongo) {
          warnedServingSeedNoMongo = true;
          console.warn(
            "[catalog] MONGODB_URI unset — storefront is serving the static seed catalogue from data/products.js (set Mongo + publish to replace).",
          );
        }
      } else if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[catalog] Mongo reachable but catalogue empty — using seed from data/products.js until products are published",
        );
      }
      return normalizedFallbackProducts();
    }

    return [];
  } catch (error) {
    logCatalogError("getCatalogProducts", error);
    if (catalogFallbackAllowed()) {
      return normalizedFallbackProducts();
    }
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
    if (product) {
      return normalizeProduct(product);
    }
  } catch (error) {
    logCatalogError("getProductById", error);
  }

  if (catalogFallbackAllowed()) {
    const hit = normalizedFallbackProducts().find((p) => p.id === id);
    if (hit) return hit;
  }

  return undefined;
}
