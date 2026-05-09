import type { Product } from "@/lib/types";

/** Ensures newer catalog fields exist for older `admin-store.json` files. */
export function normalizeProduct(raw: Product): Product {
  const seen = new Set<string>();
  const cover = raw.image ?? "";
  if (cover) seen.add(cover);
  const images = Array.isArray(raw.images)
    ? raw.images.filter(
        (u): u is string =>
          typeof u === "string" &&
          u.startsWith("https://") &&
          !seen.has(u) &&
          (seen.add(u), true),
      )
    : [];
  return {
    ...raw,
    images,
    description: raw.description ?? raw.shortDescription ?? "",
    ingredients: Array.isArray(raw.ingredients) ? raw.ingredients : [],
    rating:
      typeof raw.rating === "number" && !Number.isNaN(raw.rating)
        ? raw.rating
        : 4.5,
  };
}
