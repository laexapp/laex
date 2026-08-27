import { NextResponse } from "next/server";
import { isOmdbAssetSlug } from "@/modules/project/pages/OMDB/assets";
import { getBlockchainIntelligence } from "@/modules/project/pages/OMDB/server/blockchain-intelligence";

export async function GET(request: Request) {
  const asset = new URL(request.url).searchParams.get("asset") ?? "omdb";
  if (!isOmdbAssetSlug(asset)) return NextResponse.json({ error: "asset_not_supported" }, { status: 400 });
  const snapshot = await getBlockchainIntelligence(asset);
  return NextResponse.json(snapshot, {
    status: snapshot.state === "UNAVAILABLE" ? 503 : 200,
    headers: { "Cache-Control": "public, s-maxage=20, stale-while-revalidate=120" },
  });
}
