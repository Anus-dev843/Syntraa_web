import mongoose from "mongoose";

/** Same logical DB as native driver (`src/lib/db.ts`). Overrides default DB in `MONGODB_URI`. */
const MONGOOSE_DB_NAME = "syntraa";

declare global {
  var syntraaMongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const cached = global.syntraaMongoose ?? { conn: null, promise: null };
global.syntraaMongoose = cached;

let warnedMissingUri = false;

/** True when `MONGODB_URI` is present (does not verify the connection works). */
export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI?.trim());
}

/**
 * Connects to MongoDB when `MONGODB_URI` is set. Returns `null` if unset — does not throw
 * (avoids noisy server / overlay errors during local dev without a database).
 */
export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    if (process.env.NODE_ENV === "development" && !warnedMissingUri) {
      warnedMissingUri = true;
      console.warn(
        "[mongodb] MONGODB_URI is not set — catalog APIs return empty data. Add MONGODB_URI to .env.local to enable MongoDB.",
      );
    }
    return null;
  }
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { dbName: MONGOOSE_DB_NAME });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
