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
  image: string;
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

export type AdminStore = {
  products: Product[];
  pages: CustomPage[];
};
