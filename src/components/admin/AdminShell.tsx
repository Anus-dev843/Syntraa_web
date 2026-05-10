"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

import { AdminDeploymentStatus } from "./AdminDeploymentStatus";
import { cn } from "../../lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", match: (p: string) => p === "/admin/dashboard" || p === "/admin" },
  {
    href: "/admin/products",
    label: "Products",
    match: (p: string) =>
      p.startsWith("/admin/products") || p.startsWith("/admin/edit-product"),
  },
  { href: "/admin/add-product", label: "Add Product", match: (p: string) => p.startsWith("/admin/add-product") },
  { href: "/admin/pages", label: "Pages", match: (p: string) => p.startsWith("/admin/pages") },
  { href: "/admin/orders", label: "Orders", match: (p: string) => p.startsWith("/admin/orders") },
  { href: "/admin/settings", label: "Settings", match: (p: string) => p.startsWith("/admin/settings") },
];

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const pageTitle = useMemo(() => {
    const match = navItems.find((item) => item.match(pathname));
    return match?.label ?? "Dashboard";
  }, [pathname]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" }).catch(
      () => {},
    );
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_10%_10%,rgba(245,245,245,0.08),transparent_38%),#040404]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1400px]">
        <motion.aside
          initial={reduceMotion ? false : { opacity: 0, x: -12 }}
          animate={reduceMotion ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="sticky top-0 hidden h-dvh w-[18.5rem] shrink-0 border-r border-white/10 bg-white/[0.03] p-5 backdrop-blur-2xl md:flex md:flex-col"
        >
          <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
            <p className="text-[0.62rem] uppercase tracking-[0.36em] text-luxury-muted">
              The Syntraa
            </p>
            <p className="mt-2 font-display text-2xl tracking-tight text-luxury-snow">
              Admin
            </p>
          </div>

          <nav className="mt-6 flex-1 space-y-1" aria-label="Admin navigation">
            {navItems.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center rounded-xl px-4 py-3 text-sm transition-all duration-300",
                    active
                      ? "border border-white/20 bg-white/[0.1] text-luxury-snow shadow-[0_10px_30px_-18px_rgba(255,255,255,0.45)]"
                      : "text-luxury-muted hover:bg-white/[0.06] hover:text-luxury-snow",
                  )}
                >
                  <span className="text-[11px] uppercase tracking-[0.28em]">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-[11px] uppercase tracking-[0.28em] text-luxury-muted transition hover:border-white/35 hover:text-luxury-snow"
          >
            Log out
          </button>
        </motion.aside>

        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-black/40 px-5 py-4 backdrop-blur-2xl md:px-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.34em] text-luxury-muted">
                  Control room
                </p>
                <h1 className="mt-2 font-display text-3xl tracking-tight text-luxury-snow">
                  {pageTitle}
                </h1>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-white/15 px-5 py-2 text-[11px] uppercase tracking-[0.28em] text-luxury-muted transition hover:border-white/35 hover:text-luxury-snow md:hidden"
              >
                Logout
              </button>
            </div>
          </header>

          <nav
            className="flex gap-2 overflow-x-auto overflow-y-hidden border-b border-white/10 bg-black/30 px-5 py-3 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Admin shortcuts"
          >
            {navItems.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] transition",
                    active
                      ? "border-white/35 bg-white/[0.08] text-luxury-snow"
                      : "border-white/12 text-luxury-muted hover:border-white/25 hover:text-luxury-snow",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <main className="flex-1 px-5 py-8 md:px-8 md:py-10">
            <AdminDeploymentStatus variant="banner" />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
