import { LF_PRINTER_CONTACT } from "@/modules/lf-printer/config/quick-actions";
import type { CommercialSolutionKind } from "./commercial-solutions";

export type PublicCommercialOffer = {
  id: string;
  displayName: string;
  kind: CommercialSolutionKind;
  priceUsd: number | null;
  priceLabel: string;
  availabilityLabel: string;
  legalNote: string;
};

export type PublicCommercialModelRow = {
  slug: string;
  code: string;
  model: string;
  brand: string;
  family: string;
  kindLabels: string[];
  solutionCount: number;
  priceLabel: string;
  availabilityLabel: string;
};

export type CommercialFeaturedCandidate = { slug: string; model: string; family: string; reason: string; image: null; photoLabel: string };

const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

export function filterPublicCommercialModelRows(rows: PublicCommercialModelRow[], options: { query?: string; brand?: string; kind?: string } = {}) {
  const query = normalize(options.query ?? "");
  return rows.filter((row) => {
    const queryMatches = !query || normalize(`${row.model} ${row.code} ${row.brand} ${row.family} ${row.kindLabels.join(" ")}`).includes(query);
    const brandMatches = !options.brand || options.brand === "Todas las marcas" || row.brand === options.brand;
    const kindMatches = !options.kind || options.kind === "Todos los tipos" || row.kindLabels.includes(options.kind);
    return queryMatches && brandMatches && kindMatches;
  });
}

export function buildCommercialModelWhatsAppUrl(model: string, offerName: string) {
  const message = `Hola, LF-PRINTER. Quiero consultar ${offerName} para mi impresora ${model}. Por favor confirmen compatibilidad, disponibilidad, precio LF-PRINTER y condiciones de licencia y entrega antes de cualquier compra.`;
  return `https://wa.me/${LF_PRINTER_CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
