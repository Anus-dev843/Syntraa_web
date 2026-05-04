import { AdminDashboardHome } from "@/components/admin/AdminDashboardHome";
import { readAdminStore } from "@/lib/admin-json";
import { countProducts } from "@/lib/product-service";

export const dynamic = "force-dynamic";

export default async function AdminDashboardRoutePage() {
  const store = await readAdminStore();
  let counts = { total: 0, featured: 0 };
  try {
    counts = await countProducts();
  } catch (error) {
    console.error("[admin/dashboard] countProducts", error);
  }
  return (
    <AdminDashboardHome
      pageCount={store.pages.length}
      productTotal={counts.total}
      featuredTotal={counts.featured}
    />
  );
}
