/**
 * One-off: upload image to Cloudinary + insert Product in MongoDB.
 * Run from repo root: node --env-file=.env.local scripts/add-syntraa-shampoo.mjs
 *
 * If MongoDB fails from TLS/DNS locally, Cloudinary-only + paste URL into admin works:
 *   node --env-file=.env.local -e "...upload..."  (see package script if added)
 *
 * Skip upload reuse URL: SYNTRAA_PRODUCT_IMAGE_URL="https://..." node --env-file=.env.local scripts/add-syntraa-shampoo.mjs
 */
import dns from "node:dns";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import cloudinaryPkg from "cloudinary";
import mongoose from "mongoose";

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const cloudinary = cloudinaryPkg.v2;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, lowercase: true },
    image: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    featured: { type: Boolean, default: false },
    currency: { type: String, default: "USD", trim: true },
    shortDescription: { type: String, default: "", trim: true },
    ingredients: { type: [String], default: [] },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

async function uniqueSlug(base) {
  let candidate = base || "product";
  for (let i = 0; i < 12; i += 1) {
    const existing = await Product.findOne({ slug: candidate }).lean();
    if (!existing) {
      return candidate;
    }
    candidate = `${base}-${Math.random().toString(36).slice(2, 7)}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

function configCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim().replace(/^@/, "");
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (cloud_name && api_key && api_secret) {
    cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
    return;
  }
  const raw = process.env.CLOUDINARY_URL?.trim();
  if (raw?.startsWith("cloudinary://")) {
    try {
      const u = new URL(raw);
      cloudinary.config({
        cloud_name: u.hostname?.replace(/^@/, "") || "",
        api_key: decodeURIComponent(u.username || ""),
        api_secret: decodeURIComponent(u.password || ""),
        secure: true,
      });
      return;
    } catch {
      /* fall through */
    }
  }
  throw new Error("Cloudinary env missing (CLOUDINARY_* or CLOUDINARY_URL).");
}

async function main() {
  const mongoUri = process.env.MONGODB_URI?.trim();
  if (!mongoUri) {
    throw new Error("MONGODB_URI not set.");
  }

  let imageUrl = process.env.SYNTRAA_PRODUCT_IMAGE_URL?.trim();
  const skipUpload =
    typeof imageUrl === "string" && imageUrl.startsWith("https://");

  if (!skipUpload) {
    configCloudinary();

    const imagePath = path.join(
      __dirname,
      "..",
      "Syntraa MockUp",
      "Hair care",
      "Ultra-realistic_luxury_haircare_product_photograph_202605080509.jpeg",
    );

    const buf = readFileSync(imagePath);
    const mime = "image/jpeg";
    const dataUri = `data:${mime};base64,${buf.toString("base64")}`;

    const uploaded = await cloudinary.uploader.upload(dataUri, {
      folder: "syntraa/products",
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
    });
    imageUrl = uploaded.secure_url;
    if (!imageUrl?.startsWith("https://")) {
      throw new Error("Cloudinary did not return https secure_url.");
    }
  }

  await mongoose.connect(mongoUri, {
    dbName: "syntraa",
    autoSelectFamily: false,
    family: 4,
  });

  const name =
    "Sulfate Free Shampoo for Smooth & healthy Hair | SYNTRAA";
  const description =
    "A premium sulfate-free shampoo that gently cleanses the scalp while maintaining natural moisture, Helps reduce frizz, dandruff, and excess oil for softer, smoother, and healthier-looking hair after every wash.";
  const category = "shampoo";
  const price = 24.99;
  const baseSlug = slugify(name);
  const slug = await uniqueSlug(baseSlug);
  const shortDescription =
    description.length > 160 ? `${description.slice(0, 157)}…` : description;

  const doc = await Product.create({
    name,
    price,
    description,
    category,
    image: imageUrl,
    slug,
    featured: false,
    currency: "USD",
    shortDescription,
    ingredients: [],
    rating: 4.5,
  });

  console.log("Created product:", doc._id.toString(), slug, imageUrl);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
