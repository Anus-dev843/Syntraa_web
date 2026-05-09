export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  currency: string;
  /** Primary cover image; used on cards, cart, OpenGraph. */
  image: string;
  /**
   * Extra gallery images (excludes the primary `image`). Detail page renders
   * `[image, ...images]` together. Max 7 entries (8 total with cover).
   */
  images: string[];
  featured: boolean;
  shortDescription: string;
  /** Long-form copy for product detail. */
  description: string;
  /** INCI-style or marketing ingredient lines. */
  ingredients: string[];
  /** Editorial baseline 0–5; detail page prefers live average from reviews when available. */
  rating: number;
};

export type CategoryMeta = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

/** CMS-style page stored in `admin-store.json`. */
export type CustomPage = {
  id: string;
  title: string;
  slug: string;
  content: string;
  updatedAt: string;
};

/** CMS pages only — catalog products live in MongoDB. */
export type AdminStore = {
  pages: CustomPage[];
};
