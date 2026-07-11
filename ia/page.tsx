export default function IAPage() {
  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">

        <span className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-400">
          LAEX AI
        </span>

        <h1 className="mt-4 text-5xl font-black">
          Centro de Inteligencia
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          LAEX AI será el centro de inteligencia del ecosistema.
          Aquí los usuarios podrán analizar proyectos, comparar
          oportunidades, interpretar información del mercado y recibir
          recomendaciones mediante Inteligencia Artificial.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-slate-800 bg-[#0D1422] p-6">
            <h2 className="text-xl font-bold">🤖 AI Assistant</h2>
            <p className="mt-4 text-slate-400">
              Conversa con LAEX AI y obtén respuestas sobre cualquier proyecto.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#0D1422] p-6">
            <h2 className="text-xl font-bold">📊 AI Analysis</h2>
            <p className="mt-4 text-slate-400">
              Analiza riesgos, fortalezas y oportunidades de cada proyecto.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#0D1422] p-6">
            <h2 className="text-xl font-bold">📈 Market Intelligence</h2>
            <p className="mt-4 text-slate-400">
              Comprende el mercado con ayuda de IA y datos organizados.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#0D1422] p-6">
            <h2 className="text-xl font-bold">⭐ Project Score</h2>
            <p className="mt-4 text-slate-400">
              Consulta el índice de confianza generado por LAEX AI.
            </p>
          </div>

        </div>

      </section>
    </main>
  );
}