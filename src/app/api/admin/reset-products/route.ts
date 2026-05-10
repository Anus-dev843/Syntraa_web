import { NextResponse, type NextRequest } from "next/server";

import { PRODUCTS } from "../../../../../data/products";
import { hasValidAdminSession } from "../../../../lib/admin-session";
import { isMongoConfigured } from "../../../../lib/mongodb";
import { revalidateCatalogPaths } from "../../../../lib/revalidate-catalog";
import { seedProductsFromSeedFile } from "../../../../lib/product-service";
import type { Product } from "../../../../lib/types";

export async function POST(request: NextRequest) {
  if (!(await hasValidAdminSession(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!isMongoConfigured()) {
    return NextResponse.json(
      {
        error:
          "Database not configured. Set MONGODB_URI in .env.local (or hosting env vars) before resetting products.",
      },
      { status: 503 },
    );
  }
  try {
    const { inserted, mongoConnected } = await seedProductsFromSeedFile(PRODUCTS as Product[]);
    if (!mongoConnected) {
      return NextResponse.json(
        {
          error:
            "Could not connect to MongoDB. Confirm MONGODB_URI on Render, Atlas Network Access (0.0.0.0/0), and correct database user password — then redeploy.",
          inserted: 0,
        },
        { status: 503 },
      );
    }
    revalidateCatalogPaths();
    return NextResponse.json({ ok: true, inserted });
  } catch {
    return NextResponse.json({ error: "Reset failed." }, { status: 500 });
  }
}
