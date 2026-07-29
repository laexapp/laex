type ProjectStatsProps = {
  trustIndex: number;
  aiScore: number;
  communityScore: number;
  riskLevel: number;
};

export default function ProjectStats({
  trustIndex,
  aiScore,
  communityScore,
  riskLevel,
}: ProjectStatsProps) {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#07111f] via-[#0d1830] to-[#05080f] p-8 md:p-12">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_40%)]" />

      <div className="relative z-10">

        <div className="mb-12">

          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
            LAEX Intelligence
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Centro de Inteligencia
          </h2>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            LAEX combinará Inteligencia Artificial, actividad de la comunidad,
            análisis técnico y evaluación de riesgos para construir un índice
            de confianza transparente para cada proyecto.
          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">

          <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl">

            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
              Índice de Confianza LAEX
            </p>

            <div className="mt-8 flex items-center gap-8">

              <div className="flex h-44 w-44 items-center justify-center rounded-full border-8 border-cyan-400/20 bg-cyan-400/10">

                <div className="text-center">

                  <div className="text-6xl font-black text-cyan-300">
                    {trustIndex}
                  </div>

                  <div className="mt-2 text-sm uppercase tracking-[0.3em] text-slate-400">
                    ICL
                  </div>

                </div>

              </div>

              <div className="flex-1 space-y-6">

                <MetricBar
                  label="Inteligencia Artificial"
                  value={aiScore}
                  color="bg-cyan-400"
                />

                <MetricBar
                  label="Comunidad"
                  value={communityScore}
                  color="bg-blue-400"
                />

                <MetricBar
                  label="Riesgo"
                  value={riskLevel}
                  color="bg-red-400"
                />

              </div>

            </div>

          </div>

          <div className="space-y-6">

            <StatCard
              title="IA"
              value={aiScore}
              color="text-cyan-300"
            />

            <StatCard
              title="Comunidad"
              value={communityScore}
              color="text-blue-300"
            />

            <StatCard
              title="Nivel de Riesgo"
              value={riskLevel}
              color="text-red-300"
            />

          </div>

        </div>

      </div>

    </section>
  );
}

type MetricBarProps = {
  label: string;
  value: number;
  color: string;
};

function MetricBar({
  label,
  value,
  color,
}: MetricBarProps) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm font-medium text-slate-300">
          {label}
        </span>

        <span className="text-sm font-bold text-white">
          {value}
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">

        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${Math.max(0, Math.min(value, 100))}%`,
          }}
        />

      </div>

    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  color: string;
};

function StatCard({
  title,
  value,
  color,
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
        {title}
      </p>

      <h3 className={`mt-4 text-5xl font-black ${color}`}>
        {value}
      </h3>

    </div>
  );
}