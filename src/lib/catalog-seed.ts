import "server-only";

import type { Product } from "@/lib/types";
import { PRODUCTS } from "@data/products.js";

/** Static snapshot from `data/products.js` — used when Mongo has no catalogue yet. */
export function getSeedProductPartials(): Partial<Product>[] {
  return PRODUCTS as Partial<Product>[];
}
