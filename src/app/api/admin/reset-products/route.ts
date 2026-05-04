import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

import { PRODUCTS } from "../../../../../data/products";
import { CATEGORY_SLUGS } from "../../../../lib/constants";
import { hasValidAdminSession } from "../../../../lib/admin-auth";
import { isMongoConfigured } from "../../../../lib/mongodb";
import { seedProductsFromSeedFile } from "../../../../lib/product-service";
import type { Product } from "../../../../lib/types";

export async function POST(request: NextRequest) {
  if (!hasValidAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!isMongoConfigured()) {
    return NextResponse.json(
      {
        error:
          "Database not configured. Set MONGODB_URI in the environment before resetting products.",
      },
      { status: 503 },
    );
  }
  try {
    await seedProductsFromSeedFile(PRODUCTS as Product[]);
    revalidatePath("/");
    revalidatePath("/products");
    for (const slug of CATEGORY_SLUGS) {
      revalidatePath(`/category/${slug}`);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Reset failed." }, { status: 500 });
  }
}
