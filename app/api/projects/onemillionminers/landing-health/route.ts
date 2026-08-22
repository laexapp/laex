import { ONE_MILLION_MINERS_OFFICIAL_LANDING } from "@/modules/project/pages/OneMillionMiners/official-landing";

export const dynamic = "force-dynamic";

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetch(ONE_MILLION_MINERS_OFFICIAL_LANDING.landingUrl, {
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
    });
    const xFrameOptions = response.headers.get("x-frame-options")?.toLowerCase() ?? "";
    const contentSecurityPolicy = response.headers.get("content-security-policy")?.toLowerCase() ?? "";
    const blocksEmbedding = xFrameOptions.includes("deny")
      || xFrameOptions.includes("sameorigin")
      || /frame-ancestors\s+[^;]*(?:'none'|'self')/.test(contentSecurityPolicy);

    return Response.json(
      { available: response.ok, embeddable: response.ok && !blocksEmbedding },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return Response.json(
      { available: false, embeddable: false },
      { headers: { "cache-control": "no-store" } },
    );
  } finally {
    clearTimeout(timeout);
  }
}
