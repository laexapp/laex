"use client";

import Image from "next/image";
import Link from "next/link";
import {
  User,
  Badge,
  Mail,
  Lock,
  Ticket,
  Eye,
  EyeOff,
} from "lucide-react";

import { useRegister } from "../hooks/useRegister";

export default function Register() {
  const register = useRegister();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070B14] flex items-center justify-center px-6 py-16">

      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />

      <div className="relative w-full max-w-lg rounded-3xl border border-cyan-500/20 bg-[#111827] p-10 shadow-2xl">

        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/images/laex/logo-header.png"
            alt="LAEX"
            width={170}
            height={55}
            priority
            style={{
              width: "170px",
              height: "auto",
            }}
          />
        </div>

        <p className="mt-8 text-center text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
          Identidad de LAEX
        </p>

        <h1 className="mt-5 text-center text-4xl font-black text-white">
          Crea tu identidad
          <br />
          digital
        </h1>

        <p className="mt-5 text-center leading-8 text-slate-400">
          LAEX organiza toda la información relevante de cada proyecto para
          ayudarte a entenderlo, seguir su evolución y acceder a sus recursos
          oficiales desde un solo lugar.
        </p>

        <div className="mt-10 space-y-5">

          {/* Nombre */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500"
            />

            <input
              type="text"
              placeholder="Nombre completo"
              value={register.values.fullName}
              onChange={(e) =>
                register.handleChange("fullName", e.target.value)
              }
              className="w-full rounded-2xl border border-slate-700 bg-[#0B1018] py-4 pl-14 pr-5 text-white outline-none transition-all focus:border-cyan-400"
            />
          </div>

          {/* Usuario */}
          <div className="relative">
            <Badge
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500"
            />

            <input
              type="text"
              placeholder="Nombre de usuario"
              value={register.values.username}
              onChange={(e) =>
                register.handleChange("username", e.target.value)
              }
              className="w-full rounded-2xl border border-slate-700 bg-[#0B1018] py-4 pl-14 pr-5 text-white outline-none transition-all focus:border-cyan-400"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500"
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              value={register.values.email}
              onChange={(e) =>
                register.handleChange("email", e.target.value)
              }
              className="w-full rounded-2xl border border-slate-700 bg-[#0B1018] py-4 pl-14 pr-5 text-white outline-none transition-all focus:border-cyan-400"
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500"
            />

            <input
              type={register.showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={register.values.password}
              onChange={(e) =>
                register.handleChange("password", e.target.value)
              }
              className="w-full rounded-2xl border border-slate-700 bg-[#0B1018] py-4 pl-14 pr-14 text-white outline-none transition-all focus:border-cyan-400"
            />

            <button
              type="button"
              onClick={() =>
                register.setShowPassword(!register.showPassword)
              }
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {register.showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {/* Invitación */}
          <div className="relative">
            <Ticket
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500"
            />

            <input
              type="text"
              placeholder="Código de invitación (Opcional)"
              value={register.values.referralCode}
              onChange={(e) =>
                register.handleChange(
  "referralCode",
  e.target.value
)
              }
              className="w-full rounded-2xl border border-slate-700 bg-[#0B1018] py-4 pl-14 pr-5 text-white outline-none transition-all focus:border-cyan-400"
            />
          </div>

        </div>

        {/* Términos */}

        <div className="mt-8 flex items-start gap-3">

          <input
            id="terms"
            type="checkbox"
            checked={register.acceptedTerms}
            onChange={(e) =>
              register.setAcceptedTerms(e.target.checked)
            }
            className="mt-1 h-4 w-4 accent-cyan-500"
          />

          <label
            htmlFor="terms"
            className="text-sm leading-6 text-slate-400"
          >
            He leído y acepto los{" "}
            <Link
              href="/terms"
              className="text-cyan-400 hover:underline"
            >
              Términos de Uso
            </Link>{" "}
            y la{" "}
            <Link
              href="/privacy"
              className="text-cyan-400 hover:underline"
            >
              Política de Privacidad
            </Link>.
          </label>

        </div>

        <button
          onClick={register.submit}
          disabled={!register.acceptedTerms || register.loading}
          className={`mt-8 w-full rounded-2xl py-4 text-lg font-bold transition-all ${
            register.acceptedTerms
              ? "bg-cyan-500 text-white hover:bg-cyan-400"
              : "cursor-not-allowed bg-slate-700 text-slate-400"
          }`}
        >
         {register.loading
  ? "Creando identidad..."
  : "Crear mi cuenta"}
        </button>

        {register.message && (

  <div
    className={`mt-5 rounded-2xl px-4 py-3 text-center text-sm ${
      register.message.startsWith("Cuenta")
      || register.message.startsWith("✅")
        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
        : "border border-red-500/30 bg-red-500/10 text-red-300"
    }`}
  >
    {register.message}
  </div>

)}
        

        <p className="mt-8 text-center text-sm text-slate-500">
          ¿Ya tienes una cuenta?
        </p>

        <Link
  href="/login"
  className="mt-3 block w-full rounded-2xl border border-slate-700 py-4 text-center text-white transition-all hover:border-cyan-400"
>
  Iniciar sesión
</Link>

      </div>

    </main>
  );
}