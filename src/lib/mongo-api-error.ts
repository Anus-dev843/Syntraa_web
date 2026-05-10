/**
 * Maps MongoDB driver errors to safe API responses (no secrets).
 */
export function formatMongoDriverError(e: unknown): { message: string; status: number } {
  const msg = e instanceof Error ? e.message : String(e);
  const lower = msg.toLowerCase();

  if (lower.includes("bad auth") || lower.includes("authentication failed")) {
    return {
      message:
        "MongoDB login failed (wrong username/password in MONGODB_URI, or use MONGODB_USER + MONGODB_PASSWORD on Render). Open Admin → Settings for deployment checks, then fix Atlas Database Access and redeploy.",
      status: 503,
    };
  }

  if (
    lower.includes("whitelist") ||
    (lower.includes("not allowed") && lower.includes("ip")) ||
    lower.includes("could not connect to any servers")
  ) {
    return {
      message:
        "MongoDB network access blocked. In Atlas → Network Access allow 0.0.0.0/0 (or Render egress IPs), wait 1–2 minutes, redeploy.",
      status: 503,
    };
  }

  if (lower.includes("<password>")) {
    return {
      message:
        "MONGODB_URI still contains the literal <password>. Replace it with your Atlas password or use split env vars (see .env.example).",
      status: 503,
    };
  }

  return { message: msg.slice(0, 500), status: 500 };
}
