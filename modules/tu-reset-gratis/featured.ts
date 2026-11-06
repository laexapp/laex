export type FeaturedPrinter = {
  year: number;
  slug: string;
  model: string;
  segment: "Hogar y estudio" | "Emprendimiento" | "Oficina" | "Empresa";
  reason: string;
  sourceUrl: string;
  photoStatus: "rights_pending";
};

// Draft only: recommendations are visible in preview for CEO review, not an approved ranking.
// No photo is shown until both model provenance and image rights have been recorded.
export const featuredPrintersByYear: Record<number, FeaturedPrinter[]> = {
  2026: [
    { year: 2026, slug: "epson-l1250", model: "Epson L1250", segment: "Hogar y estudio", reason: "Aparece en la oferta regional de Epson para el hogar.", sourceUrl: "https://epson.com.do/vuelta-al-cole", photoStatus: "rights_pending" },
    { year: 2026, slug: "epson-l3250", model: "Epson L3250", segment: "Hogar y estudio", reason: "Epson mantiene una ficha regional de producto y lo incluye en su oferta de hogar.", sourceUrl: "https://epson.com.do/Para-el-hogar/Impresoras/Inyecci%C3%B3n-de-tinta/Impresora-Multifuncional-Inl%C3%A1mbrica-EcoTank-L3250/p/C11CJ67301", photoStatus: "rights_pending" },
    { year: 2026, slug: "epson-l3350", model: "Epson L3350", segment: "Hogar y estudio", reason: "Epson la lista entre sus EcoTank actuales para el hogar.", sourceUrl: "https://epson.com.do/ecotank-para-hogar", photoStatus: "rights_pending" },
    { year: 2026, slug: "epson-l1350", model: "Epson L1350", segment: "Hogar y estudio", reason: "Epson la lista como EcoTank inalámbrica actual para el hogar.", sourceUrl: "https://epson.com.do/ecotank-para-hogar", photoStatus: "rights_pending" },
    { year: 2026, slug: "epson-l4360", model: "Epson L4360", segment: "Emprendimiento", reason: "Figura en la línea EcoTank Pro regional, con dúplex automático.", sourceUrl: "https://epson.com.do/ecotank-pro", photoStatus: "rights_pending" },
    { year: 2026, slug: "epson-l5590", model: "Epson L5590", segment: "Emprendimiento", reason: "Figura en la línea regional de negocio con ADF, red y fax.", sourceUrl: "https://epson.com.do/ecotank-pro", photoStatus: "rights_pending" },
    { year: 2026, slug: "epson-l6370", model: "Epson L6370", segment: "Emprendimiento", reason: "Figura en la línea EcoTank Pro regional con ADF y dúplex.", sourceUrl: "https://epson.com.do/ecotank-pro", photoStatus: "rights_pending" },
    { year: 2026, slug: "epson-wf-c5890", model: "Epson WorkForce Pro WF-C5890", segment: "Oficina", reason: "Epson la ofrece en RD para flujos de oficina de alto volumen.", sourceUrl: "https://epson.com.do/workforce-pro", photoStatus: "rights_pending" },
    { year: 2026, slug: "epson-wf-m5899", model: "Epson WorkForce Pro WF-M5899", segment: "Oficina", reason: "Epson la mantiene en su oferta regional de impresión empresarial monocromática.", sourceUrl: "https://epson.com.do/workforce-pro", photoStatus: "rights_pending" },
    { year: 2026, slug: "epson-em-c8100", model: "Epson WorkForce Pro EM-C8100", segment: "Empresa", reason: "Epson la lista para operaciones empresariales de mayor volumen.", sourceUrl: "https://epson.com.do/workforce-pro", photoStatus: "rights_pending" },
  ],
};
