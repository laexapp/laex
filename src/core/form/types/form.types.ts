import type {
  DefaultValues,
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import type { ZodTypeAny } from "zod";

/**
 * ==========================================
 * LAEX FORM ENGINE
 * Public Types
 * ==========================================
 */

export interface LAEXFormOptions<T extends FieldValues> {
  schema: ZodTypeAny;

  defaultValues: DefaultValues<T>;

  onSubmit: SubmitHandler<T>;

  mode?:
    | "onSubmit"
    | "onBlur"
    | "onChange"
    | "onTouched"
    | "all";
}

export interface LAEXFormResult<T extends FieldValues> {
  /**
   * Instancia del formulario.
   */
  form: UseFormReturn<T>;

  /**
   * Acción de envío.
   */
  submit: () => void;
}