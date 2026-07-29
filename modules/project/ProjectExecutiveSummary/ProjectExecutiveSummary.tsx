import Image from "next/image";
import { Project } from "@/core/types/project";

type Props = {
  project: Project;
};

export default function ProjectExecutiveSummary({
  project,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#08111f] via-[#0c1830] to-[#04070d]">

      <div className="absolute inset-0">

        <Image
          src={project.banner}
          alt={project.name}
          fill
          priority={false}
          className="object-cover opacity-15 scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#07101d]/95 via-[#07101d]/80 to-[#07101d]/95" />

      </div>

      <div className="relative z-10 grid gap-16 p-8 md:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:p-16">

        <div>

          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
            Executive Summary
          </span>

          <h2 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
            Conozca el proyecto
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              en menos de un minuto
            </span>
          </h2>

          <p className="mt-8 max-w-3xl text-lg leading-9 text-slate-300">
            {project.description}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            <InfoCard
              title="Categoría"
              value={project.category}
            />

            <InfoCard
              title="Estado"
              value="🚀 Lanzamiento Próximamente"
            />

            <InfoCard
              title="Fecha estimada"
              value={project.launchDate}
            />

            <InfoCard
              title="Proyecto"
              value={project.name}
            />

          </div>

        </div>

        <div className="flex flex-col">

          <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl">

            <div className="flex items-center gap-5">

              <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-white/10">

                <Image
                  src={project.logo}
                  alt={project.name}
                  fill
                  className="object-contain p-3"
                />

              </div>

              <div>

                <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
                  Proyecto Analizado
                </p>

                <h3 className="mt-2 text-3xl font-black text-white">
                  {project.name}
                </h3>

              </div>

            </div>

            <div className="mt-10">

              <h4 className="text-lg font-bold text-white">
                Aspectos destacados
              </h4>

              <div className="mt-6 space-y-4">

                {project.highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <span className="mt-1 text-cyan-400">
                      ✦
                    </span>

                    <p className="text-slate-300">
                      {item}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

type InfoCardProps = {
  title: string;
  value: string;
};

function InfoCard({
  title,
  value,
}: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">

      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
        {title}
      </p>

      <p className="mt-3 text-xl font-bold text-white">
        {value}
      </p>

    </div>
  );
}