import { z } from "zod";

/**
 * Esquema base del Form Engine.
 *
 * Todos los formularios de LAEX extenderán este esquema
 * para mantener una estructura consistente.
 */
export const baseSchema = z.object({});

export type BaseSchema = z.infer<typeof baseSchema>;