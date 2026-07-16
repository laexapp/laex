"use client";

export default function NetworkPage() {

  return (

    <main
      className="
        min-h-screen
        bg-[#070B14]
        px-8
        py-10
        text-white
      "
    >

      <h1
        className="
          text-4xl
          font-black
        "
      >
        🌳 Mi Red
      </h1>

      <p
        className="
          mt-4
          text-slate-400
        "
      >
        Bienvenido al centro de crecimiento
        de tu comunidad en LAEX.
      </p>

      <div
        className="
          mt-10
          rounded-3xl
          border
          border-cyan-500/20
          bg-[#111827]
          p-8
        "
      >

        <h2
          className="
            text-xl
            font-bold
          "
        >
          Próximamente
        </h2>

        <p
          className="
            mt-4
            text-slate-400
          "
        >
          Aquí aparecerán tu código de invitación,
          tu enlace personal, tu líder,
          tus invitados directos,
          tu segundo nivel,
          el tamaño total de tu red
          y tus recompensas.
        </p>

      </div>

    </main>

  );

}