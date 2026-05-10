import "server-only";

import type { AdminDiagnosticsPayload, DiagnosticCheck, DiagnosticStatus } from "@/lib/admin-diagnostics-types";
import { getCloudinaryCloudName, isCloudinaryConfigured } from "@/lib/cloudinary";
import { getMongoHealthPayload } from "@/lib/mongo-health-status";

export type { AdminDiagnosticsPayload, DiagnosticCheck, DiagnosticStatus } from "@/lib/admin-diagnostics-types";

function adminAuthCheck(): DiagnosticCheck {
  const prod = process.env.NODE_ENV === "production";
  if (!prod) {
    const hasHash = Boolean(process.env.ADMIN_PASSWORD_HASH?.trim());
    const hasPlain = Boolean(process.env.ADMIN_PASSWORD?.trim());
    if (!hasHash && !hasPlain) {
      return {
        id: "admin_auth",
        status: "warn",
        title: "Admin login (development)",
        detail:
          "Set ADMIN_PASSWORD or ADMIN_PASSWORD_HASH in .env.local so you can sign in.",
      };
    }
    return {
      id: "admin_auth",
      status: "good",
      title: "Admin login (development)",
      detail: "Credential env vars are present.",
    };
  }

  const hasHash = Boolean(process.env.ADMIN_PASSWORD_HASH?.trim());
  const hasSecret = Boolean(process.env.ADMIN_SESSION_SECRET?.trim());
  if (!hasHash) {
    return {
      id: "admin_auth",
      status: "bad",
      title: "Admin password (production)",
      detail: "Set ADMIN_PASSWORD_HASH on Render (run npm run admin:hash-password locally).",
    };
  }
  if (!hasSecret) {
    return {
      id: "admin_auth",
      status: "bad",
      title: "Admin session (production)",
      detail: "Set ADMIN_SESSION_SECRET on Render (same script prints a value).",
    };
  }
  return {
    id: "admin_auth",
    status: "good",
    title: "Admin auth (production)",
    detail: "ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET are set.",
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
          status: "bad",
          title: "Cloudinary",
          detail:
            "Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET (or CLOUDINARY_URL). Image uploads will fail until set on Render.",
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
    "Production: ADMIN_PASSWORD_HASH + ADMIN_SESSION_SECRET.",
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
