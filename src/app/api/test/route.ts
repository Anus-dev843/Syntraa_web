import { NextResponse } from "next/server";

import { getUsersCollection } from "@/lib/db";

export const runtime = "nodejs";

/**
 * GET /api/test — connects (reuses client), inserts a sample row into `syntraa.users`.
 * For smoke-testing only; remove or protect before public production if undesired.
 */
export async function GET() {
  try {
    const users = await getUsersCollection();
    const result = await users.insertOne({
      name: "Test User",
      createdAt: new Date(),
    });

    return NextResponse.json({
      ok: true,
      database: "syntraa",
      collection: "users",
      message: "Sample document inserted.",
      insertedId: result.insertedId.toString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status =
      message.includes("MongoDB URI is not set") || message.includes("MONGODB_URI")
        ? 503
        : 500;
    console.error("[api/test]", error);
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
