import Image from "next/image";
import Link from "next/link";

export default function EcosystemShowcase() {
  return (
    <section className="w-full py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-10 text-center">

          <span className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-400">
            LAEX ECOSYSTEM
          </span>

          <h2 className="mt-4 text-5xl font-black text-white">
            Un solo ecosistema.
            <br />
            Infinitas oportunidades.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            LAEX conecta proyectos, comunidades e inteligencia en una sola
            plataforma para ayudarte a descubrir nuevas oportunidades.
          </p>

        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0D1422] shadow-2xl">

          <Image
            src="/projects/onemillionminers/laex-ecosystem-hero.webp"
            alt="LAEX Ecosystem"
            width={1536}
            height={1024}
            className="w-full object-cover transition duration-500 hover:scale-[1.02]"
            priority
          />

        </div>

        <div className="mt-10 flex justify-center">

          <Link
            href="/proyectos"
            className="rounded-2xl bg-cyan-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(0,212,255,.35)]"
          >
            Explorar proyectos
          </Link>

        </div>

      </div>

    </section>
  );
}