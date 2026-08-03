import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { MEDIA_SESSION_COOKIE, type DevelopmentActor } from "./development-session";

const secret = process.env.MEDIA_DEV_SESSION_SECRET ?? "laex-local-emulator-session-not-for-production";

export async function requireControlledDevelopmentActor(): Promise<DevelopmentActor> {
  if (process.env.NODE_ENV !== "development") throw new Error("local_adapter_disabled");
  const value = (await cookies()).get(MEDIA_SESSION_COOKIE)?.value;
  if (!value) throw new Error("authentication_required");
  const [payload, supplied] = value.split(".");
  if (!payload || !supplied) throw new Error("authentication_required");
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const left = Buffer.from(supplied), right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) throw new Error("authentication_required");
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as DevelopmentActor & { expiresAt: number };
    if (!decoded.userId || decoded.expiresAt <= Date.now()) throw new Error("authentication_required");
    return { userId: decoded.userId, name: decoded.name };
  } catch { throw new Error("authentication_required"); }
}
