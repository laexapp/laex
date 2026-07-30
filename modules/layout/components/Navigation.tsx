"use client";

import { BookOpen, Bot, Boxes, ChartNoAxesCombined, CircleEllipsis, House, Newspaper, Orbit, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import UserMenu from "./UserMenu";

const links = [
  { label: "Inicio", href: "/platform", icon: House },
  { label: "Red", href: "/red", icon: Orbit },
  { label: "Proyectos", href: "/proyectos", icon: Boxes },
  { label: "Mercados", href: "/mercado", icon: ChartNoAxesCombined },
  { label: "Academia", href: "/academia", icon: BookOpen },
  { label: "IA", href: "/platform#assistant", icon: Bot },
  { label: "Noticias", href: "/noticias", icon: Newspaper },
  { label: "Comunidad", href: "/comunidad", icon: Users },
  { label: "Más", href: "/mas", icon: CircleEllipsis },
] as const;

type Props = {
  className?: string;
  mobile?: boolean;
  onNavigate?: () => void;
};

export default function Navigation({ className = "", mobile = false, onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegación principal" className={`${mobile ? "items-stretch gap-1.5" : "items-center gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,.045)]"} ${className}`}>
      {links.map(({ label, href, icon: Icon }) => {
        const route = href.split("#")[0];
        const active = !href.includes("#") && (pathname === route || (route === "/proyectos" && pathname.startsWith("/proyectos/")));

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={mobile
              ? `group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition duration-300 ${active ? "border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-100" : "border-transparent text-slate-400 hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-white"}`
              : `group relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] transition duration-300 ${active ? "bg-white/[0.075] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_8px_24px_rgba(0,0,0,.22)]" : "text-slate-500 hover:bg-white/[0.045] hover:text-slate-200"}`}
          >
            <Icon size={mobile ? 16 : 13} strokeWidth={1.7} className={active ? "text-cyan-300" : "text-slate-600 transition group-hover:text-cyan-300"} aria-hidden="true" />
            {label}
            {active && !mobile && <span className="absolute inset-x-3 -bottom-1.5 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />}
          </Link>
        );
      })}

      <div className={mobile ? "mt-3 border-t border-white/[0.07] pt-4" : "ml-1 border-l border-white/[0.07] pl-2"}>
        <UserMenu />
      </div>
    </nav>
  );
}
