import { AdminPagesPanel } from "../../../../components/admin/AdminPagesPanel";
import { readAdminStore } from "../../../../lib/admin-json";

export default async function AdminPagesPage() {
  const store = await readAdminStore();
  return <AdminPagesPanel initialStore={store} />;
}
