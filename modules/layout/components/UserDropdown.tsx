"use client";

import { LogOut, Network, Settings, UserRound } from "lucide-react";
import Link from "next/link";

interface UserDropdownProps {
  fullName: string;
  onLogout: () => void;
}

const items = [
  { href: "/red", label: "Mi Red", detail: "Conexiones y comunidad", icon: Network },
  { href: "/profile", label: "Mi Perfil", detail: "Identidad LAEX", icon: UserRound },
  { href: "/settings", label: "Configuración", detail: "Preferencias del sistema", icon: Settings },
] as const;

export default function UserDropdown({ fullName, onLogout }: UserDropdownProps) {
  return (
    <div role="menu" className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-[24px] border border-white/[0.1] bg-[#071018]/96 p-2 shadow-[0_30px_80px_rgba(0,0,0,.65),inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-2xl">
      <div className="rounded-[18px] border border-white/[0.06] bg-white/[0.025] p-4">
        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-cyan-300/70">LAEX identity / online</p>
        <h2 className="mt-2 truncate text-sm font-semibold text-white">{fullName}</h2>
      </div>

      <div className="mt-2 space-y-1">
        {items.map(({ href, label, detail, icon: Icon }) => (
          <Link key={href} href={href} role="menuitem" className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-500 transition group-hover:border-cyan-300/20 group-hover:text-cyan-200"><Icon size={15} /></span>
            <span>
              <span className="block text-xs font-semibold text-slate-200">{label}</span>
              <span className="mt-0.5 block text-[9px] text-slate-600">{detail}</span>
            </span>
          </Link>
        ))}
      </div>

      <button type="button" role="menuitem" onClick={onLogout} className="mt-2 flex w-full items-center gap-3 rounded-2xl border-t border-white/[0.06] px-3 py-3 text-left text-xs font-semibold text-rose-300/80 transition hover:bg-rose-400/[0.07] hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60">
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-rose-300/10 bg-rose-300/[0.04]"><LogOut size={15} /></span>
        Cerrar sesión
      </button>
    </div>
  );
}
