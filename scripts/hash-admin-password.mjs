#!/usr/bin/env node
/**
 * Generates bcrypt hash + session secret for Render / .env.local.
 * Usage:
 *   npm run admin:hash-password
 *   npm run admin:hash-password -- "your-password"
 */
import crypto from "node:crypto";

import bcrypt from "bcryptjs";

const rounds = 12;

function randomPassword(length = 24) {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_-+.";
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

const arg = process.argv.slice(2).join(" ").trim();
const plain = arg || randomPassword();
const hash = bcrypt.hashSync(plain, rounds);
const sessionSecret = crypto.randomBytes(32).toString("hex");

console.log("\n--- Copy once; store the hash + secrets in env (never commit plain password) ---\n");
if (arg) {
  console.log("Using password from command line (do not log this in CI).\n");
} else {
  console.log("Plain password (save in a password manager, then discard from logs):\n");
  console.log(plain);
}
const hashB64 = Buffer.from(hash, "utf8").toString("base64");

console.log("\n--- Add to Render / .env.local ---\n");
console.log(`ADMIN_EMAIL=admin@syntraa.com`);
console.log(`# Prefer on Render (avoids $ mangling in env UI):`);
console.log(`ADMIN_PASSWORD_HASH_BASE64=${hashB64}`);
console.log(`# Or if your host preserves $ characters:`);
console.log(`# ADMIN_PASSWORD_HASH=${hash}`);
console.log(`ADMIN_SESSION_SECRET=${sessionSecret}`);
console.log("\nProduction: remove ADMIN_PASSWORD if present; login uses hash (raw or BASE64) only.\n");
