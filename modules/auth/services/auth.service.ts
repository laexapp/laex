import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "@/src/lib/firebase";

import { referralService } from "./referral.service";
import { userService } from "./user.service";

import type {
  RegisterFormData,
  AuthResult,
} from "../types/auth";

class AuthService {

  async createUser(
    data: RegisterFormData
  ): Promise<AuthResult> {

    try {

      const credential =
        await createUserWithEmailAndPassword(
          auth,
          data.email.trim(),
          data.password
        );

      await updateProfile(
        credential.user,
        {
          displayName: data.fullName,
        }
      );

      const referredByUid =
        await referralService.findOwnerUid(
          data.referralCode
        );

      await userService.createProfile({
        uid: credential.user.uid,
        fullName: data.fullName,
        username: data.username,
        email: data.email,

        referralCode: data.referralCode,

        referredByUid,
      });

      await sendEmailVerification(
        credential.user
      );

      return {
        success: true,
        message:
          "Cuenta creada correctamente. Revisa tu correo electrónico para verificar tu identidad.",
      };

    } catch (error: unknown) {

      console.error("ERROR FIREBASE:");
      console.error(error);

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error
      ) {

        const firebaseError = error as {
          code: string;
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
                "La contraseña debe tener al menos 6 caracteres.",
            };

          case "auth/network-request-failed":
            return {
              success: false,
              message:
                "No fue posible conectar con el servidor.",
            };

          default:
            return {
              success: false,
              message:
                "No fue posible crear la cuenta.",
            };

        }

      }

      return {
        success: false,
        message:
          "Ocurrió un error inesperado.",
      };

    }

  }

  async login(
    email: string,
    password: string
  ): Promise<AuthResult> {

    try {

      const credential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      if (!credential.user.emailVerified) {

        await signOut(auth);

        return {
          success: false,
          message:
            "Debes verificar tu correo electrónico antes de iniciar sesión.",
        };

      }

      return {
        success: true,
        message:
          "Inicio de sesión correcto.",
      };

    } catch (error: unknown) {

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error
      ) {

        const firebaseError = error as {
          code: string;
        };

        switch (firebaseError.code) {

          case "auth/user-not-found":
            return {
              success: false,
              message:
                "No existe una cuenta con ese correo.",
            };

          case "auth/wrong-password":
          case "auth/invalid-credential":
            return {
              success: false,
              message:
                "Correo o contraseña incorrectos.",
            };

          case "auth/too-many-requests":
            return {
              success: false,
              message:
                "Demasiados intentos. Inténtalo nuevamente más tarde.",
            };

          default:
            return {
              success: false,
              message:
                "No fue posible iniciar sesión.",
            };

        }

      }

      return {
        success: false,
        message:
          "Ocurrió un error inesperado.",
      };

    }

  }

  async logout(): Promise<void> {

    await signOut(auth);

  }

  async verifyEmail(
    code: string
  ): Promise<AuthResult> {

    console.log("Verify...", code);

    return {
      success: true,
      message: "Pendiente.",
    };

  }

  async resetPassword(
    email: string
  ): Promise<AuthResult> {

    try {

      await sendPasswordResetEmail(
        auth,
        email.trim()
      );

      return {
        success: true,
        message:
          "Se envió un enlace para restablecer la contraseña.",
      };

    } catch {

      return {
        success: false,
        message:
          "No fue posible enviar el correo de recuperación.",
      };

    }

  }

}

export const authService = new AuthService();