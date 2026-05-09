/**
 * Upload local MockUp images to Cloudinary under syntraa/categories/*-cover.
 * Run: node --env-file=.env.local scripts/upload-category-banners.mjs
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import cloudinaryPkg from "cloudinary";

const cloudinary = cloudinaryPkg.v2;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function configCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim().replace(/^@/, "");
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (cloud_name && api_key && api_secret) {
    cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
    return;
  }
  throw new Error("Set CLOUDINARY_* in .env.local.");
}

function mimeFor(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

const JOBS = [
  {
    slug: "shampoo",
    publicId: "syntraa/categories/shampoo-cover",
    rel: ["Syntraa MockUp", "Hair care", "Ultra-realistic_luxury_haircare_product_photograph_202605080509.jpeg"],
  },
  {
    slug: "facewash",
    publicId: "syntraa/categories/facewash-cover",
    rel: [
      "Syntraa MockUp",
      "FaceCare",
      "Ultra-realistic_luxury_skincare_product_photograph_202605080519.jpeg",
    ],
  },
  {
    slug: "facialcare",
    publicId: "syntraa/categories/facialcare-cover",
    rel: [
      "Syntraa MockUp",
      "Facial's",
      "A_cinematic_luxury_skincare_product_202605080515.jpeg",
    ],
  },
  {
    slug: "serums",
    publicId: "syntraa/categories/serums-cover",
    rel: [
      "Syntraa MockUp",
      "Serum's",
      "Ultra-realistic_luxury_skincare_product_photograph_202605080500.jpeg",
    ],
  },
  {
    slug: "bodycare",
    publicId: "syntraa/categories/bodycare-cover",
    rel: [
      "Syntraa MockUp",
      "Body  care",
      "Ultra-realistic_luxury_body_wash_product_202605080512.jpeg",
    ],
  },
  {
    slug: "haircare",
    publicId: "syntraa/categories/haircare-cover",
    rel: ["Syntraa MockUp", "Hair care", "Ultra_realistic_luxury_product_photography_202605080319.jpeg"],
  },
];

async function main() {
  configCloudinary();
  const urls = {};

  for (const job of JOBS) {
    const abs = path.join(ROOT, ...job.rel);
    const buf = readFileSync(abs);
    const mime = mimeFor(abs);
    const dataUri = `data:${mime};base64,${buf.toString("base64")}`;

    const uploaded = await cloudinary.uploader.upload(dataUri, {
      folder: "",
      public_id: job.publicId,
      overwrite: true,
      resource_type: "image",
      use_filename: false,
      unique_filename: false,
    });
    urls[job.slug] = uploaded.secure_url;
    console.log(job.slug, uploaded.secure_url);
  }

  console.log("\nJSON for categories.json image fields:");
  console.log(JSON.stringify(urls, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
