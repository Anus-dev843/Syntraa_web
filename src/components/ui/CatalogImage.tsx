"use client";

import Image, { type ImageProps } from "next/image";

export type CatalogImageProps = Omit<ImageProps, "unoptimized">;

/**
 * Storefront product/category assets load straight from HTTPS CDNs (no `/_next/image` hop).
 * Avoidsoptimizer timeouts on constrained hosts and mixed allowlist issues on phones.
 */
export function CatalogImage({ alt, ...props }: CatalogImageProps) {
  return <Image {...props} alt={alt ?? ""} unoptimized />;
}
