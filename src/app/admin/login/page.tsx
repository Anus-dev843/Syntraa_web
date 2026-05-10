import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "../../../components/admin/AdminLoginForm";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "../../../lib/admin-auth";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (await verifyAdminSessionToken(sessionValue)) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[radial-gradient(circle_at_20%_10%,rgba(245,245,245,0.08),transparent_40%),#040404] px-4 py-16">
      <AdminLoginForm />
    </div>
  );
}
