import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

import { CATEGORY_SLUGS } from "@/lib/constants";
import { hasValidAdminSession } from "@/lib/admin-auth";
import {
  readAdminStore,
  validateAdminStore,
  writeAdminStore,
} from "@/lib/admin-json";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!hasValidAdminSession(request)) {
    return unauthorized();
  }
  try {
    const store = await readAdminStore();
    return NextResponse.json(store);
  } catch {
    return NextResponse.json(
      { error: "Could not read admin store." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!hasValidAdminSession(request)) {
    return unauthorized();
  }
  try {
    const body: unknown = await request.json();
    const result = validateAdminStore(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    await writeAdminStore(result.store);
    revalidatePath("/");
    revalidatePath("/products");
    for (const slug of CATEGORY_SLUGS) {
      revalidatePath(`/category/${slug}`);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
}
