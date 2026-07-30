"use client";

import { AtSign, Mail, Ticket, UserRound } from "lucide-react";
import Link from "next/link";

import Button, { identitySecondaryClass } from "../components/Button";
import Checkbox from "../components/Checkbox";
import IdentityDivider from "../components/IdentityDivider";
import IdentityMessage from "../components/IdentityMessage";
import IdentityShell from "../components/IdentityShell";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import { useRegister } from "../hooks/useRegister";

interface RegisterProps { referralCode?: string; }

export default function Register({ referralCode = "" }: RegisterProps) {
  const register = useRegister(referralCode);
  const success = register.message.startsWith("Cuenta") || register.message.startsWith("✅");

  return (
    <IdentityShell
      eyebrow="Identity creation / 02"
      title={<>Crea tu identidad <span className="block text-cyan-200">digital.</span></>}
      description="Tu punto de acceso personal al ecosistema LAEX, sus proyectos, comunidades e inteligencia."
      asideTitle="Una identidad. Todo el ecosistema."
      asideText="Construye una presencia conectada para descubrir, comprender y participar en la próxima generación de proyectos digitales."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input icon={UserRound} label="Nombre completo" placeholder="Tu nombre" value={register.values.fullName} onChange={(value) => register.handleChange("fullName", value)} autoComplete="name" />
        <Input icon={AtSign} label="Nombre de usuario" placeholder="usuario" value={register.values.username} onChange={(value) => register.handleChange("username", value)} autoComplete="username" />
        <div className="sm:col-span-2"><Input icon={Mail} type="email" label="Correo electrónico" placeholder="tu@correo.com" value={register.values.email} onChange={(value) => register.handleChange("email", value)} autoComplete="email" /></div>
        <div className="sm:col-span-2"><PasswordInput value={register.values.password} showPassword={register.showPassword} onChange={(value) => register.handleChange("password", value)} onToggle={() => register.setShowPassword(!register.showPassword)} autoComplete="new-password" /></div>
        <div className="sm:col-span-2"><Input icon={Ticket} label="Código de invitación" placeholder="Opcional" value={register.values.referralCode} onChange={(value) => register.handleChange("referralCode", value)} autoComplete="off" /></div>
      </div>

      <div className="mt-7">
        <Checkbox id="terms" checked={register.acceptedTerms} onChange={register.setAcceptedTerms}>
          He leído y acepto los <Link href="/terms" className="text-cyan-300 transition hover:text-cyan-100">Términos de Uso</Link> y la <Link href="/privacy" className="text-cyan-300 transition hover:text-cyan-100">Política de Privacidad</Link>.
        </Checkbox>
      </div>

      <div className="mt-7">
        <Button onClick={register.submit} disabled={!register.acceptedTerms} loading={register.loading} loadingLabel="Creando identidad...">Crear mi identidad</Button>
      </div>

      {register.message && <IdentityMessage success={success}>{register.message}</IdentityMessage>}

      <IdentityDivider label="Ya conectado" />
      <Link href="/login" className={identitySecondaryClass}>Iniciar sesión</Link>
    </IdentityShell>
  );
}
