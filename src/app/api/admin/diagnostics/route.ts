import { NextResponse, type NextRequest } from "next/server";

import { hasValidAdminSession } from "@/lib/admin-auth";
import { getAdminDiagnosticsPayload } from "@/lib/admin-diagnostics";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!(await hasValidAdminSession(request))) {
    return unauthorized();
  }
  try {
    const body = await getAdminDiagnosticsPayload();
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: "Diagnostics failed." }, { status: 500 });
  }
}
