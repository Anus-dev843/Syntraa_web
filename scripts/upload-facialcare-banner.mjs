import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import cloudinaryPkg from "cloudinary";

const cloudinary = cloudinaryPkg.v2;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim().replace(/^@/, ""),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  secure: true,
});

const img = path.join(
  __dirname,
  "..",
  "Syntraa MockUp",
  "Facial's",
  "A_cinematic_luxury_skincare_product_202605080515.jpeg",
);

const buf = readFileSync(img);
const dataUri = `data:image/jpeg;base64,${buf.toString("base64")}`;

const uploaded = await cloudinary.uploader.upload(dataUri, {
  folder: "syntraa/categories",
  public_id: "facialcare-cover",
  overwrite: true,
  use_filename: false,
  unique_filename: false,
});

console.log(uploaded.secure_url);
