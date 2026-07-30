import { ArrowUpRight, BrainCircuit, Orbit, Sparkles } from "lucide-react";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const suggestions = ["OneMillionMiners", "OMDB", "OMD"];

export default function SearchBox({
  value,
  onChange,
  placeholder = "Pregunta por un proyecto, oportunidad o señal...",
}: SearchBoxProps) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <span className="laex-eyebrow">01 / Intelligence</span>
          <h2 className="laex-display mt-4 text-4xl text-white md:text-6xl">Ask the ecosystem.</h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-500">
          Una pregunta puede revelar la señal que estabas buscando.
        </p>
      </div>

      <div className="group relative">
        <div className="pointer-events-none absolute -inset-8 rounded-[44px] bg-[radial-gradient(circle_at_50%_50%,rgba(50,210,232,.13),transparent_64%)] opacity-70 blur-2xl transition-opacity duration-500 group-focus-within:opacity-100" />
        <div className="pointer-events-none absolute -inset-px rounded-[30px] bg-gradient-to-r from-cyan-300/30 via-white/10 to-violet-400/20 opacity-60" />

        <div className="laex-instrument relative grid min-h-28 grid-cols-[auto_1fr] items-center gap-4 overflow-hidden rounded-[29px] p-4 shadow-[0_32px_90px_rgba(0,0,0,.52),inset_0_1px_0_rgba(255,255,255,.08)] transition duration-500 group-focus-within:-translate-y-0.5 group-focus-within:border-cyan-300/30 group-focus-within:shadow-[0_38px_110px_rgba(0,0,0,.62),0_0_55px_rgba(50,210,232,.1)] sm:grid-cols-[auto_1fr_auto] sm:gap-6 sm:p-5">
          <div className="relative grid h-16 w-16 place-items-center rounded-[20px] border border-cyan-300/25 bg-cyan-300/[0.07] text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_0_30px_rgba(50,210,232,.08)]">
            <span className="absolute inset-2 animate-pulse rounded-full border border-cyan-300/10 motion-reduce:animate-none" />
            <BrainCircuit size={24} strokeWidth={1.45} aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <label htmlFor="laex-intelligence-query" className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-300">
              <Sparkles size={11} aria-hidden="true" /> LAEX Intelligence
            </label>
            <input
              id="laex-intelligence-query"
              type="search"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={placeholder}
              className="mt-2 w-full bg-transparent text-base font-medium text-white outline-none placeholder:text-slate-600 sm:text-xl"
            />
          </div>

          <div className="hidden min-w-36 border-l border-white/[0.08] px-6 md:block">
            <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-slate-600"><Orbit size={12} /> Live context</span>
            <strong className="mt-2 block text-[10px] uppercase tracking-[0.16em] text-slate-300">LAEX Ecosystem</strong>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide" aria-label="Consultas sugeridas">
        <span className="mr-1 hidden text-[9px] font-bold uppercase tracking-[0.17em] text-slate-600 sm:inline">Signals</span>
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onChange(suggestion)}
            className="group/chip inline-flex shrink-0 items-center gap-2 rounded-full border border-white/[0.09] bg-gradient-to-b from-white/[0.055] to-white/[0.02] px-4 py-2.5 text-xs text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-cyan-300/[0.06] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
          >
            <span className="font-mono text-[9px] text-cyan-300/55">0{index + 1}</span>
            {suggestion}
            <ArrowUpRight size={12} className="opacity-0 transition group-hover/chip:opacity-100" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
