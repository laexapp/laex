"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

import Logo from "./Logo";
import Navigation from "./Navigation";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.055] bg-[#03070B]/78 shadow-[0_14px_45px_rgba(0,0,0,.22)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/20 to-transparent" />
      <div className="mx-auto flex h-[84px] w-[min(100%-2rem,92rem)] items-center justify-between gap-8">
        <Logo />

        <Navigation className="hidden lg:flex" />

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.025] text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,.07)] transition hover:border-cyan-300/30 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? "Cerrar navegación" : "Abrir navegación"}
        >
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-navigation" className="border-t border-white/[0.06] bg-[#03070B]/96 px-4 py-5 shadow-[0_28px_60px_rgba(0,0,0,.5)] backdrop-blur-2xl lg:hidden">
          <Navigation
            mobile
            className="mx-auto flex w-full max-w-7xl flex-col"
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      )}
    </header>
  );
}
