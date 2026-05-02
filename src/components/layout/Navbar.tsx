"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORY_SLUGS } from "@/lib/constants";
import { useCart } from "@/context/CartContext";

const navCategories = CATEGORY_SLUGS.map((slug) => ({
  slug,
  label:
    slug === "facewash"
      ? "Face wash"
      : slug.charAt(0).toUpperCase() + slug.slice(1),
}));

const navLink = cn(
  "relative text-[11px] uppercase tracking-[0.28em] text-luxury-muted transition-colors duration-300 hover:text-luxury-snow",
  "after:pointer-events-none after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-luxury-snow/70 after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100",
);

const navButton =
  "text-[11px] uppercase tracking-[0.28em] text-luxury-muted transition-colors duration-300 hover:text-luxury-snow";

function CartNavButton() {
  const { itemCount, openCart, hydrated } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-luxury-snow transition hover:border-white/30 hover:bg-white/[0.06]"
      aria-label={`Shopping bag${itemCount ? `, ${itemCount} items` : ""}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 7h15l-1.5 11H7.5L6 7Z" />
        <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      </svg>
      {hydrated && itemCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-luxury-snow px-1 text-[10px] font-medium tabular-nums leading-none text-black">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </button>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 12);
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const desktopNav = (
    <nav
      aria-label="Primary"
      className="hidden items-center justify-center gap-10 lg:flex"
    >
      <Link href="/" className={navLink}>
        Home
      </Link>
      <Link href="/products" className={navLink}>
        Products
      </Link>
      <div className="group relative py-3">
        <button
          type="button"
          className={cn(navButton, "inline-flex items-center gap-1")}
          aria-expanded="false"
          aria-haspopup="true"
        >
          Categories
          <span aria-hidden className="text-[10px] opacity-60">
            ⌄
          </span>
        </button>
        <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 w-max min-w-[13rem] -translate-x-1/2 rounded-xl border border-white/10 bg-black/80 p-2 pt-3 opacity-0 shadow-2xl shadow-black backdrop-blur-2xl transition group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
          <ul className="flex flex-col gap-0.5 pb-2">
            {navCategories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="flex rounded-lg px-3 py-2.5 text-[11px] uppercase tracking-[0.22em] text-luxury-muted hover:bg-white/[0.06] hover:text-luxury-snow"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Link href="/story" className={navLink}>
        Story
      </Link>
      <Link href="/contact" className={navLink}>
        Contact
      </Link>
    </nav>
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          "border-white/[0.07] bg-black/0 backdrop-blur-2xl backdrop-saturate-[1.35] supports-[backdrop-filter]:bg-black/[0.18]",
          scrolled &&
            "border-white/[0.11] bg-black/30 supports-[backdrop-filter]:bg-black/[0.42]",
        )}
      >
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-6 px-[var(--gutter-x)] py-4 md:py-5">
          <Link
            href="/"
            className="relative z-10 font-display text-xl tracking-[0.14em] text-luxury-snow md:text-2xl"
          >
            The Syntraa
          </Link>

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
            {desktopNav}
          </div>

          <div className="relative z-10 flex items-center justify-end gap-2 lg:min-w-[6.5rem]">
            <CartNavButton />
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-luxury-snow lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <span
                className={cn(
                  "absolute block h-px w-5 bg-current transition-transform duration-300",
                  mobileOpen ? "rotate-45" : "-translate-y-1",
                )}
              />
              <span
                className={cn(
                  "absolute block h-px w-5 bg-current transition-transform duration-300",
                  mobileOpen ? "-rotate-45" : "translate-y-1",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-[60] flex justify-end bg-black/55 backdrop-blur-2xl transition-opacity duration-300 lg:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <button
          type="button"
          className={cn(
            "min-h-0 flex-1 bg-transparent",
            mobileOpen ? "cursor-pointer" : "cursor-default",
          )}
          tabIndex={mobileOpen ? 0 : -1}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "flex h-full w-[min(100%,22rem)] flex-col border-l border-white/10 bg-[#050505] shadow-[-24px_0_64px_rgba(0,0,0,0.65)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-4">
            <span className="font-display text-xl tracking-[0.14em] text-luxury-snow">
              The Syntraa
            </span>
            <button
              type="button"
              className="text-[11px] uppercase tracking-[0.3em] text-luxury-muted"
              onClick={() => setMobileOpen(false)}
            >
              Close
            </button>
          </div>
          <nav
            className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-8 py-10"
            aria-label="Mobile primary"
          >
            {[
              { href: "/", label: "Home" },
              { href: "/products", label: "Products" },
              { href: "/cart", label: "Cart" },
              { href: "/story", label: "Story" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-white/[0.06] py-4 text-sm uppercase tracking-[0.28em] text-luxury-snow"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <p className="pt-6 text-[10px] uppercase tracking-[0.35em] text-luxury-muted">
              Categories
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {navCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="block py-2.5 text-sm text-luxury-muted transition hover:text-luxury-snow"
                    onClick={() => setMobileOpen(false)}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
