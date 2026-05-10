import { NextResponse, type NextRequest } from "next/server";

import { hasValidAdminSession } from "@/lib/admin-auth";

function isPublicAdminPath(pathname: string): boolean {
  return pathname === "/admin/login";
}

function isPublicAdminApi(pathname: string): boolean {
  return pathname === "/api/admin/login" || pathname === "/api/admin/logout";
}

/** Same auth as `/api/admin/*` — uploads must not be callable without a session. */
function isAdminImageUploadPost(pathname: string, method: string): boolean {
  return pathname === "/api/upload" && method === "POST";
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

/** Apex → canonical www (SEO + cookie consistency). Skips previews and localhost. */
function canonicalSiteRedirect(request: NextRequest): NextResponse | null {
  const rawHost = request.headers.get("host");
  const host = rawHost?.split(":")[0]?.toLowerCase() ?? "";
  if (host === "thesyntraa.com") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "www.thesyntraa.com";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const apexRedirect = canonicalSiteRedirect(request);
  if (apexRedirect) return apexRedirect;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isUploadPost = isAdminImageUploadPost(pathname, request.method);

  if (isAdminPage || isAdminApi || isUploadPost) {
    if (isPublicAdminPath(pathname) || isPublicAdminApi(pathname)) {
      return applyNoStore(NextResponse.next());
    }
    if (await hasValidAdminSession(request)) {
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
