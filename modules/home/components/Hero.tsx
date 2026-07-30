import Link from "next/link";
import HeroSpotlight from "./HeroSpotlight";

import {
  GlowButton,
  GradientTitle,
} from "@/modules/ui";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden py-20 md:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_38%,rgba(55,216,238,.10),transparent_28rem)]" />
      <div className="pointer-events-none absolute left-[8%] top-20 -z-10 h-40 w-px bg-gradient-to-b from-transparent via-cyan-300/25 to-transparent" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[1fr_1.15fr]">
        <div className="relative z-10">
          <p className="laex-eyebrow inline-flex items-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-cyan-300 to-transparent" />
            LAEX Identity 1.0
          </p>

          <div className="mt-6">
            <GradientTitle>
              The Intelligence
              <br />
              Operating System
            </GradientTitle>
          </div>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300/80 md:text-xl md:leading-9">
            Understand projects.
            Discover opportunities.
            Make informed decisions.
          </p>

          <div className="mt-12 flex flex-wrap gap-4 md:mt-14 md:gap-5">
            <GlowButton asChild size="lg">
              <Link href="/platform#assistant">
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
