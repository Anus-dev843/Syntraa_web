import "server-only";

import bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";

function getExpectedEmail(): string {
  const raw = (process.env.ADMIN_EMAIL ?? "admin@syntraa.com").trim().toLowerCase();
  /** Empty env var `ADMIN_EMAIL=` would otherwise reject every login. */
  return raw || "admin@syntraa.com";
}

/** Read-only helper for `/api/health?admin=1` (deploy troubleshooting). */
export function getConfiguredAdminLoginEmail(): string {
  return getExpectedEmail();
}

/**
 * Raw `ADMIN_PASSWORD_HASH` works locally. On Render/host dashboards, `$` in bcrypt
 * strings is often mangled (shell interpolation). Use `ADMIN_PASSWORD_HASH_BASE64`
 * instead: UTF-8 bcrypt string → base64 (no `$` in the env value).
 */
export function resolveAdminPasswordHash(): string | undefined {
  /** Prefer BASE64 on hosts (Render) that corrupt `$…` inside `ADMIN_PASSWORD_HASH`. */
  const b64 = process.env.ADMIN_PASSWORD_HASH_BASE64?.trim();
  if (b64) {
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8").trim();
      if (
        decoded.startsWith("$2a$") ||
        decoded.startsWith("$2b$") ||
        decoded.startsWith("$2y$")
      ) {
        return decoded;
      }
    } catch {
      /* ignore */
    }
  }

  const direct = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (
    direct &&
    (direct.startsWith("$2a$") ||
      direct.startsWith("$2b$") ||
      direct.startsWith("$2y$"))
  ) {
    return direct;
  }

  return undefined;
}

/** True when a bcrypt hash is available (raw or base64). Plain ADMIN_PASSWORD does not count for production readiness. */
export function isAdminPasswordConfigured(): boolean {
  return Boolean(resolveAdminPasswordHash());
}

export function isAdminSessionSecretConfigured(): boolean {
  return Boolean(process.env.ADMIN_SESSION_SECRET?.trim());
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const ae = new TextEncoder().encode(a);
  const be = new TextEncoder().encode(b);
  if (ae.length !== be.length) return false;
  return timingSafeEqual(ae, be);
}

/**
 * Production: set `ADMIN_PASSWORD_HASH` (bcrypt). Optional `ADMIN_EMAIL` (default admin@syntraa.com).
 * Local dev without hash: set `ADMIN_PASSWORD` (plain) — never use in production.
 */
export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const expectedEmail = getExpectedEmail();
  if (email.trim().toLowerCase() !== expectedEmail) {
    return false;
  }

  const hash = resolveAdminPasswordHash();
  if (hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch {
      return false;
    }
  }

  if (process.env.NODE_ENV === "production") {
    return false;
  }

  const plain = process.env.ADMIN_PASSWORD?.trim();
  if (plain) {
    return timingSafeStringEqual(password, plain);
  }

  return false;
}
