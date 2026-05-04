import type { NextRequest } from "next/server";

export const ADMIN_EMAIL = "admin@syntraa.com";
export const ADMIN_PASSWORD = "123456";

export const ADMIN_SESSION_COOKIE = "syntraa_admin_session";
const ADMIN_SESSION_VALUE = "syntraa_admin_v1";

export function credentialsAreValid(email: string, password: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function sessionCookieValue(): string {
  return ADMIN_SESSION_VALUE;
}

export function isValidAdminSessionValue(value: string | undefined): boolean {
  return value === ADMIN_SESSION_VALUE;
}

export function hasValidAdminSession(request: NextRequest): boolean {
  return isValidAdminSessionValue(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}
