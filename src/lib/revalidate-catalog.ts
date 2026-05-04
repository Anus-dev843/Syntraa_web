import { revalidatePath } from "next/cache";

import { CATEGORY_SLUGS } from "@/lib/constants";

export function revalidateCatalogPaths(productId?: string): void {
  revalidatePath("/");
  revalidatePath("/products");
  if (productId) {
    revalidatePath(`/product/${productId}`);
  }
  for (const slug of CATEGORY_SLUGS) {
    revalidatePath(`/category/${slug}`);
  }
}
