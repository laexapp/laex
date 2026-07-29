type TimelineItem = {
  date: string;
  title: string;
  description: string;
};

type ProjectTimelineProps = {
  timeline: TimelineItem[];
};

export default function ProjectTimeline({
  timeline,
}: ProjectTimelineProps) {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-cyan-500/20 bg-gradient-to-br from-[#060B16] via-[#091222] to-[#04070D] px-8 py-12 md:px-12 md:py-16">

      {/* Fondo */}
      <div className="pointer-events-none absolute inset-0">

        <div className="absolute right-[-200px] top-[-120px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[180px]" />

        <div className="absolute left-[-200px] bottom-[-150px] h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[180px]" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

      </div>

      <div className="relative z-10">

        <div className="max-w-4xl">

          <span className="text-xs font-bold uppercase tracking-[0.45em] text-cyan-400">
            Evolución del Proyecto
          </span>

          <h2 className="mt-5 text-5xl font-black text-white md:text-6xl">
            Línea de Tiempo
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Cada hito representa una etapa importante dentro del crecimiento del
            proyecto y permite comprender cómo ha evolucionado hasta el momento.
          </p>

        </div>

        <div className="relative mt-20">

          {/* Línea central */}
          <div className="absolute left-[22px] top-0 h-full w-[3px] rounded-full bg-gradient-to-b from-cyan-400 via-cyan-500 to-blue-600" />

          <div className="space-y-14">

            {timeline.map((item, index) => (

              <div
                key={index}
                className="group relative pl-20"
              >

                {/* Nodo */}
                <div className="absolute left-0 top-2 flex h-11 w-11 items-center justify-center rounded-full border-4 border-cyan-400 bg-[#07101D] shadow-[0_0_30px_rgba(34,211,238,.6)] transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(34,211,238,.9)]">

                  <div className="h-3 w-3 rounded-full bg-cyan-300" />

                </div>

                {/* Tarjeta */}
                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl transition-all duration-500 group-hover:border-cyan-400/40 group-hover:bg-white/[0.06]">

                  <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                    {item.date}
                  </span>

                  <h3 className="mt-6 text-3xl font-black text-white">
                    {item.title}
                  </h3>

                  <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                    {item.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}