import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
export const MEDIA_SESSION_COOKIE = "laex_media_dev_session";
const developmentSecret = process.env.MEDIA_DEV_SESSION_SECRET ?? "laex-local-emulator-session-not-for-production";
export interface DevelopmentActor { userId: string; name: string; }
const signature = (value: string) => createHmac("sha256", developmentSecret).update(value).digest("base64url");
export function createDevelopmentSession(actor: DevelopmentActor) { if (process.env.NODE_ENV === "production") throw new Error("development_session_disabled"); const payload = Buffer.from(JSON.stringify({ ...actor, expiresAt: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url"); return `${payload}.${signature(payload)}`; }
export function verifyDevelopmentSession(value?: string): DevelopmentActor | null { if (!value) return null; const [payload, supplied] = value.split("."); if (!payload || !supplied) return null; const expected = signature(payload), a = Buffer.from(supplied), b = Buffer.from(expected); if (a.length !== b.length || !timingSafeEqual(a, b)) return null; try { const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as DevelopmentActor & { expiresAt: number }; return decoded.expiresAt > Date.now() && decoded.userId ? { userId: decoded.userId, name: decoded.name } : null; } catch { return null; } }
export async function requireDevelopmentActor() { const store = await cookies(); const actor = verifyDevelopmentSession(store.get(MEDIA_SESSION_COOKIE)?.value); if (!actor) throw new Error("authentication_required"); return actor; }
