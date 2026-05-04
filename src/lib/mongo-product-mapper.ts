import type { Product } from "@/lib/types";
import type { ProductDocument } from "@/lib/models/Product";

export function mongoDocToProduct(doc: ProductDocument): Product {
  const id = doc._id.toString();
  const description = doc.description ?? "";
  const short =
    doc.shortDescription?.trim() ||
    (description.length > 160 ? `${description.slice(0, 157)}…` : description);
  return {
    id,
    name: doc.name,
    slug: doc.slug,
    category: doc.category,
    price: doc.price,
    currency: doc.currency || "USD",
    image: doc.image,
    featured: Boolean(doc.featured),
    shortDescription: short,
    description,
    ingredients: Array.isArray(doc.ingredients) ? doc.ingredients : [],
    rating: typeof doc.rating === "number" ? doc.rating : 4.5,
  };
}
