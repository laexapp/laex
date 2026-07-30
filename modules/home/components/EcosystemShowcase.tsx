import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EcosystemShowcase() {
  return (
    <section className="laex-section border-t border-white/[0.06]">
      <div className="mb-10 grid gap-6 md:grid-cols-[1fr_0.65fr] md:items-end">
        <div>
          <span className="laex-eyebrow">03 / Connected intelligence</span>
          <h2 className="laex-display mt-5 text-4xl text-white md:text-6xl">
            Un solo ecosistema.
            <span className="block text-slate-500">Infinitas oportunidades.</span>
          </h2>
        </div>

        <p className="max-w-xl text-sm leading-7 text-slate-500 md:justify-self-end md:text-base">
          LAEX conecta proyectos, comunidades e inteligencia en una sola plataforma
          para ayudarte a descubrir nuevas oportunidades.
        </p>
      </div>

      <div className="group relative overflow-hidden rounded-[32px] border border-white/[0.1] bg-[#071018] shadow-[0_36px_90px_rgba(2,4,10,.46)]">
        <Image
          src="/projects/onemillionminers/laex-ecosystem-hero.webp"
          alt="Ecosistema LAEX"
          width={1536}
          height={1024}
          className="aspect-[16/8] w-full object-cover opacity-70 transition duration-700 group-hover:scale-[1.015] group-hover:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03070B] via-transparent to-transparent" />

        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-5 sm:inset-x-9 sm:bottom-9">
          <div>
            <span className="laex-eyebrow text-white/60">LAEX Network</span>
            <p className="mt-3 max-w-md text-lg font-medium text-white sm:text-2xl">
              Conocimiento conectado para mejores decisiones.
            </p>
          </div>

          <Link
            href="/proyectos"
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            aria-label="Explorar proyectos"
          >
            <ArrowRight size={19} />
          </Link>
        </div>
      </div>
    </section>
  );
}
