import "server-only";

import { ProductModel } from "@/lib/models/Product";
import { connectDB } from "@/lib/mongodb";
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
      return {
        mongoConfigured: true,
        connected: false,
        database,
        productCount: null,
        hint: "URI resolved but mongoose did not connect (unexpected — check logs).",
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
    return {
      mongoConfigured: true,
      connected: false,
      database,
      productCount: null,
      hint:
        "Connection failed — check Atlas Network Access (allow 0.0.0.0/0 during setup), URI user/password, and that the cluster matches this deploy.",
      error: message,
    };
  }
}
