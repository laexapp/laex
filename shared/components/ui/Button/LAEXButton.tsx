type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function LAEXButton({
  children,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="
        px-6
        py-3
        rounded-xl
        bg-cyan-500
        hover:bg-cyan-400
        transition-all
        duration-300
        font-semibold
        text-white
      "
    >
      {children}
    </button>
  );
}