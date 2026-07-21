import { GlassCard } from "@/modules/ui";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBox({
  value,
  onChange,
  placeholder = "Ask LAEX... What project do you want to understand today?",
}: SearchBoxProps) {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <GlassCard className="rounded-[32px] p-2">
        <div className="flex items-center gap-4 rounded-[28px] px-6 py-5">
          <div className="text-2xl opacity-80">
            🔍
          </div>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
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
        <Suggestion
          text="🚀 OneMillionMiners"
          onClick={() => onChange("OneMillionMiners")}
        />

        <Suggestion
          text="💎 OMDB"
          onClick={() => onChange("OMDB")}
        />

        <Suggestion
          text="🟦 OMD"
          onClick={() => onChange("OMD")}
        />
      </div>
    </div>
  );
}

type SuggestionProps = {
  text: string;
  onClick: () => void;
};

function Suggestion({
  text,
  onClick,
}: SuggestionProps) {
  return (
    <button
      onClick={onClick}
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