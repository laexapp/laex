export default function AcademiaPage() {
  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">

        <span className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-400">
          LAEX
        </span>

        <h1 className="mt-6 text-5xl font-black">
          Academia
        </h1>

        <p className="mt-8 mx-auto max-w-2xl text-lg leading-8 text-slate-300">
          Estamos construyendo este módulo para ofrecer cursos, guías,
          documentación y contenido educativo del ecosistema LAEX.
        </p>

        <div className="mt-14 rounded-3xl border border-cyan-500/20 bg-[#0D1422] p-10">
          <h2 className="text-2xl font-bold">🚧 Módulo en desarrollo</h2>

          <p className="mt-6 text-slate-400">
            Muy pronto encontrarás todo el contenido educativo de LAEX.
          </p>
        </div>

      </section>
    </main>
  );
}