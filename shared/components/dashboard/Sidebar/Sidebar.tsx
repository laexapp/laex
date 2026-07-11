export default function Sidebar() {
  const menu = [
    "Dashboard",
    "IA",
    "Academy",
    "Noticias",
    "Wallet",
    "Marketplace",
    "Configuración",
  ];

  return (
    <aside className="w-72 bg-[#0E1624] h-screen border-r border-slate-800">

      <div className="p-6">

        <h2 className="text-cyan-400 text-xl font-bold">
          LAEX
        </h2>

        <p className="text-gray-400 text-sm">
          Plataforma Inteligente
        </p>

      </div>

      <nav className="mt-6">

        {menu.map((item) => (

          <button
            key={item}
            className="
              w-full
              text-left
              px-6
              py-4
              text-gray-300
              hover:bg-slate-800
              hover:text-cyan-400
              transition-all
            "
          >
            {item}
          </button>

        ))}

      </nav>

    </aside>
  );
}