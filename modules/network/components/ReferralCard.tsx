import type {
  ReferralUser,
} from "../types/network";

interface ReferralCardProps {

  referral: ReferralUser;

}

export default function ReferralCard({
  referral,
}: ReferralCardProps) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-slate-700
        bg-[#0B1018]
        p-5
      "
    >

      <h3
        className="
          text-lg
          font-bold
        "
      >
        👤 {referral.fullName}
      </h3>

      <p
        className="
          mt-2
          text-cyan-400
        "
      >
        @{referral.username}
      </p>

      <p
        className="
          mt-1
          text-slate-400
        "
      >
        {referral.email}
      </p>

    </div>

  );

}