function looksLikeMongoUri(uri: string): boolean {
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
}

/** Remove `user:password@` from a Mongo connection string (Atlas shell copy). */
export function stripMongoCredentials(uri: string): string {
  const m = uri.match(/^(mongodb(?:\+srv)?:\/\/)([^@]+)@(.+)$/);
  if (!m) return uri;
  return `${m[1]}${m[3]}`;
}

/** Insert URL-encoded credentials after the scheme (host part must not already include userinfo). */
export function insertMongoCredentials(uri: string, user: string, password: string): string {
  const encodedUser = encodeURIComponent(user);
  const encodedPass = encodeURIComponent(password);
  const auth = `${encodedUser}:${encodedPass}@`;
  const m = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.+)$/);
  if (!m) return uri;
  return `${m[1]}${auth}${m[2]}`;
}

function resolveExplicitMongoPassword(): string | undefined {
  const b64 = process.env.MONGODB_PASSWORD_BASE64?.trim();
  if (b64) {
    try {
      return Buffer.from(b64, "base64").toString("utf8");
    } catch {
      return undefined;
    }
  }
  return process.env.MONGODB_PASSWORD?.trim();
}

/**
 * Final URI for Mongoose / MongoClient. If `MONGODB_USER` and `MONGODB_PASSWORD` (or
 * `MONGODB_PASSWORD_BASE64`) are set, credentials from `MONGODB_URI` are stripped and replaced
 * with URL-encoded values — fixes special characters and Render `$…` env interpolation issues.
 */
export function resolveMongoConnectionString(): string | undefined {
  const base = resolveMongoUri();
  if (!base) return undefined;
  const user = process.env.MONGODB_USER?.trim();
  const pass = resolveExplicitMongoPassword();
  if (user && pass) {
    return insertMongoCredentials(stripMongoCredentials(base), user, pass);
  }
  return base;
}

/** Strips wrapping quotes from env paste mistakes (Render / .env). */
export function normalizeMongoUri(raw: string): string {
  let s = raw.trim();
  if (s.length >= 2) {
    const a = s[0];
    const b = s[s.length - 1];
    if ((a === '"' && b === '"') || (a === "'" && b === "'")) {
      s = s.slice(1, -1).trim();
    }
  }
  return s;
}

const MONGO_ENV_KEYS = ["MONGODB_URI", "MONGO_URI", "MONGODB_URL"] as const;

/**
 * Prefer `MONGODB_URI`, then common aliases, then `DATABASE_URL` only when it is
 * a Mongo URI (avoid using a Postgres/other `DATABASE_URL` by mistake).
 */
export function resolveMongoUri(): string | undefined {
  for (const key of MONGO_ENV_KEYS) {
    const raw = process.env[key]?.trim();
    const value = raw ? normalizeMongoUri(raw) : "";
    if (value && looksLikeMongoUri(value)) {
      return value;
    }
  }
  const databaseUrlRaw = process.env.DATABASE_URL?.trim();
  const databaseUrl = databaseUrlRaw ? normalizeMongoUri(databaseUrlRaw) : "";
  if (databaseUrl && looksLikeMongoUri(databaseUrl)) {
    return databaseUrl;
  }
  return undefined;
}

/** True when a Mongo connection string env var is present (does not verify connect). */
export function isMongoConfigured(): boolean {
  return Boolean(resolveMongoUri());
}
