import Link from "next/link";

import UserMenu from "./UserMenu";

const links = [
  ["Inicio", "/platform"],
  ["Red", "/red"],
  ["Proyectos", "/proyectos"],
  ["Mercados", "/mercado"],
  ["Academia", "/academia"],
  ["IA", "/platform#assistant"],
  ["Noticias", "/noticias"],
  ["Comunidad", "/comunidad"],
  ["Más", "/mas"],
] as const;

type Props = {
  className?: string;
  mobile?: boolean;
  onNavigate?: () => void;
};

export default function Navigation({ className = "", mobile = false, onNavigate }: Props) {
  return (
    <nav className={`${mobile ? "items-stretch gap-1" : "items-center gap-5 xl:gap-7"} ${className}`}>
      {links.map(([label, href]) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={mobile
            ? "rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-cyan-200"
            : "relative py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 transition-all duration-300 after:absolute after:inset-x-1 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-cyan-300 after:transition-transform hover:text-cyan-200 hover:after:scale-x-100"}
        >
          {label}
        </Link>
      ))}

      <div className={mobile ? "mt-3 border-t border-white/[0.06] pt-4" : ""}>
        <UserMenu />
      </div>
    </nav>
  );
}
