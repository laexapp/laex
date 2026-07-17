"use client";

import {
  useState,
} from "react";

interface LinkCardProps {

  referralCode: string;

}

export default function LinkCard({
  referralCode,
}: LinkCardProps) {

  const [copied, setCopied] =
    useState(false);

  async function copyLink() {

    const link =
      `https://laex.vercel.app/register?ref=${referralCode}`;

    await navigator.clipboard.writeText(
      link
    );

    setCopied(true);

    setTimeout(() => {

      setCopied(false);

    }, 2000);

  }

  return (

    <div
      className="
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
        🔗 Mi enlace personal
      </h2>

      <div
        className="
          mt-6
          rounded-2xl
          bg-[#0B1018]
          p-4
          break-all
          text-cyan-400
        "
      >

        https://laex.vercel.app/register?ref=
        {referralCode}

      </div>

      <button
        onClick={copyLink}
        className="
          mt-5
          rounded-xl
          bg-cyan-500
          px-6
          py-3
          font-bold
          transition-all
          hover:bg-cyan-400
        "
      >
        📋 Copiar enlace
      </button>

      {copied && (

        <p
          className="
            mt-4
            text-emerald-400
          "
        >
          ✅ Enlace copiado correctamente.
        </p>

      )}

    </div>

  );

}