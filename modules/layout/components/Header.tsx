"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

import Logo from "./Logo";
import Navigation from "./Navigation";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#03070B]/82 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 w-[min(100%-2rem,92rem)] items-center justify-between">
        <Logo />

        <Navigation className="hidden lg:flex" />

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:border-cyan-300/30 hover:text-cyan-200 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? "Cerrar navegación" : "Abrir navegación"}
        >
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-navigation" className="border-t border-white/[0.06] bg-[#03070B]/96 px-4 py-5 backdrop-blur-2xl lg:hidden">
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
