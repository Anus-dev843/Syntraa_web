export const CATEGORY_SLUGS = [
  "shampoo",
  "facewash",
  "serums",
  "bodycare",
  "haircare",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];
