import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LoginFormData } from "../types/auth";

import { authService } from "../services/auth.service";
import { validateLogin } from "../schemas/login.schema";

const initialValues: LoginFormData = {
  email: "",
  password: "",
};

export function useLogin() {

const router = useRouter();

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

  function reset() {

    setValues(initialValues);

  }

  async function submit() {

    setMessage("");

    const validation =
      validateLogin(values);

    if (!validation.success) {

      setMessage(validation.message);

      return;

    }

    setLoading(true);

    try {

      const response =
        await authService.login(
          values.email.trim(),
          values.password
        );

      if (response.success) {

  reset();

  router.push("/platform");

  return;

}

setMessage(response.message);

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

    loading,

    message,

    showPassword,
    setShowPassword,

    handleChange,

    submit,

    reset,

  };

}