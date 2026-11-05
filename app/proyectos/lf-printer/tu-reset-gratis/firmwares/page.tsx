import type { Metadata } from "next";
import { PUBLIC_ORIGINS, publicIndexingEnabled } from "@/core/config/public-origins";
import { FirmwaresCatalog } from "@/modules/tu-reset-gratis/FirmwaresCatalog";

export const metadata: Metadata = {
  title: "Firmwares LF-PRINTER · Catálogo",
  description: "Consulta los firmwares LF-PRINTER disponibles por modelo. Entrega privada tras confirmar el pago.",
  alternates: { canonical: `${PUBLIC_ORIGINS.lfPrinter}/tu-reset-gratis/firmwares` },
  robots: { index: publicIndexingEnabled, follow: publicIndexingEnabled },
};

export default function FirmwaresPage() { return <FirmwaresCatalog/>; }
