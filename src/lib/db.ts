import "server-only";

import { type Collection, type Db, MongoClient } from "mongodb";

/** App database (MongoDB creates it on first write). */
export const SYNTRAA_DB_NAME = "syntraa" as const;

export const USERS_COLLECTION_NAME = "users" as const;

export type SampleUserDoc = {
  name: string;
  createdAt: Date;
};

declare global {
  var syntraaMongoClientPromise: Promise<MongoClient> | undefined;
}

function requireMongoUri(): string {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error("MONGODB_URI is not set in the environment.");
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
  const client = new MongoClient(uri);
  global.syntraaMongoClientPromise = client.connect().then((connected) => {
    console.log(`[Syntraa MongoDB native] Connected (database "${SYNTRAA_DB_NAME}")`);
    return connected;
  });
  return global.syntraaMongoClientPromise;
}

export async function getMongoClient(): Promise<MongoClient> {
  return getMongoClientPromise();
}

/** Database `syntraa` — independent of default DB in the connection string. */
export async function getSyntraaDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(SYNTRAA_DB_NAME);
}

export async function getUsersCollection(): Promise<Collection<SampleUserDoc>> {
  const db = await getSyntraaDb();
  return db.collection<SampleUserDoc>(USERS_COLLECTION_NAME);
}
