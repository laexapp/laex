type ProjectQuickStatsProps = {
  launchDate: string;
  lastUpdate: string;
};

export default function ProjectQuickStats({
  launchDate,
  lastUpdate,
}: ProjectQuickStatsProps) {
  return (
    <div
      className="
        mt-5
        mb-5
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        p-4
      "
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
            Lanzamiento
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            {launchDate}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
            Última actualización
          </p>

          <p className="mt-1 text-sm font-semibold text-cyan-300">
            {lastUpdate}
          </p>
        </div>

      </div>
    </div>
  );
}