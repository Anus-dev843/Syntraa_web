import { NextResponse } from "next/server";

/** Lightweight check for load balancers (e.g. Render health checks). No DB or env required. */
export async function GET() {
  return NextResponse.json(
    { ok: true, service: "syntraa", time: new Date().toISOString() },
    { status: 200 },
  );
}
