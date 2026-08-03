import { AtSign, Mail, UserRound } from "lucide-react";
import type { ReferralUser } from "../types/network";

interface ReferralCardProps { referral: ReferralUser; }

export default function ReferralCard({ referral }: ReferralCardProps) {
  const initial = referral.fullName?.trim().charAt(0).toUpperCase() || "L";
  return (
    <article className="laex-card group rounded-3xl p-5">
      <div className="flex items-start gap-4">
        <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cyan-200/15 bg-gradient-to-br from-cyan-300/10 to-blue-400/5 text-base font-semibold text-cyan-100">{initial}<span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#09111e] bg-emerald-300" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2"><UserRound size={13} className="shrink-0 text-slate-600" aria-hidden="true" /><h3 className="truncate text-sm font-semibold text-slate-100">{referral.fullName}</h3></div>
          <p className="mt-2 flex items-center gap-2 text-xs text-cyan-200/80"><AtSign size={12} className="shrink-0" aria-hidden="true" /><span className="truncate">{referral.username}</span></p>
          <p className="mt-2 flex items-center gap-2 text-xs text-slate-500"><Mail size={12} className="shrink-0" aria-hidden="true" /><span className="truncate">{referral.email}</span></p>
        </div>
      </div>
    </article>
  );
}
