import { type NextRequest, NextResponse } from "next/server";

import { getMongoHealthPayload } from "@/lib/mongo-health-status";

/** Lightweight check for load balancers (e.g. Render health checks). No DB or env required. */
/** With `?mongo=1`: Mongo env + connectivity + Product count — same payload as `/api/health/mongodb`. */
export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("mongo") === "1") {
    const body = await getMongoHealthPayload();
    return NextResponse.json(body, { status: 200 });
  }

  return NextResponse.json(
    { ok: true, service: "syntraa", time: new Date().toISOString() },
    { status: 200 },
  );
}
