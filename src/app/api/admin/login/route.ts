import { NextResponse } from "next/server";

export const runtime = "nodejs";

import {
  isAdminPasswordConfigured,
  verifyAdminCredentials,
} from "@/lib/admin-credentials";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
} from "@/lib/admin-session";

type LoginPayload = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    if (process.env.NODE_ENV === "production" && !isAdminPasswordConfigured()) {
      return NextResponse.json(
        {
          error:
            "Admin bcrypt hash missing on server. Render → Environment: add ADMIN_PASSWORD_HASH_BASE64 = one-line value from `.env.example` (no wrapping quotes). Save, then Deploy. Troubleshoot: GET /api/health?admin=1",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as LoginPayload;
    const email = body.email ?? "";
    const password = body.password ?? "";

    if (!(await verifyAdminCredentials(email, password))) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const token = await createAdminSessionToken();
    if (!token) {
      return NextResponse.json(
        {
          error:
            "Admin session is not configured. Set ADMIN_SESSION_SECRET in production (see .env.example).",
        },
        { status: 503 },
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
