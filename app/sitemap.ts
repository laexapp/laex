import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { marketCatalog } from "@/modules/market-intelligence/domain";
import { getLFPrinterCommerceCatalog } from "@/modules/lf-printer/infrastructure/commerce-public";
import { resetModels } from "@/modules/tu-reset-gratis/catalog";
import { firmwareListings } from "@/modules/tu-reset-gratis/firmwares";
import { PUBLIC_HOSTS, PUBLIC_ORIGINS, publicIndexingEnabled } from "@/core/config/public-origins";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!publicIndexingEnabled || process.env.VERCEL_ENV === "preview") return [];
  const requestHeaders = await headers();
  const host = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "").split(":")[0].toLowerCase();
  if (host === PUBLIC_HOSTS.lfPrinter || host === `www.${PUBLIC_HOSTS.lfPrinter}`) {
    const catalog = await getLFPrinterCommerceCatalog();
    return [
      { url: PUBLIC_ORIGINS.lfPrinter, changeFrequency: "daily", priority: 1 },
      { url: `${PUBLIC_ORIGINS.lfPrinter}/seguimiento`, changeFrequency: "monthly", priority: .5 },
      { url: `${PUBLIC_ORIGINS.lfPrinter}/tu-reset-gratis`, changeFrequency: "weekly", priority: .8 },
      { url: `${PUBLIC_ORIGINS.lfPrinter}/tu-reset-gratis/firmwares`, changeFrequency: "weekly", priority: .8 },
      ...resetModels.map((model) => ({ url: `${PUBLIC_ORIGINS.lfPrinter}/tu-reset-gratis/${model.slug}`, changeFrequency: "monthly" as const, priority: .6 })),
      ...firmwareListings.map((item) => ({ url: `${PUBLIC_ORIGINS.lfPrinter}/tu-reset-gratis/firmwares/${item.slug}`, changeFrequency: "monthly" as const, priority: .5 })),
      ...catalog.products.map((product) => ({ url: `${PUBLIC_ORIGINS.lfPrinter}/productos/${product.slug}`, changeFrequency: "daily" as const, priority: .8 })),
    ];
  }
  return [
    { url: PUBLIC_ORIGINS.laex, changeFrequency: "weekly", priority: 1 },
    { url: `${PUBLIC_ORIGINS.laex}/guias`, changeFrequency: "monthly", priority: .8 },
    { url: `${PUBLIC_ORIGINS.laex}/guias/onemillionminers/activar`, changeFrequency: "monthly", priority: .8 },
    { url: `${PUBLIC_ORIGINS.laex}/guias/safepal/descargar`, changeFrequency: "monthly", priority: .7 },
    { url: `${PUBLIC_ORIGINS.laex}/proyectos`, changeFrequency: "weekly", priority: .9 },
    { url: `${PUBLIC_ORIGINS.laex}/proyectos/onemillionminers`, changeFrequency: "weekly", priority: .8 },
    { url: `${PUBLIC_ORIGINS.laex}/market`, changeFrequency: "daily", priority: .8 },
    { url: `${PUBLIC_ORIGINS.laex}/methodology`, changeFrequency: "monthly", priority: .7 },
    ...marketCatalog.map((asset) => ({ url: `${PUBLIC_ORIGINS.laex}/market/${asset.slug}`, changeFrequency: "daily" as const, priority: .7 })),
  ];
}
