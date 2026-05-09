import "server-only";

import { type Collection, type Db, MongoClient } from "mongodb";

import { getMongoDbName } from "./mongo-db-name";
import { getMongoDriverOptions } from "./mongo-driver-options";
import { resolveMongoUri } from "./mongo-uri";

export const USERS_COLLECTION_NAME = "users" as const;

export type SampleUserDoc = {
  name: string;
  createdAt: Date;
};

declare global {
  var syntraaMongoClientPromise: Promise<MongoClient> | undefined;
}

function requireMongoUri(): string {
  const uri = resolveMongoUri();
  if (!uri) {
    throw new Error(
      "MongoDB URI is not set. Define MONGODB_URI or DATABASE_URL in the environment (e.g. .env.local).",
    );
  }
  return uri;
}

/**
 * Single shared `MongoClient` promise (cached).
 * - Dev: stored on `global` so HMR does not open new pools on every reload.
 * - Prod: same global on long-lived `next start` / Node — reuse one pool per process.
 */
export function getMongoClientPromise(): Promise<MongoClient> {
  if (global.syntraaMongoClientPromise) {
    return global.syntraaMongoClientPromise;
  }
  const uri = requireMongoUri();
  const client = new MongoClient(uri, getMongoDriverOptions());
  global.syntraaMongoClientPromise = client.connect().then((connected) => {
    console.log(`[Syntraa MongoDB native] Connected (database "${getMongoDbName()}")`);
    return connected;
  });
  return global.syntraaMongoClientPromise;
}

export async function getMongoClient(): Promise<MongoClient> {
  return getMongoClientPromise();
}

/** Named by `getMongoDbName()` — independent of default DB path in the connection string. */
export async function getSyntraaDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(getMongoDbName());
}

export async function getUsersCollection(): Promise<Collection<SampleUserDoc>> {
  const db = await getSyntraaDb();
  return db.collection<SampleUserDoc>(USERS_COLLECTION_NAME);
}
