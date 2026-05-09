import { NextResponse, type NextRequest } from "next/server";

import { hasValidAdminSession } from "@/lib/admin-auth";

function isPublicAdminPath(pathname: string): boolean {
  return pathname === "/admin/login";
}

function isPublicAdminApi(pathname: string): boolean {
  return pathname === "/api/admin/login" || pathname === "/api/admin/logout";
}

/** Paths where we must not tweak caching (immutable assets). */
function isStaticLikePath(pathname: string): boolean {
  if (pathname.startsWith("/_next/static") || pathname.startsWith("/_next/image")) {
    return true;
  }
  if (pathname === "/favicon.ico") return true;
  return /\.(?:ico|png|jpe?g|gif|webp|svg|css|js|mjs|map|woff2?|txt|xml)(?:\?|$)/i.test(
    pathname,
  );
}

/**
 * Phones + Cloudflare often keep old HTML until headers say otherwise.
 * `CDN-Cache-Control` is what Cloudflare uses when “use origin cache headers” is on.
 */
const NO_STORE_DOC = {
  "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  Pragma: "no-cache",
} as const;

function applyNoStore(response: NextResponse): NextResponse {
  for (const [k, v] of Object.entries(NO_STORE_DOC)) {
    response.headers.set(k, v);
  }
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminPage || isAdminApi) {
    if (isPublicAdminPath(pathname) || isPublicAdminApi(pathname)) {
      return applyNoStore(NextResponse.next());
    }
    if (hasValidAdminSession(request)) {
      return applyNoStore(NextResponse.next());
    }
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (request.method !== "GET" || isStaticLikePath(pathname)) {
    return NextResponse.next();
  }

  return applyNoStore(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
