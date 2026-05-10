import "server-only";

import type { AdminDiagnosticsPayload, DiagnosticCheck, DiagnosticStatus } from "@/lib/admin-diagnostics-types";
import {
  getConfiguredAdminLoginEmail,
  isAdminPasswordConfigured,
  isAdminSessionSecretConfigured,
} from "@/lib/admin-credentials";
import { getCloudinaryCloudName, isCloudinaryConfigured } from "@/lib/cloudinary";
import { getMongoHealthPayload } from "@/lib/mongo-health-status";

export type { AdminDiagnosticsPayload, DiagnosticCheck, DiagnosticStatus } from "@/lib/admin-diagnostics-types";

function adminAuthCheck(): DiagnosticCheck {
  const prod = process.env.NODE_ENV === "production";
  if (!prod) {
    const hasPlain = Boolean(process.env.ADMIN_PASSWORD?.trim());
    if (!isAdminPasswordConfigured() && !hasPlain) {
      return {
        id: "admin_auth",
        status: "warn",
        title: "Admin login (development)",
        detail:
          "Set ADMIN_PASSWORD, ADMIN_PASSWORD_HASH, or ADMIN_PASSWORD_HASH_BASE64 in .env.local.",
      };
    }
    return {
      id: "admin_auth",
      status: "good",
      title: "Admin login (development)",
      detail: "Credential env vars are present.",
    };
  }

  if (!isAdminPasswordConfigured()) {
    return {
      id: "admin_auth",
      status: "bad",
      title: "Admin password (production)",
      detail:
        "Set ADMIN_PASSWORD_HASH_BASE64 (recommended on Render) or ADMIN_PASSWORD_HASH — see .env.example. Run: npm run admin:hash-password -- \"YourPassword\"",
    };
  }
  if (!isAdminSessionSecretConfigured()) {
    return {
      id: "admin_auth",
      status: "bad",
      title: "Admin session (production)",
      detail:
        "Set ADMIN_SESSION_SECRET (64 hex chars). Generate: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    };
  }
  return {
    id: "admin_auth",
    status: "good",
    title: "Admin auth (production)",
    detail: `ADMIN_PASSWORD_HASH (or BASE64) + ADMIN_SESSION_SECRET are set (login email: ${getConfiguredAdminLoginEmail()}).`,
  };
}

/** Deployment health for admin UI — no secrets. */
export async function getAdminDiagnosticsPayload(): Promise<AdminDiagnosticsPayload> {
  const mongo = await getMongoHealthPayload();
  const checks: DiagnosticCheck[] = [];

  if (!mongo.mongoConfigured) {
    checks.push({
      id: "mongodb",
      status: "bad",
      title: "MongoDB",
      detail:
        "MONGODB_URI is missing on this server. Add it under Render → Environment → your Web Service, then redeploy.",
    });
  } else if (!mongo.connected) {
    checks.push({
      id: "mongodb",
      status: "bad",
      title: "MongoDB connection",
      detail: mongo.hint,
    });
  } else {
    checks.push({
      id: "mongodb",
      status: "good",
      title: "MongoDB",
      detail:
        mongo.productCount === 0
          ? `Connected — database "${mongo.database}" is empty; add products or import seed.`
          : `Connected — ${mongo.productCount} product(s) in "${mongo.database}".`,
    });
  }

  /** Shop can use `/mockups/` and static URLs without Cloudinary — warn only, not deployment blocker. */
  const cloudOk = isCloudinaryConfigured();
  checks.push(
    cloudOk
      ? {
          id: "cloudinary",
          status: "good",
          title: "Cloudinary",
          detail: `Configured (cloud: ${getCloudinaryCloudName() ?? "unknown"}).`,
        }
      : {
          id: "cloudinary",
          status: "warn",
          title: "Cloudinary (optional for catalogue)",
          detail:
            "Not set — admin image uploads to Cloudinary will fail; product images can still use `/mockups/…` HTTPS or paths. Add CLOUDINARY_* on Render when you need uploads.",
        },
  );

  checks.push(adminAuthCheck());

  let bad = 0;
  let warn = 0;
  for (const c of checks) {
    if (c.status === "bad") bad += 1;
    if (c.status === "warn") warn += 1;
  }

  let overall: DiagnosticStatus;
  let overallLabel: string;
  if (bad > 0) {
    overall = "bad";
    overallLabel = "Fix required";
  } else if (warn > 0) {
    overall = "warn";
    overallLabel = "OK with warnings";
  } else {
    overall = "good";
    overallLabel = "All checks passed";
  }

  const renderChecklist = [
    "Render → Web Service → Environment: MONGODB_URI (or split MONGODB_USER + MONGODB_PASSWORD).",
    "Atlas → Network Access: 0.0.0.0/0 for cloud hosting (or specific egress).",
    "Atlas → Database Access: user password matches Render; rotate if unsure.",
    "CLOUDINARY_* three vars or CLOUDINARY_URL.",
    "Production: ADMIN_PASSWORD_HASH_BASE64 (or ADMIN_PASSWORD_HASH) + ADMIN_SESSION_SECRET.",
    "After env changes: Manual Deploy so the service restarts with new variables.",
  ];

  return {
    overall,
    overallLabel,
    checks,
    renderChecklist,
    mongo: {
      configured: mongo.mongoConfigured,
      connected: mongo.mongoConfigured && mongo.connected,
      productCount: mongo.productCount,
      database: mongo.database,
    },
    cloudinary: {
      configured: cloudOk,
      cloudName: cloudOk ? getCloudinaryCloudName() ?? null : null,
    },
    generatedAt: new Date().toISOString(),
  };
}
