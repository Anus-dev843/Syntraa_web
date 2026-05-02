"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "isAdminLoggedIn";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@syntraa.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      router.replace("/admin");
    }
  }, [router]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }
      localStorage.setItem(STORAGE_KEY, "true");
      router.replace("/admin");
    } catch {
      setError("Could not contact login API.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl"
      onSubmit={onSubmit}
    >
      <p className="text-[0.64rem] uppercase tracking-[0.36em] text-luxury-muted">
        The Syntraa
      </p>
      <h1 className="mt-4 font-display text-4xl tracking-tight text-luxury-snow">
        Admin login
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-luxury-muted">
        Enter your administrator credentials to access the control suite.
      </p>

      <div className="mt-8 space-y-5">
        <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-luxury-muted">
          Email
          <input
            className="rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-luxury-snow"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-luxury-muted">
          Password
          <input
            className="rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-luxury-snow"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
      </div>

      {error ? <p className="mt-5 text-sm text-rose-300">{error}</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="mt-7 w-full rounded-full bg-luxury-snow py-3 text-[11px] uppercase tracking-[0.32em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Checking..." : "Sign in"}
      </button>
    </form>
  );
}
