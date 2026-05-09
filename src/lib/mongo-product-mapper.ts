import type { Product } from "@/lib/types";
import type { ProductDocument } from "@/lib/models/Product";

export function mongoDocToProduct(doc: ProductDocument): Product {
  const id = doc._id.toString();
  const description = doc.description ?? "";
  const short =
    doc.shortDescription?.trim() ||
    (description.length > 160 ? `${description.slice(0, 157)}…` : description);
  const rawImages = Array.isArray(doc.images) ? doc.images : [];
  const images = rawImages.filter(
    (u): u is string => typeof u === "string" && u.length > 0 && u !== doc.image,
  );
  return {
    id,
    name: doc.name,
    slug: doc.slug,
    category: doc.category,
    price: doc.price,
    currency: doc.currency || "USD",
    image: doc.image,
    images,
    featured: Boolean(doc.featured),
    shortDescription: short,
    description,
    ingredients: Array.isArray(doc.ingredients) ? doc.ingredients : [],
    rating: typeof doc.rating === "number" ? doc.rating : 4.5,
  };
}
