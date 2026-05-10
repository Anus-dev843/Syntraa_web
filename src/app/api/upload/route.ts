import { Readable } from "node:stream";

import { NextResponse, type NextRequest } from "next/server";

import { hasValidAdminSession } from "@/lib/admin-session";
import { cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export const runtime = "nodejs";

function uploadBufferStream(
  buffer: Buffer,
): Promise<{ secure_url: string; public_id: string; width?: number; height?: number }> {
  return new Promise((resolve, reject) => {
    /** Cloudinary v2: options object first, then callback (see `v1_adapter` in their SDK). */
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "syntraa/products",
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        const secureUrl = result?.secure_url;
        if (!secureUrl) {
          reject(new Error("Upload returned no secure_url."));
          return;
        }
        resolve({
          secure_url: secureUrl,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
        });
      },
    );
    Readable.from(buffer).pipe(stream);
  });
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function POST(request: NextRequest) {
  if (!(await hasValidAdminSession(request))) {
    return unauthorized();
  }
  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Set CLOUDINARY_* env vars." },
      { status: 503 },
    );
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Missing file field `file`." }, { status: 400 });
    }

    const maxBytes = 12 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ error: "File too large (max 12MB)." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type || "";
    if (mime && !mime.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image uploads are supported (e.g. JPEG, PNG, WebP)." },
        { status: 400 },
      );
    }

    const uploaded = await uploadBufferStream(buffer);

    return NextResponse.json({
      secure_url: uploaded.secure_url,
      public_id: uploaded.public_id,
      width: uploaded.width,
      height: uploaded.height,
    });
  } catch (e: unknown) {
    let message = "Upload failed.";
    if (e && typeof e === "object") {
      const o = e as { message?: string; http_code?: number; error?: { message?: string } };
      if (typeof o.message === "string" && o.message.trim()) {
        message = o.message.trim();
      } else if (o.error && typeof o.error.message === "string") {
        message = o.error.message.trim();
      }
    } else if (e instanceof Error && e.message.trim()) {
      message = e.message.trim();
    }
    const lower = message.toLowerCase();
    const status =
      lower.includes("401") ||
      lower.includes("403") ||
      lower.includes("invalid api") ||
      lower.includes("api_key")
        ? 502
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
