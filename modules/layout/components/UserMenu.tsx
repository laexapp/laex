"use client";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

import {
  useCurrentUser,
} from "@/modules/auth/hooks/useCurrentUser";

import {
  authService,
} from "@/modules/auth/services/auth.service";

import UserDropdown
  from "./UserDropdown";

export default function UserMenu() {

  const user =
    useCurrentUser();

  const router =
    useRouter();

  const [copied, setCopied] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  async function logout() {

    await authService.logout();

    router.push("/");

  }

  async function copyLink() {

    if (!user) {

      return;

    }

    const link =
      `https://laex.vercel.app/register?ref=${user.referralCode}`;

    await navigator.clipboard.writeText(
      link
    );

    setCopied(true);

    setTimeout(() => {

      setCopied(false);

    }, 2000);

  }

  if (!user) {

    return (

      <Link
        href="/login"
        className="
          ml-2
          rounded-xl
          bg-cyan-500
          px-5
          py-2
          text-sm
          font-semibold
          text-white
          transition-all
          duration-300
          hover:bg-cyan-400
          hover:shadow-lg
          hover:shadow-cyan-500/20
        "
      >
        Iniciar sesión
      </Link>

    );

  }

  return (

    <div
      className="
        relative
        flex
        items-center
        gap-4
      "
    >

      <button
        type="button"
        onClick={() =>
          setOpen(!open)
        }
        className="
          rounded-xl
          border
          border-cyan-500/20
          bg-cyan-500/5
          px-4
          py-2
          text-sm
          font-semibold
          text-cyan-300
          transition-all
          hover:bg-cyan-500/10
        "
      >
        👤 {user.fullName} ▼
      </button>

      <button
        type="button"
        onClick={copyLink}
        className="
          rounded-xl
          bg-emerald-500
          px-5
          py-2
          text-sm
          font-semibold
          text-white
          transition-all
          hover:bg-emerald-400
        "
      >
        🌳 Mi enlace
      </button>

      {copied && (

        <span
          className="
            text-sm
            font-semibold
            text-emerald-400
          "
        >
          ✅ Enlace copiado
        </span>

      )}

      {open && (

        <UserDropdown
          fullName={user.fullName}
          onLogout={logout}
        />

      )}

    </div>

  );

}