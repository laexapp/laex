import { LF_PRINTER_CONTACT } from "../config/quick-actions";

export type PublicOrderForWhatsapp = {
  publicId: string;
  customer: { name: string; phone: string };
  fulfillment?: "pickup" | "local-delivery" | "shipping";
  totalMinor: number;
  lines: Array<{
    publicName: string;
    quantity: number;
    totalMinor: number;
    deliverySnapshot?: { estimatedDelivery?: string; mode?: "in-stock" | "on-order" | "confirm-availability" };
  }>;
};

const money = new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 0 });
const deliveryMode = { "in-stock": "En existencia", "on-order": "Por encargo", "confirm-availability": "Consultar disponibilidad" } as const;

export function orderWhatsappMessage(order: PublicOrderForWhatsapp, paymentMethod?: string) {
  const products = order.lines.flatMap((line, index) => {
    const policy = line.deliverySnapshot;
    const modality = [policy?.mode ? deliveryMode[policy.mode] : undefined, policy?.estimatedDelivery].filter(Boolean).join(" · ");
    return [
      `Producto${order.lines.length > 1 ? ` ${index + 1}` : ""}: ${line.publicName}`,
      `Cantidad: ${line.quantity}`,
      `Importe: ${money.format(line.totalMinor / 100)}`,
      modality ? `Modalidad/plazo: ${modality}` : undefined,
    ].filter(Boolean) as string[];
  });
  const fulfillmentLabel={pickup:"Retiro en tienda","local-delivery":"Envío coordinado",shipping:"Envío"}[order.fulfillment??"pickup"];
  return ["Hola LF-PRINTER, quiero continuar con el pago de mi pedido.", "", `Pedido: ${order.publicId}`, `Cliente: ${order.customer.name}`, `Teléfono: ${order.customer.phone}`, "", ...products, "", `Total: ${money.format(order.totalMinor / 100)}`, `Entrega: ${fulfillmentLabel}`, paymentMethod ? `Método solicitado: ${paymentMethod}` : undefined, "", "Deseo coordinar la forma de pago."].filter((line): line is string => line !== undefined).join("\n");
}

export function orderWhatsappUrl(order: PublicOrderForWhatsapp, paymentMethod?: string) {
  return `https://wa.me/${LF_PRINTER_CONTACT.whatsappNumber}?text=${encodeURIComponent(orderWhatsappMessage(order, paymentMethod))}`;
}
