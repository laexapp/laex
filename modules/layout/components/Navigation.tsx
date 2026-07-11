import Link from "next/link";

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

      <button className="ml-2 rounded-xl bg-cyan-500 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20">
        Iniciar sesión
      </button>

    </nav>
  );
}