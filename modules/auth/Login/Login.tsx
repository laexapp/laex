"use client";

import { Mail } from "lucide-react";
import Link from "next/link";

import Button, { identitySecondaryClass } from "../components/Button";
import IdentityDivider from "../components/IdentityDivider";
import IdentityMessage from "../components/IdentityMessage";
import IdentityShell from "../components/IdentityShell";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
  const login = useLogin();

  return (
    <IdentityShell
      eyebrow="Identity access / 01"
      title={<>Bienvenido a <span className="text-cyan-200">LAEX.</span></>}
      description="Accede a tu identidad digital y continúa explorando el ecosistema de inteligencia."
      asideTitle="La inteligencia comienza con confianza."
      asideText="Una entrada segura, clara y conectada al mismo sistema que organiza tus proyectos, señales y oportunidades."
    >
      <div className="space-y-5">
        <Input icon={Mail} type="email" label="Correo electrónico" placeholder="tu@correo.com" value={login.values.email} onChange={(value) => login.handleChange("email", value)} autoComplete="email" />
        <PasswordInput value={login.values.password} showPassword={login.showPassword} onChange={(value) => login.handleChange("password", value)} onToggle={() => login.setShowPassword(!login.showPassword)} />
      </div>

      <div className="mt-3 text-right">
        <Link href="/forgot-password" className="text-xs text-slate-500 transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70">¿Olvidaste tu contraseña?</Link>
      </div>

      <div className="mt-7">
        <Button onClick={login.submit} loading={login.loading} loadingLabel="Iniciando sesión...">Entrar a LAEX</Button>
      </div>

      {login.message && <IdentityMessage>{login.message}</IdentityMessage>}

      <IdentityDivider label="Nueva identidad" />
      <p className="mb-3 text-center text-xs text-slate-600">¿Todavía no tienes una cuenta?</p>
      <Link href="/register" className={identitySecondaryClass}>Crear identidad digital</Link>
    </IdentityShell>
  );
}
