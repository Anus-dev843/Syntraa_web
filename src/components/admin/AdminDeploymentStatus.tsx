"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { AdminDiagnosticsPayload, DiagnosticStatus } from "@/lib/admin-diagnostics-types";

function badgeClasses(status: DiagnosticStatus): string {
  if (status === "good") return "border-emerald-400/35 bg-emerald-500/[0.08] text-emerald-100";
  if (status === "bad") return "border-rose-400/40 bg-rose-500/[0.09] text-rose-100";
  return "border-amber-400/35 bg-amber-500/[0.08] text-amber-100";
}

function dotClasses(status: DiagnosticStatus): string {
  if (status === "good") return "bg-emerald-400";
  if (status === "bad") return "bg-rose-400";
  return "bg-amber-400";
}

type Props = { variant: "banner" | "panel" };

export function AdminDeploymentStatus({ variant }: Props) {
  const [data, setData] = useState<AdminDiagnosticsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/admin/diagnostics", { credentials: "include" })
      .then(async (res) => {
        const json = (await res.json().catch(() => ({}))) as
          | AdminDiagnosticsPayload
          | { error?: string };
        if (cancelled) return;
        if (!res.ok || ("error" in json && json.error)) {
          setError(
            typeof json === "object" && json && "error" in json ? String(json.error) : "Failed",
          );
          return;
        }
        setData(json as AdminDiagnosticsPayload);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load deployment status.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (variant === "banner") {
    if (error || !data) return null;
    if (data.overall === "good") return null;
    return (
      <div
        className={`mb-6 rounded-2xl border px-4 py-3 text-sm leading-relaxed ${badgeClasses(data.overall)}`}
        role="status"
      >
        <p className="font-medium">{data.overallLabel}</p>
        <p className="mt-1 text-xs opacity-90">
          Fix MongoDB, Cloudinary, or admin env on Render — see{" "}
          <Link href="/admin/settings" className="underline underline-offset-2 hover:opacity-100">
            Settings → deployment checks
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <section
      className={`rounded-3xl border p-6 backdrop-blur-xl md:p-8 ${
        data ? badgeClasses(data.overall) : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.34em] text-luxury-muted">Deployment</p>
          <h2 className="mt-2 font-display text-2xl tracking-tight text-luxury-snow md:text-3xl">
            {data ? data.overallLabel : "Checking…"}
          </h2>
        </div>
        {data ? (
          <span
            className={`rounded-full border px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] ${badgeClasses(data.overall)}`}
          >
            {data.overall === "good" ? "Good" : data.overall === "bad" ? "Fix required" : "Warnings"}
          </span>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 text-sm text-rose-300">{error}</p>
      ) : null}

      {!data && !error ? (
        <p className="mt-4 text-sm text-luxury-muted">Loading deployment checks…</p>
      ) : null}

      {data ? (
        <>
          <ul className="mt-6 space-y-4">
            {data.checks.map((c) => (
              <li
                key={c.id}
                className="flex gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm"
              >
                <span className={`mt-1.5 size-2 shrink-0 rounded-full ${dotClasses(c.status)}`} />
                <div>
                  <p className="font-medium text-luxury-snow">{c.title}</p>
                  <p className="mt-1 leading-relaxed text-luxury-muted">{c.detail}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-luxury-muted">
              Render checklist
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-luxury-muted">
              {data.renderChecklist.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
          </div>

          <p className="mt-4 text-[11px] text-luxury-muted/80">
            Last checked: {new Date(data.generatedAt).toLocaleString()}
          </p>
        </>
      ) : null}
    </section>
  );
}
