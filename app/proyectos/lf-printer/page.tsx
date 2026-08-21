import { LFPrinterCommerceExperience } from "@/modules/lf-printer/components/LFPrinterCommerceExperience";
import { getLFPrinterCommerceCatalog } from "@/modules/lf-printer/infrastructure/commerce-public";
import { PUBLIC_ORIGINS, publicIndexingEnabled } from "@/core/config/public-origins";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "LF-PRINTER Commerce · Powered by LAEX",
  description: "Impresoras, tintas, repuestos y servicio técnico con disponibilidad actualizada.",
  alternates: { canonical: PUBLIC_ORIGINS.lfPrinter },
  robots: { index: publicIndexingEnabled, follow: publicIndexingEnabled },
};

export default async function LFPrinterPage() {
  const catalog = await getLFPrinterCommerceCatalog();
  return <main className="min-h-screen overflow-x-clip bg-[#f5f6f7] text-slate-950"><LFPrinterCommerceExperience initial={catalog}/></main>;
}
