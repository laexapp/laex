import { projects } from "@/core/projects/projects";
import HeroImage from "./HeroImage";

export default function Hero() {
  const featuredProject = projects[0];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center">

        <div>

          <span className="text-cyan-400 font-semibold tracking-widest uppercase">
            LAEX PLATFORM
          </span>

          <h1 className="mt-6 text-7xl font-black leading-tight text-white">
            Descubre.
            <br />
            Aprende.
            <br />
            Decide.
          </h1>

          <p className="mt-8 text-xl text-gray-400 leading-9">
            Transformamos datos dispersos en conocimiento claro,
            verificable y útil para ayudarte a tomar mejores decisiones.
          </p>

          <button className="mt-10 rounded-xl bg-cyan-500 px-8 py-4 text-lg font-bold text-white hover:bg-cyan-400 transition">
            Comenzar Ahora
          </button>

        </div>

        <HeroImage project={featuredProject} />

      </div>
    </section>
  );
}