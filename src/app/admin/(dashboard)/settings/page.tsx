export default function AdminSettingsPage() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
      <p className="text-[0.65rem] uppercase tracking-[0.34em] text-luxury-muted">
        Settings
      </p>
      <h2 className="mt-4 font-display text-4xl tracking-tight text-luxury-snow">
        Settings workspace
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-luxury-muted">
        Add profile controls, API keys, and permissions here as the admin stack
        evolves.
      </p>
    </section>
  );
}
