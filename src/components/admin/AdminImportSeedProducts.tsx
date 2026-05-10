"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type Props = {
  mongoConfigured: boolean;
};

export function AdminImportSeedProducts({ mongoConfigured }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneMsg, setDoneMsg] = useState<string | null>(null);

  const runImport = useCallback(async () => {
    setError(null);
    setDoneMsg(null);
    const okWindow =
      typeof window !== "undefined" &&
      window.confirm(
        "Replace the entire MongoDB product collection with items from data/products.js? This removes existing catalogue rows.",
      );
    if (!okWindow) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/reset-products", {
        method: "POST",
        credentials: "include",
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        inserted?: number;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status}).`);
        return;
      }
      const n = data.inserted ?? 0;
      if (n === 0) {
        setError(
          "No products were inserted. If this repeats, MongoDB did not accept writes — check Render logs and Atlas connection.",
        );
        return;
      }
      setDoneMsg(`Imported ${n} products from the seed file.`);
      router.refresh();
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  }, [router]);

  if (!mongoConfigured) {
    return (
      <div className="mt-4 rounded-2xl border border-rose-500/35 bg-rose-500/[0.07] px-5 py-4 text-sm text-rose-100/95">
        <span className="font-medium text-rose-50">MongoDB is not configured.</span> Add{" "}
        <code className="rounded-md bg-black/40 px-1.5 py-0.5 font-mono text-xs text-luxury-snow">
          MONGODB_URI
        </code>{" "}
        on your host (e.g. Render → Environment), redeploy, then use the import button below.
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <button
        type="button"
        onClick={runImport}
        disabled={busy}
        className="rounded-full border border-amber-400/50 bg-amber-500/15 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.26em] text-amber-50 transition hover:border-amber-300/70 hover:bg-amber-500/25 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Importing…" : "Import seed catalogue into MongoDB"}
      </button>
      {error ? (
        <p className="text-sm text-rose-300" role="alert">
          {error}
        </p>
      ) : null}
      {doneMsg ? (
        <p className="text-sm text-emerald-300" role="status">
          {doneMsg}
        </p>
      ) : null}
    </div>
  );
}
