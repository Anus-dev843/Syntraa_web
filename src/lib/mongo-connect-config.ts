import { ConnectionString } from "mongodb-connection-string-url";
import type { MongoClientOptions } from "mongodb";
import type { ConnectOptions } from "mongoose";

import { getMongoDbName } from "./mongo-db-name";
import { getMongoDriverOptions } from "./mongo-driver-options";

const DEFAULT_AUTH_SOURCE = "admin";

function authSourceFromEnv(): string {
  return process.env.MONGODB_AUTH_SOURCE?.trim() || DEFAULT_AUTH_SOURCE;
}

/**
 * Normalizes Atlas connection strings: default `authSource`, `retryWrites`, and passes
 * credentials via explicit driver options (more reliable than brittle URI encoding alone).
 */
export function getMongoConnectionConfig(uri: string): {
  uri: string;
  mongooseOptions: ConnectOptions;
  mongoClientOptions: MongoClientOptions;
} {
  const dbName = getMongoDbName();
  const driver = getMongoDriverOptions();
  const authSource = authSourceFromEnv();

  try {
    const cs = new ConnectionString(uri);

    if (!cs.searchParams.has("authSource")) {
      cs.searchParams.set("authSource", authSource);
    }
    if (!cs.searchParams.has("retryWrites")) {
      cs.searchParams.set("retryWrites", "true");
    }

    const resolvedAuthSource = cs.searchParams.get("authSource") || authSource;

    const rawUser = cs.username;
    const rawPass = cs.password;
    const user =
      rawUser !== undefined && rawUser !== "" ? decodeURIComponent(rawUser) : "";
    const pass =
      rawPass !== undefined && rawPass !== "" ? decodeURIComponent(rawPass) : "";

    if (user) {
      cs.username = "";
      cs.password = "";
      return {
        uri: cs.toString(),
        mongooseOptions: {
          dbName,
          ...driver,
          user,
          pass,
          authSource: resolvedAuthSource,
        },
        mongoClientOptions: {
          ...driver,
          auth: { username: user, password: pass },
          authSource: resolvedAuthSource,
        },
      };
    }

    const bare = cs.toString();
    return {
      uri: bare,
      mongooseOptions: {
        dbName,
        ...driver,
        authSource: resolvedAuthSource,
      },
      mongoClientOptions: {
        ...driver,
        authSource: resolvedAuthSource,
      },
    };
  } catch {
    return {
      uri,
      mongooseOptions: {
        dbName,
        ...driver,
        authSource,
      },
      mongoClientOptions: {
        ...driver,
        authSource,
      },
    };
  }
}
