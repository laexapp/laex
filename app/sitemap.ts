import type { MetadataRoute } from "next";
import { marketCatalog } from "@/modules/market-intelligence/domain";
export default function sitemap():MetadataRoute.Sitemap{const base="https://laex.vercel.app";return [{url:`${base}/market`,changeFrequency:"daily",priority:1},{url:`${base}/methodology`,changeFrequency:"monthly",priority:.8},{url:`${base}/promote`,changeFrequency:"monthly",priority:.7},{url:`${base}/promote/packages`,changeFrequency:"monthly",priority:.6},...marketCatalog.map(asset=>({url:`${base}/market/${asset.slug}`,changeFrequency:"daily" as const,priority:.8}))];}
