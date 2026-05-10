import "server-only";

import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { isAllowedCatalogImageUrl } from "@/lib/catalog-image-url";
import { ProductModel, type ProductDocument } from "@/lib/models/Product";
import { mongoDocToProduct } from "@/lib/mongo-product-mapper";
import type { Product } from "@/lib/types";
import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/constants";
import { normalizeProduct } from "@/lib/product-normalize";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeCategory(value: string): CategorySlug {
  const cleaned = value.toLowerCase().trim();
  return (CATEGORY_SLUGS as readonly string[]).includes(cleaned)
    ? (cleaned as CategorySlug)
    : CATEGORY_SLUGS[0];
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base || "product";
  for (let i = 0; i < 12; i += 1) {
    const existing = await ProductModel.findOne({ slug: candidate }).lean();
    if (!existing || (excludeId && existing._id.toString() === excludeId)) {
      return candidate;
    }
    candidate = `${base}-${Math.random().toString(36).slice(2, 7)}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function listProducts(): Promise<Product[]> {
  if (!(await connectDB())) {
    return [];
  }
  const docs = await ProductModel.find().sort({ createdAt: -1 }).lean();
  return docs.map((d) => normalizeProduct(mongoDocToProduct(d as ProductDocument)));
}

export async function countProducts(): Promise<{ total: number; featured: number }> {
  if (!(await connectDB())) {
    return { total: 0, featured: 0 };
  }
  const [total, featured] = await Promise.all([
    ProductModel.countDocuments(),
    ProductModel.countDocuments({ featured: true }),
  ]);
  return { total, featured };
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (!(await connectDB())) {
    return undefined;
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return undefined;
  }
  const doc = await ProductModel.findById(id).lean();
  if (!doc) return undefined;
  return normalizeProduct(mongoDocToProduct(doc as ProductDocument));
}

/** Total visible images on detail = 1 cover + up to (MAX_GALLERY_EXTRAS) extras. */
export const MAX_GALLERY_EXTRAS = 7;

export type CreateProductPayload = {
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  /** Extra gallery images (excludes the primary `image`). Capped at MAX_GALLERY_EXTRAS. */
  images?: string[];
  featured?: boolean;
};

function sanitizeGalleryImages(
  raw: unknown,
  cover: string,
): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  if (cover) seen.add(cover);
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const url = item.trim();
    if (!isAllowedCatalogImageUrl(url)) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    out.push(url);
    if (out.length >= MAX_GALLERY_EXTRAS) break;
  }
  return out;
}

export async function createProduct(payload: CreateProductPayload): Promise<Product | null> {
  if (!(await connectDB())) {
    return null;
  }
  const name = payload.name.trim();
  const description = payload.description.trim();
  const image = payload.image.trim();
  const category = normalizeCategory(payload.category);
  const price = Math.max(0, Number(payload.price) || 0);
  const baseSlug = slugify(name || "product");
  const slug = await uniqueSlug(baseSlug);
  const shortDescription =
    description.length > 160 ? `${description.slice(0, 157)}…` : description;

  const images = sanitizeGalleryImages(payload.images, image);

  const doc = await ProductModel.create({
    name,
    price,
    description,
    category,
    image,
    images,
    slug,
    featured: Boolean(payload.featured),
    currency: "USD",
    shortDescription,
    ingredients: [],
    rating: 4.5,
  });
  return normalizeProduct(mongoDocToProduct(doc.toObject() as ProductDocument));
}

export type UpdateProductPayload = Partial<CreateProductPayload> & { id: string };

export async function updateProduct(payload: UpdateProductPayload): Promise<Product | null> {
  if (!(await connectDB())) {
    return null;
  }
  const { id, ...rest } = payload;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  const existing = await ProductModel.findById(id);
  if (!existing) return null;

  if (rest.name !== undefined) existing.name = rest.name.trim();
  if (rest.price !== undefined) existing.price = Math.max(0, Number(rest.price) || 0);
  if (rest.description !== undefined) {
    const d = rest.description.trim();
    existing.description = d;
    existing.shortDescription = d.length > 160 ? `${d.slice(0, 157)}…` : d;
  }
  if (rest.category !== undefined) {
    existing.category = normalizeCategory(rest.category);
  }
  if (rest.image !== undefined) existing.image = rest.image.trim();
  if (rest.images !== undefined) {
    existing.images = sanitizeGalleryImages(
      rest.images,
      (rest.image ?? existing.image ?? "").toString().trim(),
    );
  }
  if (rest.featured !== undefined) existing.featured = Boolean(rest.featured);

  if (rest.name !== undefined) {
    const baseSlug = slugify(existing.name || "product");
    const nextSlug = await uniqueSlug(baseSlug, id);
    existing.slug = nextSlug;
  }

  await existing.save();
  return normalizeProduct(mongoDocToProduct(existing.toObject() as ProductDocument));
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!(await connectDB())) {
    return false;
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  const res = await ProductModel.findByIdAndDelete(id);
  return Boolean(res);
}

export async function seedProductsFromSeedFile(
  products: Product[],
): Promise<{ inserted: number; mongoConnected: boolean }> {
  if (!(await connectDB())) {
    return { inserted: 0, mongoConnected: false };
  }
  await ProductModel.deleteMany({});
  let inserted = 0;
  for (const p of products) {
    const baseSlug = p.slug || slugify(p.name);
    const slug = await uniqueSlug(baseSlug);
    await ProductModel.create({
      name: p.name,
      price: p.price,
      description: p.description || p.shortDescription || "",
      category: normalizeCategory(p.category),
      image: p.image,
      images: sanitizeGalleryImages(p.images, p.image),
      slug,
      featured: Boolean(p.featured),
      currency: p.currency || "USD",
      shortDescription: p.shortDescription || "",
      ingredients: p.ingredients ?? [],
      rating: typeof p.rating === "number" ? p.rating : 4.5,
    });
    inserted += 1;
  }
  return { inserted, mongoConnected: true };
}
