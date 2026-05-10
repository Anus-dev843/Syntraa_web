#!/usr/bin/env node
/**
 * Generates a strong random password and bcrypt hash for Render / .env.local.
 * Usage: node scripts/hash-admin-password.mjs
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

const plain = randomPassword();
const hash = bcrypt.hashSync(plain, rounds);
const sessionSecret = crypto.randomBytes(32).toString("hex");

console.log("\n--- Copy once; store the hash + secrets in env (never commit plain password) ---\n");
console.log("Plain password (save in a password manager, then discard from logs):\n");
console.log(plain);
console.log("\n--- Add to Render / .env.local ---\n");
console.log(`ADMIN_EMAIL=admin@syntraa.com`);
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log(`ADMIN_SESSION_SECRET=${sessionSecret}`);
console.log("\nProduction: remove ADMIN_PASSWORD if present; login uses ADMIN_PASSWORD_HASH only.\n");
