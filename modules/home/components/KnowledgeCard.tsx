type KnowledgeCardProps = {
  title: string;
  category: string;
  description: string;
  status: string;
};

export default function KnowledgeCard({
  title,
  category,
  description,
  status,
}: KnowledgeCardProps) {
  return (
    <div
      className="
        group
        rounded-3xl
        border
        border-gray-800
        bg-[#111827]
        p-8
        transition-all
        duration-300
        hover:border-cyan-400
        hover:-translate-y-1
      "
    >
      <span className="text-sm uppercase tracking-widest text-cyan-400">
        {category}
      </span>

      <h3 className="mt-4 text-3xl font-bold">
        {title}
      </h3>

      <p className="mt-5 text-gray-400 leading-7">
        {description}
      </p>

      <div className="mt-8 flex items-center justify-between">

        <span className="text-sm text-green-400">
          ● {status}
        </span>

        <button
          className="
            rounded-xl
            border
            border-gray-700
            px-5
            py-2
            text-sm
            hover:border-cyan-400
            transition-all
          "
        >
          Open Knowledge
        </button>

      </div>
    </div>
  );
}