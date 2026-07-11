export default function SearchBox() {
  return (
    <div className="w-full max-w-4xl">

      <div
        className="
          rounded-3xl
          border
          border-gray-800
          bg-[#111827]
          px-6
          py-5
          transition-all
          hover:border-cyan-400
          focus-within:border-cyan-400
        "
      >
        <input
          type="text"
          placeholder="Ask LAEX... What project do you want to understand today?"
          className="
            w-full
            bg-transparent
            outline-none
            text-lg
            text-white
            placeholder:text-gray-500
          "
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">

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
        border-gray-700
        px-4
        py-2
        text-sm
        text-gray-300
        hover:border-cyan-400
        hover:text-white
        transition-all
      "
    >
      {text}
    </button>
  );
}