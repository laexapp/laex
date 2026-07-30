import { LoaderCircle } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  variant?: "primary" | "secondary";
}

export const identitySecondaryClass = "flex w-full items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.025] px-5 py-4 text-sm font-semibold text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] transition duration-300 hover:border-cyan-300/25 hover:bg-white/[0.055] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70";

export default function Button({ children, onClick, disabled = false, loading = false, loadingLabel = "Procesando...", variant = "primary" }: ButtonProps) {
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading} className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-bold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 disabled:cursor-not-allowed disabled:opacity-45 ${variant === "primary" ? "border border-cyan-200/20 bg-gradient-to-b from-cyan-300 to-cyan-500 text-[#031016] shadow-[0_16px_40px_rgba(34,199,230,.2)] hover:-translate-y-0.5 hover:from-cyan-200 hover:to-cyan-400 hover:shadow-[0_20px_50px_rgba(34,199,230,.3)]" : identitySecondaryClass}`}>
      {loading && <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
      {loading ? loadingLabel : children}
    </button>
  );
}
