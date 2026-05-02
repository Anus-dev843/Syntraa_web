"use client";

import { usePathname } from "next/navigation";

import { CartDrawer } from "../cart/CartDrawer";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { SmoothScroll } from "../providers/SmoothScroll";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname() ?? "";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <div className="min-h-dvh w-full overflow-x-clip bg-luxury-black text-pretty">
        <main className="min-h-dvh w-full">{children}</main>
      </div>
    );
  }

  return (
    <SmoothScroll>
      <div className="flex min-h-dvh w-full flex-col overflow-x-clip bg-luxury-black">
        <Navbar />
        <main className="min-h-0 flex-1 bg-luxury-black text-pretty">{children}</main>
        <Footer />
        <CartDrawer />
      </div>
    </SmoothScroll>
  );
}
