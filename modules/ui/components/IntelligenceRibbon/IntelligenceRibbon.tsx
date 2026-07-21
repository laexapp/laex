type IntelligenceRibbonProps = {
  trustIndex: number;
  aiScore: number;
  communityScore: number;
  riskLevel: number;
};

export default function IntelligenceRibbon({
  trustIndex,
  aiScore,
  communityScore,
  riskLevel,
}: IntelligenceRibbonProps) {
  const getRisk = () => {
    if (riskLevel <= 25) {
      return {
        label: "Bajo",
        color: "text-emerald-400",
        bar: "bg-emerald-400",
      };
    }

    if (riskLevel <= 60) {
      return {
        label: "Medio",
        color: "text-amber-400",
        bar: "bg-amber-400",
      };
    }

    return {
      label: "Alto",
      color: "text-red-400",
      bar: "bg-red-400",
    };
  };

  const risk = getRisk();

  const Metric = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: number;
    color: string;
  }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>

        <span className="font-bold text-white">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div
      className="
        mt-6
        rounded-2xl
        border
        border-cyan-500/20
        bg-gradient-to-br
        from-cyan-500/10
        to-slate-900/50
        p-4
        backdrop-blur-xl
      "
    >
      <div className="mb-4 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <span className="text-emerald-400 animate-pulse">
            ●
          </span>

          <span className="text-xs font-bold uppercase tracking-[0.30em] text-cyan-300">
            LAEX Intelligence
          </span>
        </div>

        <span className={`text-xs font-bold ${risk.color}`}>
          {risk.label}
        </span>

      </div>

      <div className="space-y-4">

        <Metric
          label="ICL"
          value={trustIndex}
          color="bg-cyan-400"
        />

        <Metric
          label="IA"
          value={aiScore}
          color="bg-violet-400"
        />

        <Metric
          label="Comunidad"
          value={communityScore}
          color="bg-emerald-400"
        />

      </div>

      <div className="mt-5">

        <div className="mb-2 flex justify-between text-xs">

          <span className="text-slate-400">
            Riesgo
          </span>

          <span className={risk.color}>
            {risk.label}
          </span>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">

          <div
            className={`h-full rounded-full transition-all duration-700 ${risk.bar}`}
            style={{
              width: `${100 - riskLevel}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}