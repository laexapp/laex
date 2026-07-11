import Link from "next/link";

type Props = {
  title: string;
  description: string;
};

export default function ConstructionPage({
  title,
  description,
}: Props) {
  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-20 text-center">

        <div className="mb-8">
          <img
            src="/logo-primary.png"
            alt="LAEX"
            className="mx-auto h-24 w-auto"
          />
        </div>

        <span className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-400">
          LAEX
        </span>

        <h1 className="mt-6 text-5xl font-black">
          {title}
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
          {description}
        </p>

        <div className="mt-14 w-full max-w-2xl rounded-3xl border border-cyan-500/20 bg-[#0D1422] p-10">

          <h2 className="text-2xl font-bold">
            🚧 Módulo en desarrollo
          </h2>

          <p className="mt-6 text-slate-400">
            Nuestro equipo está construyendo esta sección para ofrecer una
            experiencia completa dentro del ecosistema LAEX.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link
              href="/proyectos"
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold transition hover:bg-cyan-400"
            >
              Explorar proyectos
            </Link>

            <Link
              href="/ia"
              className="rounded-xl border border-cyan-500 px-6 py-3 font-semibold transition hover:bg-cyan-500/10"
            >
              Ir a LAEX AI
            </Link>

          </div>

        </div>

      </section>
    </main>
  );
}