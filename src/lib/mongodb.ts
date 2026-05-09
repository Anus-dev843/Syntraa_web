import mongoose from "mongoose";

import { getMongoDbName } from "./mongo-db-name";
import { getMongoDriverOptions } from "./mongo-driver-options";
import { resolveMongoUri } from "./mongo-uri";

declare global {
  var syntraaMongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const cached = global.syntraaMongoose ?? { conn: null, promise: null };
global.syntraaMongoose = cached;

let warnedMissingUri = false;

export { isMongoConfigured } from "./mongo-uri";

/**
 * Connects to MongoDB when `MONGODB_URI` or `DATABASE_URL` is set. Returns `null` if unset — does not throw
 * (avoids noisy server / overlay errors during local dev without a database).
 */
export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = resolveMongoUri();
  if (!uri) {
    if (!warnedMissingUri) {
      warnedMissingUri = true;
      const base =
        "[mongodb] MONGODB_URI (or DATABASE_URL with mongodb…) is unset — storefront catalog stays empty.";
      const prodHint =
        " Set it under Render → Environment and redeploy. Status: GET /api/health?mongo=1";
      if (process.env.NODE_ENV === "development") {
        console.warn(`${base}`, "Create .env.local for local dev.");
      } else {
        console.error(`${base}${prodHint}`);
      }
    }
    return null;
  }
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      dbName: getMongoDbName(),
      ...getMongoDriverOptions(),
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
