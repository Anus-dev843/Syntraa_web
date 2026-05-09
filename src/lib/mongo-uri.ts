function looksLikeMongoUri(uri: string): boolean {
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
}

/**
 * Prefer `MONGODB_URI`; fall back to `DATABASE_URL` only when it is a Mongo URI
 * (avoid using a Postgres/other `DATABASE_URL` by mistake).
 */
export function resolveMongoUri(): string | undefined {
  const mongodbUri = process.env.MONGODB_URI?.trim();
  if (mongodbUri) {
    return mongodbUri;
  }
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (databaseUrl && looksLikeMongoUri(databaseUrl)) {
    return databaseUrl;
  }
  return undefined;
}

/** True when a Mongo connection string env var is present (does not verify connect). */
export function isMongoConfigured(): boolean {
  return Boolean(resolveMongoUri());
}
