import "server-only";
import { z } from "zod";

const paymentDestinationSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  destinationLabel: z.string().min(1),
  destinationValue: z.string().min(1),
  privateInstructions: z.array(z.string().min(1)).default([]),
  enabled: z.boolean().default(true),
});

const paymentConfigurationSchema = z.object({
  schemaVersion: z.literal(1),
  projectId: z.string().min(1),
  methods: z.array(paymentDestinationSchema),
});

export type ServerPaymentConfiguration = z.infer<typeof paymentConfigurationSchema>;

/**
 * Reads destinations only on the server. In production this variable belongs in
 * the hosting provider's encrypted secret manager, never in NEXT_PUBLIC_*.
 */
export function getServerPaymentConfiguration(projectId: string): ServerPaymentConfiguration {
  const variableName = `${projectId.toUpperCase().replaceAll("-", "_")}_PAYMENT_METHODS_JSON`;
  const raw = process.env[variableName];
  if (!raw) throw new Error(`Falta el secreto de pagos ${variableName}.`);
  const parsed = paymentConfigurationSchema.parse(JSON.parse(raw));
  if (parsed.projectId !== projectId) throw new Error(`El secreto ${variableName} pertenece a otro proyecto.`);
  return parsed;
}
