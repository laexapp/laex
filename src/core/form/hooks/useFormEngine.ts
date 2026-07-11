"use client";

export interface UseFormEngineOptions<T = unknown> {
  /**
   * Valores iniciales del formulario.
   */
  defaultValues?: T;

  /**
   * Acción ejecutada al enviar el formulario.
   */
  onSubmit?: (values: T) => void | Promise<void>;
}

export interface UseFormEngineResult<T = unknown> {
  defaultValues?: T;

  submit: (values: T) => Promise<void>;
}

/**
 * ==========================================
 * LAEX FORM ENGINE
 * Internal Hook
 * ==========================================
 *
 * Implementación interna del motor.
 *
 * Los módulos NO deben consumir este hook.
 * Deben utilizar useLAEXForm().
 */

export function useFormEngine<T = unknown>(
  options?: UseFormEngineOptions<T>
): UseFormEngineResult<T> {
  return {
    defaultValues: options?.defaultValues,

    submit: async (values: T) => {
      if (options?.onSubmit) {
        await options.onSubmit(values);
      }
    },
  };
}