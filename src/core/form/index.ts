/**
 * ==========================================
 * LAEX FORM ENGINE
 * Public API
 * ==========================================
 *
 * Punto de entrada oficial del Form Engine.
 *
 * Los módulos de LAEX deberán importar
 * siempre desde este archivo.
 */

export { default as FormEngine } from "./FormEngine";

export { useLAEXForm } from "./useLAEXForm";

export { default as FormProvider } from "./components/FormProvider";
export { default as FormField } from "./components/FormField";
export { default as SubmitButton } from "./components/SubmitButton";

export type {
  LAEXFormOptions,
  LAEXFormResult,
} from "./types/form.types";