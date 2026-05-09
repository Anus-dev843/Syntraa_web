import React from "react";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import "./globals.css";

import { CartProvider } from "../context/CartContext";
import { AppShell } from "../components/layout/AppShell";

const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  process.env.SITE_ORIGIN?.replace(/\/+$/, "") ||
  "https://www.thesyntraa.com";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

/** Required for phones: correct scaling, notch safe-areas, status bar tint. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "The Syntraa · Luxury Beauty Care",
    template: "%s · The Syntraa",
  },
  description:
    "Minimal, premium beauty formulations — sculpted textures, obsessive finish, monochrome calm.",
  appleWebApp: {
    capable: true,
    title: "The Syntraa",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-dvh bg-luxury-black text-luxury-snow antialiased">
        <CartProvider>
          <AppShell>{children}</AppShell>
        </CartProvider>
      </body>
    </html>
  );
}
