import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import { PRODUCTS } from "../../data/products";
import type { AdminStore, CustomPage, Product } from "./types";
import { normalizeProduct } from "./product-normalize";

const STORE_REL = ["src", "data", "admin-store.json"] as const;

function storePath() {
  return path.join(process.cwd(), ...STORE_REL);
}

export const RESERVED_PAGE_SLUGS = new Set([
  "api",
  "admin",
  "_next",
  "products",
  "product",
  "cart",
  "category",
  "story",
  "contact",
  "refund-policy",
  "privacy-policy",
  "p",
  "favicon",
  "robots",
  "sitemap",
]);

export function isValidPageSlug(slug: string): boolean {
  if (slug.length < 2 || slug.length > 80) return false;
  if (RESERVED_PAGE_SLUGS.has(slug)) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function readAdminStore(): Promise<AdminStore> {
  const file = storePath();
  try {
    const raw = await fs.readFile(file, "utf-8");
    const parsed = JSON.parse(raw) as AdminStore;
    if (!Array.isArray(parsed.products)) {
      throw new Error("Invalid store: products");
    }
    if (!Array.isArray(parsed.pages)) {
      parsed.pages = [];
    }
    parsed.products = parsed.products.map((p) =>
      normalizeProduct(p as Product),
    );
    return parsed;
  } catch {
    const initial: AdminStore = {
      products: PRODUCTS.map((p) => normalizeProduct({ ...p })),
      pages: [],
    };
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
}

export async function writeAdminStore(store: AdminStore): Promise<void> {
  const file = storePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(store, null, 2), "utf-8");
}

export function validateAdminStore(body: unknown): { ok: true; store: AdminStore } | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Body must be a JSON object." };
  }
  const b = body as Record<string, unknown>;
  if (!Array.isArray(b.products)) {
    return { ok: false, message: "`products` must be an array." };
  }
  if (!Array.isArray(b.pages)) {
    return { ok: false, message: "`pages` must be an array." };
  }

  const rawPages = b.pages as CustomPage[];
  const slugs = new Set<string>();
  const pages: CustomPage[] = [];
  const today = new Date().toISOString().slice(0, 10);
  for (const p of rawPages) {
    if (!p?.id || !p?.title || typeof p.slug !== "string" || typeof p.content !== "string") {
      return { ok: false, message: "Each page needs id, title, slug, and content." };
    }
    if (!isValidPageSlug(p.slug)) {
      return { ok: false, message: `Invalid or reserved slug: ${p.slug}` };
    }
    if (slugs.has(p.slug)) {
      return { ok: false, message: `Duplicate page slug: ${p.slug}` };
    }
    slugs.add(p.slug);
    pages.push({
      ...p,
      updatedAt: typeof p.updatedAt === "string" && p.updatedAt ? p.updatedAt : today,
    });
  }

  return {
    ok: true,
    store: {
      products: b.products as Product[],
      pages,
    },
  };
}
