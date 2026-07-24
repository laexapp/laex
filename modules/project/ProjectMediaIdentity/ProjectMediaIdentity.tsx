export default function ProjectMediaIdentity() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-[#0D1422] p-8">

      <span className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">
        Identidad Multimedia LAEX
      </span>

      <h2 className="mt-3 text-3xl font-black text-white">
        Canales oficiales del proyecto
      </h2>

      <p className="mt-4 max-w-3xl leading-7 text-slate-400">
        LAEX utilizará esta información para identificar y sincronizar
        únicamente las cuentas oficiales del proyecto. Esta identidad será
        la base para mostrar videos, Shorts, transmisiones en vivo,
        publicaciones sociales y futuras noticias verificadas.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-700 p-5">
          <p className="text-xs uppercase tracking-widest text-cyan-400">
            YouTube
          </p>

          <p className="mt-2 text-white">
            Sin configurar
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700 p-5">
          <p className="text-xs uppercase tracking-widest text-cyan-400">
            TikTok
          </p>

          <p className="mt-2 text-white">
            Sin configurar
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700 p-5">
          <p className="text-xs uppercase tracking-widest text-cyan-400">
            Instagram
          </p>

          <p className="mt-2 text-white">
            Sin configurar
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700 p-5">
          <p className="text-xs uppercase tracking-widest text-cyan-400">
            Facebook
          </p>

          <p className="mt-2 text-white">
            Sin configurar
          </p>
        </div>

      </div>

    </section>
  );
}