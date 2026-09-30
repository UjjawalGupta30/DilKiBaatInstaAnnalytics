import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { getSessionCookieName, getSessionToken, isAdminPasswordConfigured } from "@/lib/auth";

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      { ok: false, message: "DKB_ADMIN_PASSWORD is not configured on the server." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";
  const expected = process.env.DKB_ADMIN_PASSWORD || "";

  if (!password || password.length !== expected.length || !timingSafeEqual(Buffer.from(password), Buffer.from(expected))) {
    return NextResponse.json({ ok: false, message: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: getSessionCookieName(),
    value: getSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
