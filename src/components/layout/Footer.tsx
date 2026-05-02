import Link from "next/link";
import { CATEGORY_SLUGS } from "@/lib/constants";
import { SocialLinks } from "@/components/layout/SocialLinks";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#030303]">
      <div className="mx-auto max-w-6xl px-[var(--gutter-x)] py-[var(--section-y-lg)] md:py-24">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* About brand */}
          <div className="lg:col-span-5">
            <span className="font-display text-2xl tracking-[0.12em] text-luxury-snow md:text-3xl">
              The Syntraa
            </span>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-luxury-muted md:text-base">
              A beauty house devoted to monochrome calm — formulations tuned like
              couture, black glass, and rituals that ask little yet return depth.
              Every layer is luxury without excess.
            </p>
            <p className="mt-8 text-xs uppercase tracking-[0.32em] text-luxury-muted">
              Concierge
            </p>
            <a
              href="mailto:concierge@thesyntraa.example"
              className="mt-2 inline-block text-sm text-luxury-snow transition-colors duration-300 hover:text-white"
            >
              concierge@thesyntraa.example
            </a>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-luxury-snow">
                Explore
              </p>
              <ul className="mt-6 space-y-3.5 text-sm text-luxury-muted">
                <li>
                  <Link
                    href="/"
                    className="transition-colors duration-300 hover:text-luxury-snow"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="transition-colors duration-300 hover:text-luxury-snow"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/story" className="transition-colors duration-300 hover:text-luxury-snow">
                    Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="transition-colors duration-300 hover:text-luxury-snow"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-luxury-snow">
                Categories
              </p>
              <ul className="mt-6 space-y-3.5 text-sm text-luxury-muted">
                {CATEGORY_SLUGS.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/category/${slug}`}
                      className="transition-colors duration-300 hover:text-luxury-snow"
                    >
                      {slug === "facewash"
                        ? "Facewash"
                        : slug.charAt(0).toUpperCase() + slug.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-luxury-snow">
                Legal &amp; tools
              </p>
              <ul className="mt-6 space-y-3.5 text-sm text-luxury-muted">
                <li>
                  <Link
                    href="/refund-policy"
                    className="transition-colors duration-300 hover:text-luxury-snow"
                  >
                    Refund policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="transition-colors duration-300 hover:text-luxury-snow"
                  >
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="transition-colors duration-300 hover:text-luxury-snow">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-10 border-t border-white/[0.06] pt-12 md:flex-row md:items-center md:justify-between">
          <SocialLinks className="flex flex-wrap gap-3" />
          <div className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.26em] text-luxury-muted md:text-right">
            <p>© {new Date().getFullYear()} The Syntraa</p>
            <p className="normal-case tracking-normal text-luxury-muted/80">
              Worldwide shipping · Carbon-balanced packaging
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
