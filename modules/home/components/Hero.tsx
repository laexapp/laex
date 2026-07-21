import Link from "next/link";
import HeroSpotlight from "./HeroSpotlight";

import {
  GlowButton,
  GradientTitle,
} from "@/modules/ui";

export default function Hero() {
  return (
    <section className="relative w-full py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="font-semibold uppercase tracking-[0.35em] text-cyan-400">
            LAEX Identity 1.0
          </p>

          <div className="mt-6">
            <GradientTitle>
              The Intelligence
              <br />
              Operating System
            </GradientTitle>
          </div>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-gray-400">
            Understand projects.
            Discover opportunities.
            Make informed decisions.
          </p>

          <div className="mt-14 flex flex-wrap gap-5">
            <GlowButton asChild size="lg">
              <Link href="/ia">
                Ask LAEX
              </Link>
            </GlowButton>

            <GlowButton
              asChild
              variant="secondary"
              size="lg"
            >
              <Link href="/proyectos">
                Explore Projects
              </Link>
            </GlowButton>
          </div>
        </div>

        <div className="relative flex justify-end">
          <HeroSpotlight />
        </div>
      </div>
    </section>
  );
}