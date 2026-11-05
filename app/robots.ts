import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { PUBLIC_HOSTS, PUBLIC_ORIGINS, publicIndexingEnabled } from "@/core/config/public-origins";

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (process.env.VERCEL_ENV === "preview") return { rules: { userAgent: "*", disallow: "/" } };
  const requestHeaders = await headers();
  const host = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "").split(":")[0].toLowerCase();
  if (!publicIndexingEnabled) return { rules: { userAgent: "*", disallow: "/" } };
  const isLfPrinter = host === PUBLIC_HOSTS.lfPrinter || host === `www.${PUBLIC_HOSTS.lfPrinter}`;
  return isLfPrinter
    ? { rules: { userAgent: "*", allow: ["/", "/productos/", "/seguimiento", "/tu-reset-gratis/"], disallow: ["/api/", "/business/", "/laex/", "/laboratorio/"] }, sitemap: `${PUBLIC_ORIGINS.lfPrinter}/sitemap.xml` }
    : { rules: { userAgent: "*", allow: ["/", "/market/", "/methodology", "/promote/", "/proyectos/"], disallow: ["/api/", "/business/", "/laex/", "/laboratorio/", "/settings", "/configuracion", "/profile", "/perfil"] }, sitemap: `${PUBLIC_ORIGINS.laex}/sitemap.xml` };
}
