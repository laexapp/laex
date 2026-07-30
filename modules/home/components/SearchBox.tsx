import { ArrowRight, Sparkles } from "lucide-react";

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
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <span className="laex-eyebrow">01 / Intelligence</span>
          <h2 className="laex-display mt-4 text-4xl text-white md:text-6xl">Ask the ecosystem.</h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-500">
          Una pregunta puede revelar la señal que estabas buscando.
        </p>
      </div>

      <div className="laex-instrument relative grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[24px] p-3 sm:gap-6 sm:p-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-200">
          <Sparkles size={22} strokeWidth={1.5} aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <label htmlFor="laex-intelligence-query" className="block text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300">
            LAEX AI
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

        <div className="hidden border-l border-white/[0.07] px-5 md:grid">
          <span className="text-[9px] uppercase tracking-[0.15em] text-slate-600">Context</span>
          <strong className="mt-1 text-[10px] uppercase tracking-[0.15em] text-slate-300">Ecosystem</strong>
        </div>

        <ArrowRight className="absolute right-5 text-cyan-300 md:hidden" size={18} aria-hidden="true" />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onChange(suggestion)}
            className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2 text-xs text-slate-500 transition hover:border-cyan-300/25 hover:text-cyan-100"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
