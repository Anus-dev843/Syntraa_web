import { NextResponse, type NextRequest } from "next/server";

import { hasValidAdminSession } from "@/lib/admin-auth";
import { isMongoConfigured } from "@/lib/mongodb";
import {
  MAX_GALLERY_EXTRAS,
  createProduct,
  listProducts,
} from "@/lib/product-service";
import { revalidateCatalogPaths } from "@/lib/revalidate-catalog";

function validateImagesPayload(value: unknown): string[] | { error: string } {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    return { error: "images must be an array of https URLs." };
  }
  if (value.length > MAX_GALLERY_EXTRAS) {
    return {
      error: `Up to ${MAX_GALLERY_EXTRAS} extra images allowed (8 total with cover).`,
    };
  }
  const out: string[] = [];
  for (const u of value) {
    if (typeof u !== "string" || !u.startsWith("https://")) {
      return { error: "Each gallery image must be an https URL." };
    }
    out.push(u);
  }
  return out;
}

function databaseNotConfigured() {
  return NextResponse.json(
    {
      error:
        "Database not configured. Set MONGODB_URI in .env.local (or your host’s env vars). Restart the dev server after saving.",
    },
    { status: 503 },
  );
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json(products);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!hasValidAdminSession(request)) {
    return unauthorized();
  }
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    const b = body as Record<string, unknown>;
    const name = typeof b.name === "string" ? b.name : "";
    const description = typeof b.description === "string" ? b.description : "";
    const category = typeof b.category === "string" ? b.category : "";
    const image = typeof b.image === "string" ? b.image : "";
    const price = typeof b.price === "number" ? b.price : Number(b.price);
    const featured = Boolean(b.featured);

    if (!name.trim() || !description.trim() || !category.trim() || !image.trim()) {
      return NextResponse.json(
        { error: "name, description, category, and image are required." },
        { status: 400 },
      );
    }
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "price must be a non-negative number." }, { status: 400 });
    }
    if (!image.startsWith("https://")) {
      return NextResponse.json(
        { error: "image must be an https URL (e.g. Cloudinary secure_url)." },
        { status: 400 },
      );
    }

    const imagesResult = validateImagesPayload(b.images);
    if (!Array.isArray(imagesResult)) {
      return NextResponse.json({ error: imagesResult.error }, { status: 400 });
    }

    if (!isMongoConfigured()) {
      return databaseNotConfigured();
    }

    const product = await createProduct({
      name,
      description,
      category,
      image,
      images: imagesResult,
      price,
      featured,
    });
    if (!product) {
      return NextResponse.json({ error: "Could not create product." }, { status: 500 });
    }
    revalidateCatalogPaths(product.id);
    return NextResponse.json(product, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
