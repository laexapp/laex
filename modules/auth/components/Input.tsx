import type { LucideIcon } from "lucide-react";

interface InputProps {
  icon: LucideIcon;
  type?: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  error?: string;
}

export default function Input({ icon: Icon, type = "text", label, placeholder, value, onChange, autoComplete, error }: InputProps) {
  const id = `identity-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div>
      <label htmlFor={id} className="mb-2.5 block text-[9px] font-bold uppercase tracking-[0.17em] text-slate-500">{label}</label>
      <div className="group relative">
        <Icon size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition group-focus-within:text-cyan-300" aria-hidden="true" />
        <input id={id} type={type} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`w-full rounded-2xl border bg-[#071018]/78 py-4 pl-12 pr-4 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,.035)] outline-none transition duration-300 placeholder:text-slate-700 hover:border-white/15 focus:ring-2 ${error ? "border-rose-400/40 focus:border-rose-300/60 focus:ring-rose-300/15" : "border-white/[0.09] focus:border-cyan-300/35 focus:ring-cyan-300/15"}`} />
      </div>
      {error && <p id={`${id}-error`} className="mt-2 text-xs text-rose-300">{error}</p>}
    </div>
  );
}
