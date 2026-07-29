type Props = {
  projectId: string;
};

const analysisModules = [
  "Tecnología",
  "Blockchain",
  "Actividad del proyecto",
  "Comunidad",
  "Transparencia",
  "Documentación",
  "Ecosistema",
  "Actualizaciones",
];

export default function ProjectAI({
  projectId,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-cyan-500/20 bg-gradient-to-br from-[#050914] via-[#0b1426] to-[#04070d]">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,.15),transparent_40%)]" />

      <div className="relative z-10 p-8 md:p-12">

        <div className="max-w-4xl">

          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
            LAEX AI ENGINE
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Laboratorio de Inteligencia
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            LAEX estudia cada proyecto utilizando múltiples fuentes de
            información para construir un análisis transparente y en constante
            evolución. Cada módulo incrementa la precisión del índice de
            confianza a medida que se incorporan nuevos datos.
          </p>

        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">

          <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
                  Estado del motor
                </p>

                <h3 className="mt-3 text-3xl font-black text-white">
                  Analizando proyecto...
                </h3>

              </div>

              <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-cyan-300">
                ACTIVO
              </div>

            </div>

            <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/10">

              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />

            </div>

            <p className="mt-4 text-sm text-slate-400">
              El motor continúa procesando información del proyecto.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">

              {analysisModules.map((module) => (
                <div
                  key={module}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                >
                  <span className="text-slate-200">
                    {module}
                  </span>

                  <span className="text-cyan-400">
                    ●
                  </span>

                </div>
              ))}

            </div>

          </div>

          <div className="space-y-6">

            <Panel
              title="Proyecto"
              value={projectId}
            />

            <Panel
              title="Motor IA"
              value="Generación 1"
            />

            <Panel
              title="Estado"
              value="🚀 Lanzamiento Próximamente"
            />

            <Panel
              title="Última sincronización"
              value="En preparación"
            />

          </div>

        </div>

        <div className="mt-12 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-8">

          <h3 className="text-2xl font-black text-white">
            Próxima evolución del motor LAEX
          </h3>

          <p className="mt-5 max-w-4xl leading-8 text-slate-300">
            El sistema incorporará análisis automático de noticias, actividad
            del ecosistema, crecimiento de la comunidad, documentación técnica,
            evolución del desarrollo y comportamiento histórico para generar un
            Índice de Confianza LAEX basado en datos verificables.
          </p>

        </div>

      </div>

    </section>
  );
}

type PanelProps = {
  title: string;
  value: string;
};

function Panel({
  title,
  value,
}: PanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
        {title}
      </p>

      <h4 className="mt-3 text-xl font-bold text-white break-words">
        {value}
      </h4>

    </div>
  );
}