type Props = {
  projectId: string;
};

export default function ProjectAI({ projectId }: Props) {
  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-[#111827] p-8">

      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
        Inteligencia LAEX
      </p>

      <h2 className="mt-4 text-3xl font-black">
        Análisis Inteligente
      </h2>

      <p className="mt-3 max-w-3xl text-slate-400">
        Este módulo analiza automáticamente la actividad,
        crecimiento y confianza del proyecto mediante el
        motor de inteligencia de LAEX.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-4">

        <div className="rounded-2xl bg-[#0B1018] p-5">
          <p className="text-xs text-slate-500">Confianza</p>
          <h3 className="mt-2 text-3xl font-black text-cyan-400">
            92%
          </h3>
        </div>

        <div className="rounded-2xl bg-[#0B1018] p-5">
          <p className="text-xs text-slate-500">Actividad</p>
          <h3 className="mt-2 text-3xl font-black text-green-400">
            Alta
          </h3>
        </div>

        <div className="rounded-2xl bg-[#0B1018] p-5">
          <p className="text-xs text-slate-500">Comunidad</p>
          <h3 className="mt-2 text-3xl font-black text-cyan-400">
            En crecimiento
          </h3>
        </div>

        <div className="rounded-2xl bg-[#0B1018] p-5">
          <p className="text-xs text-slate-500">Riesgo</p>
          <h3 className="mt-2 text-3xl font-black text-yellow-400">
            Bajo
          </h3>
        </div>

      </div>

      <div className="mt-8 rounded-2xl bg-[#0B1018] p-6">
        <p className="text-sm text-slate-400">
          Proyecto analizado:
        </p>

        <p className="mt-2 text-xl font-bold text-cyan-400">
          {projectId}
        </p>

        <p className="mt-4 text-sm text-slate-500">
          Última actualización del motor IA:
          Hace unos minutos.
        </p>
      </div>

    </section>
  );
}