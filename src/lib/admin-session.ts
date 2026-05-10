import type { NextRequest } from "next/server";

/** HttpOnly cookie name — shared by middleware, layouts, and route handlers. */
export const ADMIN_SESSION_COOKIE = "syntraa_admin_session";

const SESSION_MAX_AGE_SEC = 60 * 60 * 12;

const enc = new TextEncoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  const b64 =
    typeof btoa !== "undefined"
      ? btoa(binary)
      : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(s: string): Uint8Array | null {
  try {
    const padded = s.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4;
    const withPad = pad ? padded + "=".repeat(4 - pad) : padded;
    const binary =
      typeof atob !== "undefined"
        ? atob(withPad)
        : Buffer.from(withPad, "base64").toString("binary");
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      out[i] = binary.charCodeAt(i);
    }
    return out;
  } catch {
    return null;
  }
}

export function getAdminSessionSecret(): string | undefined {
  const s = process.env.ADMIN_SESSION_SECRET?.trim();
  if (s) return s;
  if (process.env.NODE_ENV !== "production") {
    return "syntraa-admin-dev-only-session-secret";
  }
  return undefined;
}

async function hmacSha256Base64Url(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return base64UrlEncode(new Uint8Array(sig));
}

/** Issue signed session token (async; Edge + Node). */
export async function createAdminSessionToken(): Promise<string | null> {
  const secret = getAdminSessionSecret();
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC;
  const payload = JSON.stringify({ exp });
  const payloadB64 = base64UrlEncode(enc.encode(payload));
  const sigB64 = await hmacSha256Base64Url(secret, payloadB64);
  return `${payloadB64}.${sigB64}`;
}

/** Verify signed session cookie (async; Edge + Node). */
export async function verifyAdminSessionToken(value: string | undefined): Promise<boolean> {
  if (!value?.includes(".")) return false;
  const secret = getAdminSessionSecret();
  if (!secret) return false;

  const dot = value.indexOf(".");
  const payloadB64 = value.slice(0, dot);
  const sigB64 = value.slice(dot + 1);
  if (!payloadB64 || !sigB64) return false;

  try {
    const expectedSigB64 = await hmacSha256Base64Url(secret, payloadB64);
    if (expectedSigB64.length !== sigB64.length) return false;
    let equal = 0;
    for (let i = 0; i < expectedSigB64.length; i += 1) {
      equal |= expectedSigB64.charCodeAt(i) ^ sigB64.charCodeAt(i);
    }
    if (equal !== 0) return false;

    const payloadBytes = base64UrlDecode(payloadB64);
    if (!payloadBytes) return false;
    const text = new TextDecoder().decode(payloadBytes);
    const parsed = JSON.parse(text) as { exp?: number };
    if (typeof parsed.exp !== "number") return false;
    if (parsed.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function hasValidAdminSession(request: NextRequest): Promise<boolean> {
  return verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}
