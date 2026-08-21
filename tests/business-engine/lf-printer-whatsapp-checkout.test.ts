import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { orderWhatsappMessage, orderWhatsappUrl } from "../../modules/lf-printer/infrastructure/order-whatsapp";

describe("LF-PRINTER WhatsApp checkout handoff", () => {
  const order = {
    publicId: "WEB-A1B2C3D4",
    customer: { name: "Cliente de prueba", phone: "809-000-0000" },
    totalMinor: 68_500_00,
    lines: [{ publicName: "Epson WorkForce WF-7840", quantity: 1, totalMinor: 68_500_00, deliverySnapshot: { mode: "confirm-availability" as const, estimatedDelivery: "5–7 días" } }],
  };

  it("uses the official number and every server-confirmed public field", () => {
    const message = orderWhatsappMessage(order);
    assert.match(orderWhatsappUrl(order), /^https:\/\/wa\.me\/18493581132\?text=/);
    for (const value of ["WEB-A1B2C3D4", "Cliente de prueba", "809-000-0000", "Epson WorkForce WF-7840", "Cantidad: 1", "RD$68,500", "Consultar disponibilidad · 5–7 días", "Entrega: Retiro en tienda"]) assert.ok(message.includes(value), value);
  });

  it("only creates a deterministic handoff URL and performs no checkout request", () => {
    assert.equal(orderWhatsappUrl(order), orderWhatsappUrl(order));
  });

  it("adds the payment method selected from the footer without changing the order", () => {
    const message = orderWhatsappMessage(order, "Banco BHD");
    assert.match(message, /Método solicitado: Banco BHD/);
    assert.match(orderWhatsappUrl(order, "Banco BHD"), /^https:\/\/wa\.me\/18493581132\?text=/);
    assert.equal(order.publicId, "WEB-A1B2C3D4");
  });
});
