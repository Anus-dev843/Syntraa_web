export const CATEGORY_SLUGS = [
  "shampoo",
  "facewash",
  "facialcare",
  "serums",
  "bodycare",
  "haircare",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  shampoo: "Shampoo",
  facewash: "Facewash",
  facialcare: "Facial care",
  serums: "Serums",
  bodycare: "Bodycare",
  haircare: "Haircare",
};
