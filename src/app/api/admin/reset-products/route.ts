import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

import { PRODUCTS } from "../../../../../data/products";
import { CATEGORY_SLUGS } from "../../../../lib/constants";
import { hasValidAdminSession } from "../../../../lib/admin-auth";
import { readAdminStore, writeAdminStore } from "../../../../lib/admin-json";

export async function POST(request: NextRequest) {
  if (!hasValidAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const current = await readAdminStore();
    await writeAdminStore({
      products: PRODUCTS.map((p) => ({ ...p })),
      pages: current.pages,
    });
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
