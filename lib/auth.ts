import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "dkb_admin_session";

function getSecret() {
  return process.env.DKB_SESSION_SECRET || process.env.DKB_ADMIN_PASSWORD || "";
}

function expectedToken() {
  const secret = getSecret();
  if (!secret) return "";
  return createHmac("sha256", secret)
    .update("dil-ki-baat-admin-session:v1")
    .digest("hex");
}

export function isAdminAuthenticated() {
  const token = cookies().get(COOKIE_NAME)?.value || "";
  const expected = expectedToken();
  if (!token || !expected || token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}

export function getSessionToken() {
  return expectedToken();
}

export function isAdminPasswordConfigured() {
  return Boolean(process.env.DKB_ADMIN_PASSWORD);
}
