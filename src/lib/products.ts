import categoriesFile from "@/data/categories.json";
import reviewsFile from "@/data/reviews.json";
import type { Review, CategoryMeta } from "./types";
import { CATEGORY_SLUGS, type CategorySlug } from "./constants";

export function getCategoryMetas(): CategoryMeta[] {
  return categoriesFile.categories as CategoryMeta[];
}

export function getProductCategories(): CategorySlug[] {
  return [...CATEGORY_SLUGS];
}

export function isValidCategorySlug(slug: string): slug is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(slug);
}

export function getAllReviews(): Review[] {
  return reviewsFile.reviews as Review[];
}

export function getReviewsForProduct(productId: string): Review[] {
  return getAllReviews().filter((r) => r.productId === productId);
}

export function getReviewsForProducts(productIds: string[]): Review[] {
  const set = new Set(productIds);
  return getAllReviews().filter((r) => set.has(r.productId));
}

export function getAverageRating(
  productId: string,
  reviews: Review[],
): { average: number; count: number } {
  const list = reviews.filter((r) => r.productId === productId);
  if (!list.length) {
    return { average: 0, count: 0 };
  }
  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  return { average: sum / list.length, count: list.length };
}
