type TrustBadgeProps = {
  score: number;
};

export default function TrustBadge({
  score,
}: TrustBadgeProps) {
  const getLevel = () => {
    if (score >= 95) {
      return {
        label: "PLATINO",
        icon: "💎",
        color:
          "border-cyan-400/40 bg-cyan-500/10 text-cyan-300",
      };
    }

    if (score >= 85) {
      return {
        label: "ORO",
        icon: "🥇",
        color:
          "border-yellow-400/40 bg-yellow-500/10 text-yellow-300",
      };
    }

    if (score >= 70) {
      return {
        label: "PLATA",
        icon: "🥈",
        color:
          "border-slate-300/30 bg-slate-400/10 text-slate-200",
      };
    }

    if (score >= 50) {
      return {
        label: "BRONCE",
        icon: "🥉",
        color:
          "border-orange-400/40 bg-orange-500/10 text-orange-300",
      };
    }

    return {
      label: "EN OBSERVACIÓN",
      icon: "⚠",
      color:
        "border-red-500/40 bg-red-500/10 text-red-300",
    };
  };

  const level = getLevel();

  return (
    <div
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        px-3
        py-1.5
        text-xs
        font-bold
        tracking-wide
        ${level.color}
      `}
    >
      <span>{level.icon}</span>

      <span>{level.label}</span>

      <span className="opacity-70">
        {score}/100
      </span>
    </div>
  );
}