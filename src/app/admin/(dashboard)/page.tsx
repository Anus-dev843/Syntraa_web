import { AdminDashboardHome } from "../../../components/admin/AdminDashboardHome";
import { readAdminStore } from "../../../lib/admin-json";

export default async function AdminDashboardPage() {
  const store = await readAdminStore();
  return <AdminDashboardHome store={store} />;
}
