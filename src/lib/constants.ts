export const CATEGORY_SLUGS = [
  "shampoo",
  "facewash",
  "facialcare",
  "serums",
  "bodycare",
  "haircare",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];
