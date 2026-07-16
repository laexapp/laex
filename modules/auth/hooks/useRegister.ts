"use client";

import { useState } from "react";

import type {
  RegisterFormData,
} from "../types/auth";

import { register } from "../engine/auth";

export function useRegister(
  initialReferralCode = ""
) {

  const initialValues: RegisterFormData = {
    fullName: "",
    username: "",
    email: "",
    password: "",
    referralCode: initialReferralCode,
  };

  const [values, setValues] =
    useState<RegisterFormData>(
      initialValues
    );

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  function handleChange(
    field: keyof RegisterFormData,
    value: string
  ) {

    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));

  }

  function reset() {

    setValues(initialValues);

    setAcceptedTerms(false);

    setShowPassword(false);

  }

  async function submit() {

    setMessage("");

    if (!acceptedTerms) {

      setMessage(
        "Debes aceptar los términos de uso."
      );

      return;

    }

    setLoading(true);

    try {

      const response =
        await register(values);

      setMessage(response.message);

      if (response.success) {

        reset();

      }

    } catch {

      setMessage(
        "Ocurrió un error inesperado."
      );

    } finally {

      setLoading(false);

    }

  }

  return {

    values,

    acceptedTerms,
    setAcceptedTerms,

    showPassword,
    setShowPassword,

    loading,

    message,

    handleChange,

    reset,

    submit,

  };

}