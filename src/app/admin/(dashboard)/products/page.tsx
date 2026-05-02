import { AdminProductsManager } from "../../../../components/admin/AdminProductsManager";
import { readAdminStore } from "../../../../lib/admin-json";

export default async function AdminProductsPage() {
  const store = await readAdminStore();
  return <AdminProductsManager initialProducts={store.products} />;
}
