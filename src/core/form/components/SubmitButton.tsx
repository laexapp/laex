"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface SubmitButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/**
 * ==========================================
 * LAEX FORM ENGINE
 * Submit Button
 * ==========================================
 *
 * Botón oficial del Form Engine.
 *
 * Todos los formularios de LAEX deberán
 * utilizar este componente.
 *
 * Futuras capacidades:
 *
 * - Loading
 * - Spinner
 * - Disabled automático
 * - Variantes visuales
 * - Iconos
 * - Estados de éxito y error
 *
 */

export default function SubmitButton({
  children,
  type = "submit",
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}