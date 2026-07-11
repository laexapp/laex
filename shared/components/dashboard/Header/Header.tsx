export default function Header() {
  return (
    <header className="w-full h-16 bg-[#101826] border-b border-slate-800 flex items-center justify-between px-8">

      <div className="flex items-center gap-3">

        <img
          src="/brand/logo/laex-icon.png"
          alt="LAEX"
          className="w-9 h-9"
        />

        <h1 className="text-cyan-400 font-bold text-2xl">
          LAEX
        </h1>

      </div>

      <input
        type="text"
        placeholder="Buscar..."
        className="
          w-80
          rounded-lg
          bg-slate-900
          border
          border-slate-700
          px-4
          py-2
          text-white
          outline-none
        "
      />

      <div className="flex items-center gap-4">

        <button className="text-white">
          🔔
        </button>

        <button className="text-white">
          👤
        </button>

      </div>

    </header>
  );
}