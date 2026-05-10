import { AdminDeploymentStatus } from "@/components/admin/AdminDeploymentStatus";
import { AdminSettingsPasswordTools } from "@/components/admin/AdminSettingsPasswordTools";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <AdminDeploymentStatus variant="panel" />

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
        <p className="text-[0.65rem] uppercase tracking-[0.34em] text-luxury-muted">Settings</p>
        <h2 className="mt-4 font-display text-4xl tracking-tight text-luxury-snow">
          Admin security
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-luxury-muted">
          Credentials and session signing come from environment variables on Render (see{" "}
          <code className="rounded bg-black/35 px-1.5 py-0.5 font-mono text-sm text-luxury-snow">
            .env.example
          </code>
          ).
        </p>
        <AdminSettingsPasswordTools />
      </section>
    </div>
  );
}
