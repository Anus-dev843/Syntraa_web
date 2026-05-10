import "server-only";
import { v2 as cloudinary } from "cloudinary";

/**
 * Set in `.env.local` / host env:
 * - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, or
 * - `CLOUDINARY_URL` (e.g. `cloudinary://API_KEY:API_SECRET@cloud_name`)
 *
 * Explicit `CLOUDINARY_*` vars override matching parts parsed from `CLOUDINARY_URL`.
 * Leading `@` on cloud name (dashboard UI) is stripped.
 *
 * Server-only: use from Route Handlers and server modules only.
 */

function normalizeCloudName(name: string | undefined): string | undefined {
  if (!name) {
    return undefined;
  }
  const t = name.trim();
  if (!t) {
    return undefined;
  }
  return t.startsWith("@") ? t.slice(1) : t;
}

function parseCloudinaryUrl(raw: string | undefined): {
  cloud_name?: string;
  api_key?: string;
  api_secret?: string;
} {
  const s = raw?.trim();
  if (!s?.startsWith("cloudinary://")) {
    return {};
  }
  try {
    const url = new URL(s);
    if (url.protocol !== "cloudinary:") {
      return {};
    }
    const api_key =
      decodeURIComponent(url.username || "") || undefined;
    const api_secret =
      decodeURIComponent(url.password || "") || undefined;
    const cloud_name = normalizeCloudName(url.hostname || undefined);
    return { cloud_name, api_key, api_secret };
  } catch {
    return {};
  }
}

function readCredentials() {
  const fromUrl = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
  const rawKey = process.env.CLOUDINARY_API_KEY?.trim();
  /** Paste typo `-1234567` — Cloudinary API keys are never negative. */
  const api_key = rawKey && /^-\d+$/.test(rawKey) ? rawKey.slice(1) : rawKey;
  const explicit = {
    cloud_name: normalizeCloudName(process.env.CLOUDINARY_CLOUD_NAME),
    api_key,
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  };

  return {
    cloud_name: explicit.cloud_name ?? fromUrl.cloud_name,
    api_key: explicit.api_key ?? fromUrl.api_key,
    api_secret: explicit.api_secret ?? fromUrl.api_secret,
  };
}

export function isCloudinaryConfigured(): boolean {
  const { cloud_name, api_key, api_secret } = readCredentials();
  return Boolean(cloud_name && api_key && api_secret);
}

export function requireCloudinary(): void {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary missing: set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, or CLOUDINARY_URL in the environment.",
    );
  }
}

const creds = readCredentials();
if (creds.cloud_name && creds.api_key && creds.api_secret) {
  cloudinary.config({
    cloud_name: creds.cloud_name,
    api_key: creds.api_key,
    api_secret: creds.api_secret,
    secure: true,
  });
}

export { cloudinary };

/** Public delivery URLs ke liye cloud name (secret nahi). */
export function getCloudinaryCloudName(): string | undefined {
  return readCredentials().cloud_name;
}
