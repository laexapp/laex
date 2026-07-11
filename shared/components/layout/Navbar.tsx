import { BRAND } from "@/src/core/config/brand";

export default function Navbar() {
  return (
    <header className="w-full border-b border-gray-800 bg-[#101826]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <div className="flex items-center gap-3">

          <img
            src={BRAND.icon}
            alt={BRAND.company}
            className="w-10 h-10"
          />

          <h1 className="text-2xl font-bold text-cyan-400">
            {BRAND.company}
          </h1>

        </div>

        <nav className="flex gap-6 text-gray-300">

          <a href="#">Inicio</a>

          <a href="#">IA</a>

          <a href="#">Cursos</a>

          <a href="#">Noticias</a>

        </nav>

      </div>
    </header>
  );
}