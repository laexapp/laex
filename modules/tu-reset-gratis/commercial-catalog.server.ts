import "server-only";
import { resetModels } from "./catalog";
import { commercialSolutions, type CommercialSolutionKind } from "./commercial-solutions";
import { getPublicCommercialPrice } from "./commercial-pricing.server";
import type { CommercialFeaturedCandidate, PublicCommercialModelRow, PublicCommercialOffer } from "./commercial-public";

const typeLabels: Record<CommercialSolutionKind, string> = {
  reset_key: "Clave de reset",
  adjustment_program: "Programa de ajuste",
  chipless_firmware: "Firmware chipless",
};

export function getPublicCommercialOffersForModel(modelCode: string): PublicCommercialOffer[] {
  return commercialSolutions.filter((solution) => solution.modelCodes.includes(modelCode)).map((solution, index) => {
    const price = getPublicCommercialPrice(solution.id);
    return {
      id: `commercial-${index + 1}`,
      displayName: solution.publicName,
      kind: solution.kind,
      priceUsd: price.priceUsd,
      priceLabel: price.priceLabel,
      availabilityLabel: "Consultar disponibilidad",
      legalNote: "Antes de vender, LF-PRINTER confirmará la compatibilidad, el titular/licencia y las condiciones aplicables.",
    };
  });
}

export function getPublicCommercialModelRows(): PublicCommercialModelRow[] {
  return resetModels.flatMap((model) => {
    const offers = getPublicCommercialOffersForModel(model.code);
    if (!offers.length) return [];
    const knownPrices = offers.map((offer) => offer.priceUsd).filter((price): price is number => price !== null);
    return [{
      slug: model.slug, code: model.code, model: model.model, brand: model.brand, family: model.family,
      kindLabels: Array.from(new Set(offers.map((offer) => typeLabels[offer.kind]))),
      solutionCount: offers.length,
      priceLabel: knownPrices.length ? `Desde US$${Math.min(...knownPrices).toFixed(2)}` : "Consultar precio",
      availabilityLabel: "Consultar disponibilidad",
    }];
  });
}

// Selection proposed for CEO review. These product references are active on
// Epson sources and each exact model is linked to a provider-announced tool.
const proposedCommercialFeatured2026 = [
  { slug: "epson-l3250", reason: "EcoTank que Epson mantiene en su catálogo regional para hogar y pequeños negocios.", evidence: "https://epson.com.do/Para-el-hogar/Impresoras/Inyecci%C3%B3n-de-tinta/Impresora-Multifuncional-Inl%C3%A1mbrica-EcoTank-L3250/p/C11CJ67301" },
  { slug: "epson-l4260", reason: "EcoTank con dúplex automático que Epson mantiene en el catálogo regional.", evidence: "https://epson.com.do/Para-el-trabajo/Impresoras/Inyecci%C3%B3n-de-Tinta/Impresora-multifuncional-Epson-EcoTank-L4260/p/C11CJ63301" },
  { slug: "epson-l5590", reason: "EcoTank de negocio que Epson presenta en su línea actual y como reemplazo regional de la L5290.", evidence: "https://epson.com.do/ecotank-pro" },
  { slug: "epson-wf-c5890", reason: "WorkForce Pro que Epson mantiene para flujos de oficina de alto volumen.", evidence: "https://epson.com.do/Para-el-trabajo/Impresoras/Inyecci%C3%B3n-de-Tinta/Impresora-WorkForce-Pro-WF-C5890/p/C11CK23301" },
  { slug: "epson-xp-4205", reason: "Expression Home aún listado por Epson y relacionado con una referencia de firmware anunciada.", evidence: "https://epson.com/Support/Printers/All-In-Ones/XP-Series/Epson-XP-4205/s/SPT_C11CK65205" },
];

export function getCommercialFeaturedCandidates2026(): CommercialFeaturedCandidate[] {
  return proposedCommercialFeatured2026.flatMap((entry) => {
    const model = resetModels.find((item) => item.slug === entry.slug);
    if (!model || !getPublicCommercialOffersForModel(model.code).length) return [];
    return [{ slug: model.slug, model: model.model, family: model.family, reason: entry.reason, image: null, photoLabel: "Fotografía pendiente de procedencia y autorización" }];
  });
}
