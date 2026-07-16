"use client";

import Logo from "./Logo";
import Navigation from "./Navigation";

import { useCurrentUser }
  from "@/modules/auth/hooks/useCurrentUser";

export default function Header() {

  const user =
    useCurrentUser();

  const referralLink =
    user
      ? `https://laex.vercel.app/register?ref=${user.referralCode}`
      : "";

  return (

    <header
      className="
        sticky
        top-0
        z-50
        w-full
        bg-[#05070D]/95
        backdrop-blur-2xl
      "
    >

      <div
        className="
          flex
          h-16
          w-full
          items-center
          justify-between
          px-8
          xl:px-12
        "
      >

        <div
          className="
            flex
            items-center
            gap-8
          "
        >

          <Logo />

          {user && (

            <div
              className="
                hidden
                lg:flex
                items-center
                gap-3
                rounded-xl
                border
                border-cyan-500/20
                bg-cyan-500/5
                px-4
                py-2
              "
            >

              <span>

                🌳

              </span>

              <span
                className="
                  max-w-[380px]
                  truncate
                  text-xs
                  text-cyan-300
                "
              >

                {referralLink}

              </span>

            </div>

          )}

        </div>

        <Navigation />

      </div>

    </header>

  );

}