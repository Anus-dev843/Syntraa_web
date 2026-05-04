import { AdminProductsManager } from "@/components/admin/AdminProductsManager";
import { listProducts } from "@/lib/product-service";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  let products: Product[] = [];
  try {
    products = await listProducts();
  } catch (error) {
    console.error("[admin/products] listProducts", error);
  }
  return <AdminProductsManager initialProducts={products} />;
}
