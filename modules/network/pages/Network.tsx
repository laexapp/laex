"use client";

import { Network, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/modules/auth/hooks/useCurrentUser";
import Header from "@/modules/layout/components/Header";
import LinkCard from "../components/LinkCard";
import NetworkStats from "../components/NetworkStats";
import ReferralCard from "../components/ReferralCard";
import { networkService, type NetworkData } from "../services/network.service";
import type { ReferralUser } from "../types/network";

export default function NetworkPage() {
  const currentUser = useCurrentUser();
  const [network, setNetwork] = useState<NetworkData | null>(null);
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    networkService.getNetwork(currentUser.uid).then(setNetwork);
    networkService.getDirectReferrals(currentUser.uid).then(setReferrals);
  }, [currentUser]);

  return (
    <div className="laex-canvas min-h-screen text-white">
      <Header />
      <main className="mx-auto w-[min(100%-2rem,92rem)] pb-24 pt-12 sm:pt-16 lg:pb-32 lg:pt-20">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(14,26,43,.92),rgba(5,7,13,.9))] px-6 py-8 shadow-[var(--laex-shadow-panel)] sm:px-10 sm:py-11 lg:px-14 lg:py-14">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-cyan-300/[0.07] blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-[18%] h-px w-52 bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="laex-eyebrow flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-xl border border-cyan-200/15 bg-cyan-300/[0.07]"><Network size={15} aria-hidden="true" /></span>Ecosistema de conexiones</div>
              <h1 className="laex-display mt-6 text-[clamp(2.75rem,7vw,5.75rem)]">Mi <span className="text-cyan-200">Red</span></h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">Tu centro de crecimiento dentro de LAEX. Comparte tu acceso, construye comunidad y observa cómo se expande tu red.</p>
            </div>
            <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 backdrop-blur-xl">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-300/[0.08] text-emerald-300"><span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(74,222,128,.8)]" /><UsersRound size={17} aria-hidden="true" /></span>
              <span><span className="block text-[10px] font-bold uppercase tracking-[.2em] text-emerald-300">Red activa</span><span className="mt-1 block text-xs text-slate-400">Lista para crecer</span></span>
            </div>
          </div>
        </header>

        <section className="mt-6 grid items-stretch gap-6 xl:grid-cols-[1.15fr_.85fr]">
          <LinkCard referralCode={network?.referralCode ?? ""} />
          <NetworkStats referralCode={network?.referralCode ?? "..."} directReferrals={network?.directReferrals ?? 0} secondLevelReferrals={network?.secondLevelReferrals ?? 0} totalNetwork={network?.totalNetwork ?? 0} />
        </section>

        <section className="laex-surface mt-6 rounded-[2rem] p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div><span className="laex-eyebrow">Comunidad directa</span><h2 className="mt-3 text-2xl font-semibold tracking-[-.035em] sm:text-3xl">Personas que se sumaron contigo</h2></div>
            <span className="w-fit rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">{referrals.length} {referrals.length === 1 ? "conexión" : "conexiones"}</span>
          </div>
          {referrals.length === 0 ? (
            <div className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.1] bg-black/10 px-6 py-12 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-cyan-200/15 bg-cyan-300/[0.06] text-cyan-200 shadow-[0_0_36px_rgba(55,216,238,.08)]"><UsersRound size={24} aria-hidden="true" /></span>
              <h3 className="mt-5 text-lg font-semibold">Tu próxima conexión empieza aquí</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Todavía no tienes invitados directos. Comparte tu enlace personal para comenzar a construir tu comunidad.</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{referrals.map((referral) => <ReferralCard key={referral.uid} referral={referral} />)}</div>
          )}
        </section>
      </main>
    </div>
  );
}
