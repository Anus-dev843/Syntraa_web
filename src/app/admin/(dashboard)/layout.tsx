import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminShell } from "../../../components/admin/AdminShell";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "../../../lib/admin-session";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await verifyAdminSessionToken(sessionValue))) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
