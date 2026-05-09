/** Logical DB used by mongoose + native driver (`process.env.MONGODB_DB_NAME` or `syntraa`). */
export function getMongoDbName(): string {
  const raw = process.env.MONGODB_DB_NAME?.trim();
  return raw && raw.length > 0 ? raw : "syntraa";
}
