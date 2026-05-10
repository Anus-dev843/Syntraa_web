import "server-only";

import { ProductModel } from "@/lib/models/Product";
import { connectDB, peekLastMongoConnectionError } from "@/lib/mongodb";
import { getMongoDbName } from "@/lib/mongo-db-name";
import { isMongoConfigured } from "@/lib/mongo-uri";

export type MongoHealthPayload =
  | {
      mongoConfigured: false;
      connected: false;
      database: string;
      productCount: null;
      hint: string;
    }
  | {
      mongoConfigured: true;
      connected: false;
      database: string;
      productCount: null;
      hint: string;
      error?: string;
    }
  | {
      mongoConfigured: true;
      connected: true;
      database: string;
      productCount: number;
      hint: string | null;
    };

/** Used by `/api/health?mongo=1` and `/api/health/mongodb`. */
export async function getMongoHealthPayload(): Promise<MongoHealthPayload> {
  const database = getMongoDbName();
  if (!isMongoConfigured()) {
    return {
      mongoConfigured: false,
      connected: false,
      database,
      productCount: null,
      hint: "Add MONGODB_URI (or DATABASE_URL with a mongodb:// URI) on your host — e.g. Render → Environment.",
    };
  }

  try {
    const mongoose = await connectDB();
    if (!mongoose) {
      const err = peekLastMongoConnectionError();
      return {
        mongoConfigured: true,
        connected: false,
        database,
        productCount: null,
        hint:
          err ??
          "URI resolved but mongoose did not connect — check Atlas Network Access, credentials, and logs.",
        error: err,
      };
    }
    const productCount = await ProductModel.countDocuments();
    return {
      mongoConfigured: true,
      connected: true,
      database,
      productCount,
      hint:
        productCount === 0
          ? "DB is reachable but Product collection has no docs — use /admin/add-product or import data into this database."
          : null,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    const authFailed =
      /bad auth|authentication failed/i.test(message) ||
      (typeof e === "object" &&
        e !== null &&
        "codeName" in e &&
        (e as { codeName?: string }).codeName === "AtlasError");

    let hint =
      "Connection failed — check Atlas Network Access (allow 0.0.0.0/0 during setup), URI user/password, and that the cluster matches this deploy.";
    if (authFailed) {
      hint =
        "Atlas rejected database credentials. Fix: (1) Atlas → Database Access → reset password → Connect → copy URI. (2) Put host-only URI in MONGODB_URI and set MONGODB_USER + MONGODB_PASSWORD separately on Render (password is URL-encoded automatically — avoids broken `$` in passwords and paste mistakes). Optional: MONGODB_PASSWORD_BASE64 if your host mangles secrets. (3) No extra quotes around env values; redeploy after saving.";
    }

    return {
      mongoConfigured: true,
      connected: false,
      database,
      productCount: null,
      hint,
      error: message,
    };
  }
}
