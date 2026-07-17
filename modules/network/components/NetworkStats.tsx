interface NetworkStatsProps {

  referralCode: string;

  directReferrals: number;

  secondLevelReferrals: number;

  totalNetwork: number;

}

export default function NetworkStats({
  referralCode,
  directReferrals,
  secondLevelReferrals,
  totalNetwork,
}: NetworkStatsProps) {

  return (

    <div
      className="
        mt-10
        grid
        gap-6
        md:grid-cols-2
        xl:grid-cols-4
      "
    >

      <div
        className="
          rounded-3xl
          border
          border-cyan-500/20
          bg-[#111827]
          p-6
        "
      >

        <p
          className="
            text-slate-400
          "
        >
          Código
        </p>

        <h2
          className="
            mt-3
            text-2xl
            font-black
          "
        >
          {referralCode}
        </h2>

      </div>

      <div
        className="
          rounded-3xl
          border
          border-cyan-500/20
          bg-[#111827]
          p-6
        "
      >

        <p
          className="
            text-slate-400
          "
        >
          Directos
        </p>

        <h2
          className="
            mt-3
            text-5xl
            font-black
            text-cyan-400
          "
        >
          {directReferrals}
        </h2>

      </div>

      <div
        className="
          rounded-3xl
          border
          border-cyan-500/20
          bg-[#111827]
          p-6
        "
      >

        <p
          className="
            text-slate-400
          "
        >
          Segundo nivel
        </p>

        <h2
          className="
            mt-3
            text-5xl
            font-black
            text-cyan-400
          "
        >
          {secondLevelReferrals}
        </h2>

      </div>

      <div
        className="
          rounded-3xl
          border
          border-cyan-500/20
          bg-[#111827]
          p-6
        "
      >

        <p
          className="
            text-slate-400
          "
        >
          Red total
        </p>

        <h2
          className="
            mt-3
            text-5xl
            font-black
            text-cyan-400
          "
        >
          {totalNetwork}
        </h2>

      </div>

    </div>

  );

}