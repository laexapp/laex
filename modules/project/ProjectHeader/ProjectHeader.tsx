type ProjectHeaderProps = {
  name: string;
  category: string;
  status: string;
  launch: string;
};

export default function ProjectHeader({
  name,
  category,
  status,
  launch,
}: ProjectHeaderProps) {
  return (
    <div className="rounded-2xl border border-cyan-900 bg-[#101826] p-8">

      <span className="text-cyan-400 text-sm uppercase tracking-widest">
        Proyecto Analizado
      </span>

      <h2 className="mt-3 text-4xl font-bold text-white">
        {name}
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-3">

        <div>
          <p className="text-gray-500 text-sm">
            Categoría
          </p>

          <p className="text-white font-semibold">
            {category}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Estado
          </p>

          <p className="text-green-400 font-semibold">
            {status}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Lanzamiento
          </p>

          <p className="text-white font-semibold">
            {launch}
          </p>
        </div>

      </div>

    </div>
  );
}