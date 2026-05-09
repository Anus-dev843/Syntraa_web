import { NextResponse, type NextRequest } from "next/server";

import { hasValidAdminSession } from "@/lib/admin-auth";
import { isMongoConfigured } from "@/lib/mongodb";
import {
  MAX_GALLERY_EXTRAS,
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/lib/product-service";
import { revalidateCatalogPaths } from "@/lib/revalidate-catalog";

function databaseNotConfigured() {
  return NextResponse.json(
    {
      error:
        "Database not configured. Set MONGODB_URI in .env.local (or your host dashboard) and restart the dev server.",
    },
    { status: 503 },
  );
}

type Ctx = { params: Promise<{ id: string }> };

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function GET(_request: NextRequest, context: Ctx) {
  try {
    const { id } = await context.params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: Ctx) {
  if (!hasValidAdminSession(request)) {
    return unauthorized();
  }
  try {
    const { id } = await context.params;
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    const b = body as Record<string, unknown>;
    const patch: Parameters<typeof updateProduct>[0] = { id };

    if (b.name !== undefined) {
      if (typeof b.name !== "string" || !b.name.trim()) {
        return NextResponse.json({ error: "Invalid name." }, { status: 400 });
      }
      patch.name = b.name;
    }
    if (b.description !== undefined) {
      if (typeof b.description !== "string" || !b.description.trim()) {
        return NextResponse.json({ error: "Invalid description." }, { status: 400 });
      }
      patch.description = b.description;
    }
    if (b.category !== undefined) {
      if (typeof b.category !== "string" || !b.category.trim()) {
        return NextResponse.json({ error: "Invalid category." }, { status: 400 });
      }
      patch.category = b.category;
    }
    if (b.image !== undefined) {
      if (typeof b.image !== "string" || !b.image.startsWith("https://")) {
        return NextResponse.json(
          { error: "image must be an https URL." },
          { status: 400 },
        );
      }
      patch.image = b.image;
    }
    if (b.images !== undefined) {
      if (!Array.isArray(b.images)) {
        return NextResponse.json(
          { error: "images must be an array of https URLs." },
          { status: 400 },
        );
      }
      if (b.images.length > MAX_GALLERY_EXTRAS) {
        return NextResponse.json(
          {
            error: `Up to ${MAX_GALLERY_EXTRAS} extra images allowed (8 total with cover).`,
          },
          { status: 400 },
        );
      }
      const list: string[] = [];
      for (const u of b.images) {
        if (typeof u !== "string" || !u.startsWith("https://")) {
          return NextResponse.json(
            { error: "Each gallery image must be an https URL." },
            { status: 400 },
          );
        }
        list.push(u);
      }
      patch.images = list;
    }
    if (b.price !== undefined) {
      const price = typeof b.price === "number" ? b.price : Number(b.price);
      if (!Number.isFinite(price) || price < 0) {
        return NextResponse.json({ error: "Invalid price." }, { status: 400 });
      }
      patch.price = price;
    }
    if (b.featured !== undefined) {
      patch.featured = Boolean(b.featured);
    }

    const keys = Object.keys(patch);
    if (keys.length <= 1) {
      return NextResponse.json({ error: "No fields to update." }, { status: 400 });
    }

    if (!isMongoConfigured()) {
      return databaseNotConfigured();
    }

    const product = await updateProduct(patch);
    if (!product) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    revalidateCatalogPaths(id);
    return NextResponse.json(product);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: Ctx) {
  if (!hasValidAdminSession(request)) {
    return unauthorized();
  }
  try {
    const { id } = await context.params;
    if (!isMongoConfigured()) {
      return databaseNotConfigured();
    }
    const ok = await deleteProduct(id);
    if (!ok) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    revalidateCatalogPaths(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
