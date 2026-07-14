import { useState } from "react";

import type { LoginFormData } from "../types/auth";

import { authService } from "../services/auth.service";
import { validateLogin } from "../schemas/login.schema";

const initialValues: LoginFormData = {
  email: "",
  password: "",
};

export function useLogin() {
  const [values, setValues] =
    useState<LoginFormData>(initialValues);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  function handleChange(
    field: keyof LoginFormData,
    value: string
  ) {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function submit() {
    setMessage("");

    const validation = validateLogin(values);

    if (!validation.success) {
      setMessage(validation.message);
      return;
    }

    setLoading(true);

    try {
      const response =
        await authService.login(
          values.email,
          values.password
        );

      setMessage(response.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    values,

    loading,

    message,

    showPassword,
    setShowPassword,

    handleChange,

    submit,
  };
}