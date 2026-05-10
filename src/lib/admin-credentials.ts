import "server-only";

import bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";

/** Strip BOM, whitespace, accidental wrapping quotes (common when pasting into Render UI). */
function cleanEnvLoose(value: string | undefined): string | undefined {
  if (value == null) return undefined;
  let s = String(value).replace(/\ufeff/g, "").trim();
  if (!s) return undefined;
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s || undefined;
}

/** Base64 payloads: collapse internal whitespace (line breaks after copy-paste). */
function normalizeBase64Candidate(value: string | undefined): string | undefined {
  const s = cleanEnvLoose(value);
  if (!s) return undefined;
  return s.replace(/\s+/g, "");
}

function decodeBcryptFromBase64Variants(b64Raw: string | undefined): string | undefined {
  const compact = normalizeBase64Candidate(b64Raw);
  if (!compact) return undefined;
  try {
    // Standard base64 (+ /)
    let decoded = Buffer.from(compact, "base64").toString("utf8").trim();
    if (
      decoded.startsWith("$2a$") ||
      decoded.startsWith("$2b$") ||
      decoded.startsWith("$2y$")
    ) {
      return decoded;
    }
    // URL-safe base64 fallback
    const urlNorm = compact.replace(/-/g, "+").replace(/_/g, "/");
    const padLen = urlNorm.length % 4;
    const padded = padLen ? urlNorm + "=".repeat(4 - padLen) : urlNorm;
    decoded = Buffer.from(padded, "base64").toString("utf8").trim();
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
  return undefined;
}

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
  /** Prefer BASE64 — Render Dashboard often destroys `$…` bcrypt strings in `ADMIN_PASSWORD_HASH`. */
  const fromEnvB64 =
    decodeBcryptFromBase64Variants(process.env.ADMIN_PASSWORD_HASH_BASE64) ??
    decodeBcryptFromBase64Variants(process.env.ADMIN_PASSWORD_BCRYPT_BASE64);
  if (fromEnvB64) {
    return fromEnvB64;
  }

  const direct = cleanEnvLoose(process.env.ADMIN_PASSWORD_HASH);
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
  return Boolean(cleanEnvLoose(process.env.ADMIN_SESSION_SECRET));
}

/** For `/api/health?admin=1` — no secrets leaked. */
export function getAdminPasswordEnvDiagnostics(): {
  base64KeySet: boolean;
  alternateBase64KeySet: boolean;
  rawHashKeySet: boolean;
  base64DecodedOk: boolean;
} {
  const decoded =
    decodeBcryptFromBase64Variants(process.env.ADMIN_PASSWORD_HASH_BASE64) ??
    decodeBcryptFromBase64Variants(process.env.ADMIN_PASSWORD_BCRYPT_BASE64);
  return {
    base64KeySet: Boolean(process.env.ADMIN_PASSWORD_HASH_BASE64?.trim()),
    alternateBase64KeySet: Boolean(process.env.ADMIN_PASSWORD_BCRYPT_BASE64?.trim()),
    rawHashKeySet: Boolean(process.env.ADMIN_PASSWORD_HASH?.trim()),
    base64DecodedOk: Boolean(decoded),
  };
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
