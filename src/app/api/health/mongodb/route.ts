import { NextResponse } from "next/server";

import { getMongoHealthPayload } from "@/lib/mongo-health-status";

/**
 * Same JSON as GET `/api/health?mongo=1` — kept so bookmarks work after deploy includes this file.
 */
export async function GET() {
  const body = await getMongoHealthPayload();
  return NextResponse.json(body, { status: 200 });
}
