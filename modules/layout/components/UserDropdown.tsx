"use client";

import Link from "next/link";

interface UserDropdownProps {

  fullName: string;

  onLogout: () => void;

}

export default function UserDropdown({

  fullName,

  onLogout,

}: UserDropdownProps) {

  return (

    <div
      className="
        absolute
        right-0
        top-14
        w-72
        overflow-hidden
        rounded-2xl
        border
        border-cyan-500/20
        bg-[#111827]
        shadow-2xl
      "
    >

      <div
        className="
          border-b
          border-slate-800
          p-5
        "
      >

        <p
          className="
            text-sm
            text-slate-400
          "
        >
          Conectado como
        </p>

        <h2
          className="
            mt-1
            text-lg
            font-bold
            text-white
          "
        >
          👤 {fullName}
        </h2>

      </div>

      <Link
        href="/red"
        className="
          block
          px-5
          py-4
          transition-all
          hover:bg-cyan-500/10
        "
      >
        🌳 Mi Red
      </Link>

      <Link
        href="/profile"
        className="
          block
          px-5
          py-4
          transition-all
          hover:bg-cyan-500/10
        "
      >
        👤 Mi Perfil
      </Link>

      <Link
        href="/settings"
        className="
          block
          px-5
          py-4
          transition-all
          hover:bg-cyan-500/10
        "
      >
        ⚙ Configuración
      </Link>

      <button
        onClick={onLogout}
        className="
          w-full
          border-t
          border-slate-800
          px-5
          py-4
          text-left
          text-red-400
          transition-all
          hover:bg-red-500/10
        "
      >
        🚪 Cerrar sesión
      </button>

    </div>

  );

}