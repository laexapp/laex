"use client";

import { Check, ChevronDown, Copy, LogIn, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCurrentUser } from "@/modules/auth/hooks/useCurrentUser";
import { authService } from "@/modules/auth/services/auth.service";
import { PUBLIC_ORIGINS } from "@/core/config/public-origins";

import UserDropdown from "./UserDropdown";

export default function UserMenu() {
  const user = useCurrentUser();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  async function logout() {
    await authService.logout();
    router.push("/");
  }

  async function copyLink() {
    if (!user) return;

    const link = `${PUBLIC_ORIGINS.laex}/register?ref=${user.referralCode}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!user) {
    return (
      <Link href="/login" className="group inline-flex min-h-10 items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] px-3.5 text-[10px] font-bold uppercase tracking-[0.11em] text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,.07)] transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70">
        <LogIn size={14} className="text-cyan-300" aria-hidden="true" />
        Iniciar sesión
      </Link>
    );
  }

  const initials = user.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative flex items-center rounded-2xl border border-white/[0.08] bg-[#071018]/72 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.055),0_12px_34px_rgba(0,0,0,.25)] backdrop-blur-xl">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group flex min-h-10 min-w-0 items-center gap-2.5 rounded-xl px-2.5 text-left transition hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 to-violet-400/10 text-[10px] font-bold tracking-[0.08em] text-cyan-100">
          {initials || <UserRound size={14} />}
        </span>
        <span className="hidden min-w-0 xl:block">
          <span className="block text-[8px] font-bold uppercase tracking-[0.16em] text-slate-600">Control center</span>
          <span className="mt-0.5 block max-w-24 truncate text-[11px] font-semibold text-slate-200">{user.fullName}</span>
        </span>
        <ChevronDown size={13} className={`hidden text-slate-600 transition duration-300 xl:block ${open ? "rotate-180 text-cyan-300" : "group-hover:text-slate-300"}`} aria-hidden="true" />
      </button>

      <span className="mx-1 h-6 w-px bg-white/[0.08]" />

      <button
        type="button"
        onClick={copyLink}
        className="group relative grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-cyan-300/[0.07] hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
        aria-label={copied ? "Enlace copiado" : "Copiar mi enlace"}
        title={copied ? "Enlace copiado" : "Copiar mi enlace"}
      >
        {copied ? <Check size={15} className="text-emerald-300" /> : <Copy size={14} />}
        {copied && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,.8)]" />}
      </button>

      {open && <UserDropdown fullName={user.fullName} onLogout={logout} />}
    </div>
  );
}
