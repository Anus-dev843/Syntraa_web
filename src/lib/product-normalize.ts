import type { Product } from "@/lib/types";

/** Ensures newer catalog fields exist for older `admin-store.json` files. */
export function normalizeProduct(raw: Product): Product {
  return {
    ...raw,
    description: raw.description ?? raw.shortDescription ?? "",
    ingredients: Array.isArray(raw.ingredients) ? raw.ingredients : [],
    rating:
      typeof raw.rating === "number" && !Number.isNaN(raw.rating)
        ? raw.rating
        : 4.5,
  };
}
