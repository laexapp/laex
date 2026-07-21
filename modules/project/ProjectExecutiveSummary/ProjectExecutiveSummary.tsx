import { Project } from "@/core/types/project";

type Props = {
  project: Project;
};

export default function ProjectExecutiveSummary({
  project,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#0d1523] p-8 md:p-10">

      <div className="mb-10">

        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Executive Summary
        </span>

        <h2 className="mt-3 text-4xl font-black text-white">
          Conozca el proyecto en menos de un minuto
        </h2>

        <p className="mt-4 max-w-3xl text-slate-400">
          Este resumen ofrece una visión rápida del proyecto antes de
          profundizar en su tecnología, comunidad, noticias y análisis.
        </p>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <SummaryCard
          icon="📌"
          title="¿Qué es este proyecto?"
          content={project.description}
        />

        <SummaryCard
          icon="🎯"
          title="Objetivo"
          content="Esta sección mostrará el objetivo principal del proyecto y el problema que busca resolver."
        />

        <SummaryCard
          icon="👥"
          title="¿Quién debería conocer este proyecto?"
          content="Aquí se explicará el perfil de usuario o inversionista al que está dirigido."
        />

        <SummaryCard
          icon="🚀"
          title="Estado actual"
          content={`Actualmente el proyecto se encuentra en estado: ${project.status}.`}
        />

      </div>

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

        <div className="flex items-center gap-3">

          <span className="text-2xl">
            🤖
          </span>

          <h3 className="text-xl font-bold text-white">
            Resumen IA
          </h3>

        </div>

        <p className="mt-4 leading-8 text-slate-300">
          Próximamente LAEX AI generará automáticamente un resumen
          ejecutivo utilizando la información oficial del proyecto,
          noticias verificadas y documentación técnica.
        </p>

      </div>

    </section>
  );
}

type SummaryCardProps = {
  icon: string;
  title: string;
  content: string;
};

function SummaryCard({
  icon,
  title,
  content,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

      <div className="flex items-center gap-3">

        <span className="text-2xl">
          {icon}
        </span>

        <h3 className="text-lg font-bold text-white">
          {title}
        </h3>

      </div>

      <p className="mt-4 leading-8 text-slate-300">
        {content}
      </p>

    </div>
  );
}