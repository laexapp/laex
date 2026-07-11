import type { FieldValues } from "react-hook-form";

import {
  useFormEngine,
  type UseFormEngineOptions,
} from "./hooks/useFormEngine";

/**
 * ==========================================
 * LAEX FORM ENGINE
 * Public Hook
 * ==========================================
 *
 * API pública oficial del Form Engine.
 *
 * Todos los formularios de LAEX deberán
 * consumir este hook.
 *
 * Ejemplos:
 *
 * - Register
 * - Login
 * - Forgot Password
 * - Wallet
 * - Profile
 *
 * Nunca deberán importar directamente
 * useFormEngine().
 */

export function useLAEXForm<T extends FieldValues>(
  options: UseFormEngineOptions<T>
) {
  return useFormEngine(options);
}