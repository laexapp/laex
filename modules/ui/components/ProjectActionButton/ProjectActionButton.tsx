type ProjectActionButtonProps = {
  label?: string;
};

export default function ProjectActionButton({
  label = "Explorar",
}: ProjectActionButtonProps) {
  return (
    <button
      className="
        group
        inline-flex
        items-center
        gap-3
        rounded-full
        border
        border-cyan-400/30
        bg-cyan-500/10
        px-5
        py-3
        text-sm
        font-semibold
        text-cyan-300
        transition-all
        duration-300
        hover:border-cyan-300
        hover:bg-cyan-500
        hover:text-white
        hover:shadow-[0_0_30px_rgba(6,182,212,.40)]
      "
    >
      <span>{label}</span>

      <span
        className="
          transition-transform
          duration-300
          group-hover:translate-x-1
        "
      >
        →
      </span>
    </button>
  );
}