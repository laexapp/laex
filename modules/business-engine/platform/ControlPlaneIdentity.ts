import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const CONTROL_COOKIE = "laex_control_session";
const configured = (name: "LAEX_CONTROL_PLANE_SECRET" | "LAEX_CONTROL_PLANE_PASSWORD") => process.env[name]?.trim() || undefined;
const explicitDevelopmentFallback = (requested: boolean) => requested && process.env.NODE_ENV !== "production" && process.env.BUSINESS_ALLOW_INSECURE_LOCAL_FALLBACK === "true" && !process.env.BUSINESS_DATABASE_URL;
const secret = (allowLocalFallback = false) => configured("LAEX_CONTROL_PLANE_SECRET") ?? (explicitDevelopmentFallback(allowLocalFallback) ? "laex-control-local-secret-change-me-2026" : "");
const password = (allowLocalFallback = false) => configured("LAEX_CONTROL_PLANE_PASSWORD") ?? (explicitDevelopmentFallback(allowLocalFallback) ? "LAEX-Control-2026!" : "");

export function authenticateControl(input: string, allowLocalFallback = false) {
  const expected = password(allowLocalFallback);
  const signingSecret = secret(allowLocalFallback);
  if (!expected || !signingSecret || input !== expected) throw new Error("invalid_control_credentials");
  const body = Buffer.from(JSON.stringify({ role: "laex-platform-admin", exp: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  return `${body}.${createHmac("sha256", signingSecret).update(body).digest("base64url")}`;
}

export function requireControl(token?: string, allowLocalFallback = false) {
  try {
    const signingSecret = secret(allowLocalFallback);
    if (!signingSecret || !token) throw new Error();
    const [body, signature] = token.split(".");
    const expected = createHmac("sha256", signingSecret).update(body).digest();
    const supplied = Buffer.from(signature, "base64url");
    if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) throw new Error();
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { role?: string; exp?: number };
    if (!data.exp || data.exp < Date.now() || data.role !== "laex-platform-admin") throw new Error();
    return true;
  } catch {
    throw new Error("control_authentication_required");
  }
}
