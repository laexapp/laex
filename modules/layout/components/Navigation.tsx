import Link from "next/link";

import UserMenu from "./UserMenu";

export default function Navigation() {

  return (

    <nav className="hidden items-center gap-6 xl:gap-8 md:flex">

      <Link
        href="/"
        className="text-[14px] font-medium text-slate-300 transition-all duration-300 hover:text-cyan-400"
      >
        Inicio
      </Link>

      <Link
        href="/red"
        className="text-[14px] font-medium text-slate-300 transition-all duration-300 hover:text-cyan-400"
      >
        🌳 Red
      </Link>

      <Link
        href="/proyectos"
        className="text-[14px] font-medium text-slate-300 transition-all duration-300 hover:text-cyan-400"
      >
        Proyectos
      </Link>

      <Link
        href="/mercado"
        className="text-[14px] font-medium text-slate-300 transition-all duration-300 hover:text-cyan-400"
      >
        Mercados
      </Link>

      <Link
        href="/academia"
        className="text-[14px] font-medium text-slate-300 transition-all duration-300 hover:text-cyan-400"
      >
        Academia
      </Link>

      <Link
        href="/ia"
        className="text-[14px] font-medium text-slate-300 transition-all duration-300 hover:text-cyan-400"
      >
        IA
      </Link>

      <Link
        href="/noticias"
        className="text-[14px] font-medium text-slate-300 transition-all duration-300 hover:text-cyan-400"
      >
        Noticias
      </Link>

      <Link
        href="/comunidad"
        className="text-[14px] font-medium text-slate-300 transition-all duration-300 hover:text-cyan-400"
      >
        Comunidad
      </Link>

      <Link
        href="/mas"
        className="text-[14px] font-medium text-slate-300 transition-all duration-300 hover:text-cyan-400"
      >
        Más
      </Link>

      <UserMenu />

    </nav>

  );

}