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
    <div className="mt-10 grid gap-6 md:grid-cols-4">

      <div className="rounded-2xl border border-cyan-900 bg-[#101826] p-6">
        <p className="text-sm text-gray-400">ICL</p>
        <h2 className="mt-2 text-3xl font-bold text-cyan-400">
          {trustIndex}
        </h2>
      </div>

      <div className="rounded-2xl border border-cyan-900 bg-[#101826] p-6">
        <p className="text-sm text-gray-400">IA</p>
        <h2 className="mt-2 text-3xl font-bold text-white">
          {aiScore}
        </h2>
      </div>

      <div className="rounded-2xl border border-cyan-900 bg-[#101826] p-6">
        <p className="text-sm text-gray-400">Comunidad</p>
        <h2 className="mt-2 text-3xl font-bold text-white">
          {communityScore}
        </h2>
      </div>

      <div className="rounded-2xl border border-cyan-900 bg-[#101826] p-6">
        <p className="text-sm text-gray-400">Riesgo</p>
        <h2 className="mt-2 text-3xl font-bold text-red-400">
          {riskLevel}
        </h2>
      </div>

    </div>
  );
}