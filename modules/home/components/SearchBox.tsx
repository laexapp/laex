import { GlassCard } from "@/modules/ui";

export default function SearchBox() {
  return (
    <div className="mx-auto w-full max-w-5xl">

      <GlassCard className="rounded-[32px] p-2">

        <div className="flex items-center gap-4 rounded-[28px] px-6 py-5">

          <div className="text-2xl opacity-80">
            🔍
          </div>

          <input
            type="text"
            placeholder="Ask LAEX... What project do you want to understand today?"
            className="
              w-full
              bg-transparent
              text-lg
              text-white
              outline-none
              placeholder:text-gray-500
            "
          />

        </div>

      </GlassCard>

      <div className="mt-6 flex flex-wrap gap-3">

        <Suggestion text="🚀 OneMillionMiners" />

        <Suggestion text="💎 OMDB" />

        <Suggestion text="🟦 OMD" />

      </div>

    </div>
  );
}

type SuggestionProps = {
  text: string;
};

function Suggestion({ text }: SuggestionProps) {
  return (
    <button
      className="
        rounded-full
        border
        border-white/10
        bg-white/5
        px-4
        py-2
        text-sm
        text-gray-300
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-cyan-400/50
        hover:bg-cyan-500/10
        hover:text-white
      "
    >
      {text}
    </button>
  );
}