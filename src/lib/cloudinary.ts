import "server-only";
import { v2 as cloudinary } from "cloudinary";

/**
 * Set in `.env.local` / host env (Cloudinary dashboard → API Keys):
 * CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *
 * Server-only: use from Route Handlers and server modules only.
 */

function readCredentials() {
  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  };
}

export function isCloudinaryConfigured(): boolean {
  const { cloud_name, api_key, api_secret } = readCredentials();
  return Boolean(cloud_name && api_key && api_secret);
}

export function requireCloudinary(): void {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary missing: set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in the environment.",
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
