import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

const messages: Record<string, string> = {
  authentication_required: "Inicia sesión nuevamente para continuar.",
  invalid_credentials: "El usuario o la contraseña no son válidos.",
  company_not_found: "La empresa solicitada no está disponible.",
  company_suspended: "La empresa está suspendida. Contacta a soporte LAEX.",
  product_not_found: "El producto no existe o no pertenece a esta empresa.",
  product_not_available: "El producto ya no está disponible para reservar.",
  insufficient_availability: "No quedan unidades suficientes para completar la reserva.",
  idempotency_required: "La operación necesita una referencia segura. Inténtalo nuevamente.",
  invalid_checkout: "Completa el contacto y agrega al menos un producto.",
  invalid_quantity: "Revisa las cantidades del pedido.",
  price_manipulation_rejected: "El precio cambió. Actualiza el pedido antes de continuar.",
  unknown_action: "La operación solicitada no está disponible.",
};

export function apiError(error: unknown, fallback = "operation_failed") {
  const raw = error instanceof Error ? error.message : fallback;
  const code = raw.startsWith("capability_denied") ? "authorization_denied" : raw.includes("authentication") || raw === "unauthorized" ? "authentication_required" : raw;
  const status = code === "authentication_required" || code === "invalid_credentials" ? 401 : code === "authorization_denied" || code.includes("access") || code.includes("context_mismatch") ? 403 : code.includes("not_found") ? 404 : code.includes("conflict") || code.includes("duplicate") || code.includes("availability") ? 409 : 400;
  return NextResponse.json({ error: code, message: messages[code] ?? "No fue posible completar la operación. Revisa los datos e inténtalo nuevamente.", reference: randomUUID() }, { status, headers: { "cache-control": "no-store" } });
}
