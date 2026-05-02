import { CATEGORY_SLUGS, type CategorySlug } from "./constants";
import type { Product } from "./types";

export type AdminProductInput = {
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeCategory(value: string): CategorySlug {
  const cleaned = value.toLowerCase().trim();
  return (CATEGORY_SLUGS as readonly string[]).includes(cleaned)
    ? (cleaned as CategorySlug)
    : CATEGORY_SLUGS[0];
}

export function createProductFromInput(
  input: AdminProductInput,
  id?: string,
): Product {
  const cleanName = input.name.trim();
  const cleanDescription = input.description.trim();
  const cleanPrice = Number(input.price) || 0;
  const slugBase = slugify(cleanName || "product");

  return {
    id: id ?? `prod-${crypto.randomUUID()}`,
    name: cleanName,
    slug: slugBase,
    category: normalizeCategory(input.category),
    price: Math.max(0, cleanPrice),
    currency: "USD",
    image: input.image.trim(),
    featured: false,
    shortDescription: cleanDescription.slice(0, 160),
    description: cleanDescription,
    ingredients: [],
    rating: 4.5,
  };
}
