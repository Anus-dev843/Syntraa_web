export const CATEGORY_SLUGS = [
  "shampoo",
  "facewash",
  "facialcare",
  "serums",
  "bodycare",
  "haircare",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

/** Customer-facing labels (nav, filters, footer, category cards). */
export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  shampoo: "Shampoo",
  facewash: "Face wash",
  facialcare: "Facial care",
  serums: "Serums",
  bodycare: "Body care",
  haircare: "Hair care",
};
