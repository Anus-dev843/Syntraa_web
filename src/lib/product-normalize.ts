import type { Product } from "@/lib/types";

/** Avoid mixed-content blocks on HTTPS sites (especially mobile Safari). */
function normalizeCatalogImageUrl(input: unknown): string {
  if (typeof input !== "string") return "";
  const t = input.trim();
  if (!t) return "";
  if (t.startsWith("https://")) return t;
  if (t.startsWith("http://")) return `https://${t.slice("http://".length)}`;
  if (t.startsWith("//")) return `https:${t}`;
  return "";
}

/** Ensures newer catalog fields exist for older `admin-store.json` files. */
export function normalizeProduct(raw: Product): Product {
  const seen = new Set<string>();
  const cover = normalizeCatalogImageUrl(raw.image);
  if (cover) seen.add(cover);
  const images = Array.isArray(raw.images)
    ? raw.images
        .map((u) => normalizeCatalogImageUrl(u))
        .filter((u): u is string => {
          if (!u.startsWith("https://") || seen.has(u)) return false;
          seen.add(u);
          return true;
        })
    : [];
  return {
    ...raw,
    image: cover,
    images,
    description: raw.description ?? raw.shortDescription ?? "",
    ingredients: Array.isArray(raw.ingredients) ? raw.ingredients : [],
    rating:
      typeof raw.rating === "number" && !Number.isNaN(raw.rating)
        ? raw.rating
        : 4.5,
  };
}
