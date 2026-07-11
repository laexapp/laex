type ProjectOverviewProps = {
  name: string;
  category: string;
  status: string;
  launchDate: string;
  description: string;
};

export default function ProjectOverview({
  name,
  category,
  status,
  launchDate,
  description,
}: ProjectOverviewProps) {
  return (
    <div
      className="
        mt-16
        rounded-2xl
        border
        border-cyan-900
        bg-[#101826]
        p-8
        shadow-xl
      "
    >
      <h2 className="text-3xl font-bold text-white">
        {name}
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">

        <div>
          <p className="text-gray-400">
            <strong>Categoría:</strong> {category}
          </p>

          <p className="mt-2 text-gray-400">
            <strong>Estado:</strong> {status}
          </p>

          <p className="mt-2 text-gray-400">
            <strong>Lanzamiento:</strong> {launchDate}
          </p>
        </div>

        <div>
          <p className="text-gray-400">
            {description}
          </p>
        </div>

      </div>

      <div className="mt-8">

        <h3 className="text-lg font-semibold text-cyan-400">
          Índice de Confianza LAEX (ICL)
        </h3>

        <div className="mt-3 h-4 w-full rounded-full bg-gray-700">

          <div
            className="
              h-4
              w-[0%]
              rounded-full
              bg-cyan-400
            "
          />

        </div>

        <p className="mt-2 text-sm text-gray-500">
          Próximamente calculado mediante IA, comunidad y datos reales.
        </p>

      </div>
    </div>
  );
}