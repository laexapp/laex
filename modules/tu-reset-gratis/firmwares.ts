export type FirmwareListing = {
  slug: string;
  title: string;
  brand: string;
  models: string[];
  category: string;
  image?: string;
  description: string;
  technicalNotes: string[];
  priceLabel: string;
  availabilityLabel: string;
  demoOnly: boolean;
};

// La ficha es demostrativa hasta revisar el archivo, los requisitos y su compatibilidad.
export const firmwareListings: FirmwareListing[] = [
  {
    slug: "epson-wf-4830-firmware",
    title: "Firmware Epson WF-4830",
    brand: "Epson",
    models: ["WF-4830"],
    category: "Firmware de impresora",
    image: "/assets/lf-printer/official/printers/wf-4830-hero.webp",
    description: "Ejemplo de ficha comercial. El archivo, sus requisitos y compatibilidad deben revisarse antes de anunciar disponibilidad.",
    technicalNotes: ["Versión: pendiente de inspección", "Requisitos: pendientes de validación", "Entrega privada después de confirmar el pago"],
    priceLabel: "DEMO · precio por configurar",
    availabilityLabel: "Revisión pendiente",
    demoOnly: true,
  },
];

export const getFirmwareListing = (slug: string) => firmwareListings.find((item) => item.slug === slug);

export function buildFirmwareWhatsAppUrl(item: FirmwareListing) {
  const message = `Hola, LF-PRINTER. Estoy interesado en consultar el firmware para la impresora ${item.brand} ${item.models.join(" / ")}. Quisiera conocer el precio, la disponibilidad y cómo realizar el pago. Estoy revisando la versión DEMO; entiendo que la entrega se hace en privado después de confirmar el pago.`;
  return `https://wa.me/18493581132?text=${encodeURIComponent(message)}`;
}
