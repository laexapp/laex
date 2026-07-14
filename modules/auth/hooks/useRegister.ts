import { useState } from "react";

import type { RegisterFormData } from "../types/auth";

import { register } from "../engine/auth";

const initialValues: RegisterFormData = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  invitationCode: "",
};

export function useRegister() {
  const [values, setValues] = useState<RegisterFormData>(initialValues);

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

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
    setMessage("");
  }

  async function submit() {
    console.log("PASO 1");

    setMessage("");

    if (!acceptedTerms) {
      setMessage("Debes aceptar los términos de uso.");
      return;
    }

    console.log("PASO 2");

    setLoading(true);

    try {
      console.log("PASO 3");

      const response = await register(values);

      console.log("PASO 4", response);

      setMessage(response.message ?? "");

      if (response.success) {
        reset();
      }
    } catch (error) {
      console.error("ERROR EN SUBMIT:", error);
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