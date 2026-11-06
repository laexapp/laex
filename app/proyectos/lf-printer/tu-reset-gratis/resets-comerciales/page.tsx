import type { Metadata } from "next";
import { PUBLIC_ORIGINS, publicIndexingEnabled } from "@/core/config/public-origins";
import { CommercialResetsCatalog } from "@/modules/tu-reset-gratis/CommercialResetsCatalog";

export const metadata: Metadata = {
  title: "Resets Comerciales · LF-PRINTER",
  description: "Consulta soluciones comerciales de reset por modelo con LF-PRINTER.",
  alternates: { canonical: `${PUBLIC_ORIGINS.lfPrinter}/tu-reset-gratis/resets-comerciales` },
  robots: { index: publicIndexingEnabled, follow: publicIndexingEnabled },
};

export default function CommercialResetsPage() { return <CommercialResetsCatalog />; }
