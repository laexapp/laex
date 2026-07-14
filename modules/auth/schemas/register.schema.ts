import type { RegisterFormData } from "../types/auth";

export interface ValidationResult {
  success: boolean;
  message?: string;
}

export function validateRegister(
  data: RegisterFormData
): ValidationResult {
  if (!data.fullName.trim()) {
    return {
      success: false,
      message: "El nombre es obligatorio.",
    };
  }

  if (!data.username.trim()) {
    return {
      success: false,
      message: "El nombre de usuario es obligatorio.",
    };
  }

  if (!data.email.trim()) {
    return {
      success: false,
      message: "El correo electrónico es obligatorio.",
    };
  }

  if (!data.email.includes("@")) {
    return {
      success: false,
      message: "Correo electrónico inválido.",
    };
  }

  if (data.password.length < 8) {
    return {
      success: false,
      message: "La contraseña debe tener al menos 8 caracteres.",
    };
  }

  return {
    success: true,
  };
}