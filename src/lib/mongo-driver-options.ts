import type { MongoClientOptions } from "mongodb";

/**
 * Atlas + Node 17+: default dual-stack probing can skew TLS handshake and surface
 * `tlsv1 alert internal error` / OpenSSL alert 80 when talking to Atlas.
 */
export function getMongoDriverOptions(): MongoClientOptions {
  return {
    autoSelectFamily: false,
    /** Prefer IPv4; helps some Windows + Atlas TLS handshake failures */
    family: 4,
  };
}
