"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useCurrentUser,
} from "@/modules/auth/hooks/useCurrentUser";

import LinkCard
  from "../components/LinkCard";

import NetworkStats
  from "../components/NetworkStats";

import ReferralCard
  from "../components/ReferralCard";

import {
  networkService,
  type NetworkData,
} from "../services/network.service";

import type {
  ReferralUser,
} from "../types/network";

export default function NetworkPage() {

  const currentUser =
    useCurrentUser();

  const [network, setNetwork] =
    useState<NetworkData | null>(null);

  const [referrals, setReferrals] =
    useState<ReferralUser[]>([]);

  useEffect(() => {

    if (!currentUser) {
      return;
    }

    networkService
      .getNetwork(currentUser.uid)
      .then(setNetwork);

    networkService
      .getDirectReferrals(currentUser.uid)
      .then(setReferrals);

  }, [currentUser]);

  return (

    <main
      className="
        min-h-screen
        bg-[#070B14]
        px-8
        py-10
        text-white
      "
    >

      <h1
        className="
          text-4xl
          font-black
        "
      >
        🌳 Mi Red
      </h1>

      <p
        className="
          mt-3
          text-slate-400
        "
      >
        Centro de crecimiento
        de tu comunidad.
      </p>

      <LinkCard
        referralCode={
          network?.referralCode ?? ""
        }
      />

      <NetworkStats
        referralCode={
          network?.referralCode ?? "..."
        }
        directReferrals={
          network?.directReferrals ?? 0
        }
        secondLevelReferrals={
          network?.secondLevelReferrals ?? 0
        }
        totalNetwork={
          network?.totalNetwork ?? 0
        }
      />

      <section
        className="
          mt-10
          rounded-3xl
          border
          border-cyan-500/20
          bg-[#111827]
          p-8
        "
      >

        <h2
          className="
            text-2xl
            font-black
          "
        >
          👥 Invitados directos
        </h2>

        {referrals.length === 0 ? (

          <p
            className="
              mt-6
              text-slate-400
            "
          >
            Todavía no tienes invitados directos.
          </p>

        ) : (

          <div
            className="
              mt-6
              space-y-4
            "
          >

            {referrals.map(
              (referral) => (

                <ReferralCard
                  key={referral.uid}
                  referral={referral}
                />

              )
            )}

          </div>

        )}

      </section>

    </main>

  );

}