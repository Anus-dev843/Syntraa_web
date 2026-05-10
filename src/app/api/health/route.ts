import { type NextRequest, NextResponse } from "next/server";

import {
  getConfiguredAdminLoginEmail,
  isAdminPasswordConfigured,
  isAdminSessionSecretConfigured,
  resolveAdminPasswordHash,
} from "@/lib/admin-credentials";
import { getMongoHealthPayload } from "@/lib/mongo-health-status";

/** Lightweight check for load balancers (e.g. Render health checks). No DB or env required. */
/** With `?mongo=1`: Mongo env + connectivity + Product count — same payload as `/api/health/mongodb`. */
/** With `?admin=1`: Booleans only — troubleshoot "invalid email/password" (no secrets). */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  if (sp.get("mongo") === "1") {
    const body = await getMongoHealthPayload();
    return NextResponse.json(body, { status: 200 });
  }

  if (sp.get("admin") === "1") {
    const prod = process.env.NODE_ENV === "production";
    const hashLen = resolveAdminPasswordHash()?.length ?? 0;
    return NextResponse.json(
      {
        ok: true,
        production: prod,
        loginEmailMustMatch: getConfiguredAdminLoginEmail(),
        passwordHashResolved: Boolean(hashLen > 40),
        sessionSecretSet: isAdminSessionSecretConfigured(),
        hints: prod
          ? [
              ...(isAdminPasswordConfigured()
                ? []
                : [
                    "Set ADMIN_PASSWORD_HASH_BASE64 (recommended on Render) or ADMIN_PASSWORD_HASH — see .env.example",
                  ]),
              ...(isAdminSessionSecretConfigured()
                ? []
                : ["Set ADMIN_SESSION_SECRET (64-char hex); required for cookie sign-in in production"]),
              "If password still fails: remove ADMIN_PASSWORD_HASH from Render and keep only ADMIN_PASSWORD_HASH_BASE64 (avoid duplicate/mangled `$` hash)",
            ]
          : [],
        time: new Date().toISOString(),
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    { ok: true, service: "syntraa", time: new Date().toISOString() },
    { status: 200 },
  );
}
