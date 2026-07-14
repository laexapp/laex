import type { LoginFormData } from "../types/auth";

import type { AuthResult } from "../types/auth";

export function validateLogin(
  data: LoginFormData
): AuthResult {
  if (!data.email.trim()) {
    return {
      success: false,
      message: "El correo es obligatorio.",
    };
  }

  if (!data.password.trim()) {
    return {
      success: false,
      message: "La contraseña es obligatoria.",
    };
  }

  return {
    success: true,
    message: "Formulario válido.",
  };
}