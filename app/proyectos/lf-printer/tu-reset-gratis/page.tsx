import type { Metadata } from "next";
import { PUBLIC_ORIGINS, publicIndexingEnabled } from "@/core/config/public-origins";
import { TuResetCatalog } from "@/modules/tu-reset-gratis/TuResetCatalog";

export const metadata: Metadata = {
  title: "Tu Reset Gratis · LF-PRINTER",
  description: "Busca tu impresora y encuentra guías de mantenimiento y herramientas verificadas por LF-PRINTER.",
  alternates: { canonical: `${PUBLIC_ORIGINS.lfPrinter}/tu-reset-gratis` },
  robots: { index: publicIndexingEnabled, follow: publicIndexingEnabled },
};

export default function TuResetGratisPage() { return <TuResetCatalog/>; }
