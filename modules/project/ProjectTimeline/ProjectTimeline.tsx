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
    <section className="rounded-2xl border border-cyan-900 bg-[#101826] p-8">

      <h2 className="text-3xl font-bold text-white">
        Línea de Tiempo
      </h2>

      <div className="mt-8 space-y-8">

        {timeline.map((item, index) => (

          <div
            key={index}
            className="relative border-l-2 border-cyan-500 pl-8"
          >

            <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-cyan-400" />

            <p className="text-cyan-400 text-sm">
              {item.date}
            </p>

            <h3 className="mt-1 text-xl font-semibold text-white">
              {item.title}
            </h3>

            <p className="mt-2 text-gray-400">
              {item.description}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}