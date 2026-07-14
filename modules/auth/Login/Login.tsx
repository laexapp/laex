"use client";

import Link from "next/link";
import Image from "next/image";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { useLogin } from "../hooks/useLogin";

export default function Login() {

  const login = useLogin();

  return (

    <main className="relative min-h-screen overflow-hidden bg-[#070B14] flex items-center justify-center px-6 py-16">

      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />

      <div className="relative w-full max-w-lg rounded-3xl border border-cyan-500/20 bg-[#111827] p-10 shadow-2xl">

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

          Identidad LAEX

        </p>

        <h1 className="mt-5 text-center text-4xl font-black text-white">

          Bienvenido

        </h1>

        <p className="mt-5 text-center leading-8 text-slate-400">

          Inicia sesión con tu identidad digital de LAEX.

        </p>

        <div className="mt-10 space-y-5">

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500"
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              value={login.values.email}
              onChange={(e) =>
                login.handleChange(
                  "email",
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-slate-700 bg-[#0B1018] py-4 pl-14 pr-5 text-white outline-none transition-all focus:border-cyan-400"
            />

          </div>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500"
            />

            <input
              type={
                login.showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Contraseña"
              value={login.values.password}
              onChange={(e) =>
                login.handleChange(
                  "password",
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-slate-700 bg-[#0B1018] py-4 pl-14 pr-14 text-white outline-none transition-all focus:border-cyan-400"
            />

            <button
              type="button"
              onClick={() =>
                login.setShowPassword(
                  !login.showPassword
                )
              }
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400"
            >
              {login.showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

        </div>

        <button
          onClick={login.submit}
          disabled={login.loading}
          className="mt-8 w-full rounded-2xl bg-cyan-500 py-4 text-lg font-bold text-white transition-all hover:bg-cyan-400 disabled:opacity-60"
        >

          {login.loading
            ? "Iniciando sesión..."
            : "Iniciar sesión"}

        </button>

        {login.message && (

          <div className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-center text-sm text-cyan-300">

            {login.message}

          </div>

        )}

        <Link
          href="/forgot-password"
          className="mt-5 block text-center text-sm text-cyan-400 hover:underline"
        >

          ¿Olvidaste tu contraseña?

        </Link>

        <div className="mt-8 border-t border-slate-700 pt-8">

          <p className="text-center text-sm text-slate-500">

            ¿Todavía no tienes una cuenta?

          </p>

          <Link
            href="/register"
            className="mt-3 block w-full rounded-2xl border border-slate-700 py-4 text-center text-white transition-all hover:border-cyan-400"
          >

            Crear cuenta

          </Link>

        </div>

      </div>

    </main>

  );

}