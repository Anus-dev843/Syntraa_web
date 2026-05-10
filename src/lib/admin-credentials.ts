import "server-only";

import bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";

function getExpectedEmail(): string {
  return (process.env.ADMIN_EMAIL ?? "admin@syntraa.com").trim().toLowerCase();
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

  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
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
