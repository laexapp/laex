interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  children,
  onClick,
  disabled = false,
  loading = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full rounded-2xl py-4 text-lg font-bold transition-all ${
        disabled || loading
          ? "cursor-not-allowed bg-slate-700 text-slate-400"
          : "bg-cyan-500 text-white hover:bg-cyan-400"
      }`}
    >
      {loading ? "Procesando..." : children}
    </button>
  );
}