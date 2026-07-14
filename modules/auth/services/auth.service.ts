import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import { auth } from "@/src/lib/firebase";

import type {
  RegisterFormData,
  AuthResult,
} from "../types/auth";

class AuthService {
  async createUser(
    data: RegisterFormData
  ): Promise<AuthResult> {

    console.log("========== REGISTRO ==========");
    console.log(data);

    try {

      const credential =
        await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

      console.log("USUARIO CREADO");
      console.log(credential.user);

      await sendEmailVerification(
        credential.user
      );

      return {
        success: true,
        message:
          "✅ Cuenta creada correctamente. Revisa tu correo electrónico para verificar tu identidad.",
      };

    } catch (error: unknown) {

      console.error("========== FIREBASE ==========");
      console.error(error);

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error
      ) {

        const firebaseError = error as {
          code: string;
          message: string;
        };

        switch (firebaseError.code) {

          case "auth/email-already-in-use":
            return {
              success: false,
              message:
                "Este correo electrónico ya está registrado.",
            };

          case "auth/invalid-email":
            return {
              success: false,
              message:
                "El correo electrónico no es válido.",
            };

          case "auth/weak-password":
            return {
              success: false,
              message:
                "La contraseña es demasiado débil.",
            };

          case "auth/network-request-failed":
            return {
              success: false,
              message:
                "No fue posible conectar con Firebase. Verifica tu conexión.",
            };

          case "auth/too-many-requests":
            return {
              success: false,
              message:
                "Se realizaron demasiados intentos. Inténtalo nuevamente en unos minutos.",
            };

          default:
            return {
              success: false,
              message:
                "Ocurrió un error inesperado durante el registro.",
            };
        }

      }

      return {
        success: false,
        message:
          "No fue posible crear la cuenta.",
      };
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<AuthResult> {

    console.log("Login...", email, password);

    return {
      success: true,
      message: "Servicio preparado.",
    };
  }

  async logout(): Promise<void> {
    console.log("Logout...");
  }

  async verifyEmail(
    code: string
  ): Promise<AuthResult> {

    console.log("Verify...", code);

    return {
      success: true,
      message: "Servicio preparado.",
    };
  }

  async resetPassword(
    email: string
  ): Promise<AuthResult> {

    console.log("Reset...", email);

    return {
      success: true,
      message: "Servicio preparado.",
    };
  }
}

export const authService = new AuthService();