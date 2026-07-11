import Link from "next/link";
import HeroSpotlight from "./HeroSpotlight";

export default function Hero() {
  return (
    <section className="w-full py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 overflow-visible px-6 lg:grid-cols-[1fr_1.15fr]">

        {/* Columna izquierda */}

        <div>

          <p className="font-semibold uppercase tracking-[0.3em] text-cyan-400">
            LAEX Identity 1.0
          </p>

          <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">
            The Intelligence
            <br />
            Operating System
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-gray-400">
            Understand projects.
            Discover opportunities.
            Make informed decisions.
          </p>

          <div className="mt-14 flex flex-wrap gap-4">

            <Link
  href="/ia"
  className="rounded-2xl bg-cyan-500 px-8 py-4 font-semibold transition-all hover:bg-cyan-400"
>
  Ask LAEX
</Link>

           <Link
  href="/proyectos"
  className="rounded-2xl border border-gray-700 px-8 py-4 transition-all hover:border-cyan-400"
>
  Explore Projects
</Link>

          </div>

        </div>

        {/* Columna derecha */}

        <div className="relative flex justify-end">
  <HeroSpotlight />
</div>
      </div>
    </section>
  );
}