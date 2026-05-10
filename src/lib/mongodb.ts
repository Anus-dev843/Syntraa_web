import mongoose from "mongoose";

import { getMongoConnectionConfig } from "./mongo-connect-config";
import { resolveMongoConnectionString } from "./mongo-uri";

declare global {
  var syntraaMongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const cached = global.syntraaMongoose ?? { conn: null, promise: null };
global.syntraaMongoose = cached;

let warnedMissingUri = false;
let warnedPlaceholderPassword = false;

export { isMongoConfigured } from "./mongo-uri";

/**
 * Connects to MongoDB when `MONGODB_URI` or `DATABASE_URL` is set. Returns `null` if unset — does not throw
 * (avoids noisy server / overlay errors during local dev without a database).
 */
export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = resolveMongoConnectionString();
  if (uri?.includes("<password>") && !warnedPlaceholderPassword) {
    warnedPlaceholderPassword = true;
    console.error(
      "[mongodb] MONGODB_URI still contains the literal <password> — replace it with your Atlas user's password (or use MONGODB_USER + MONGODB_PASSWORD).",
    );
  }
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
    const { uri: connectUri, mongooseOptions } = getMongoConnectionConfig(uri);
    cached.promise = mongoose.connect(connectUri, mongooseOptions);
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    try {
      await mongoose.disconnect();
    } catch {
      /* ignore */
    }
    throw e;
  }
}
