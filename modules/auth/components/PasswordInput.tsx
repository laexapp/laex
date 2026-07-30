import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  value: string;
  showPassword: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
  label?: string;
  autoComplete?: string;
}

export default function PasswordInput({ value, showPassword, onChange, onToggle, label = "Contraseña", autoComplete = "current-password" }: PasswordInputProps) {
  return (
    <div>
      <label htmlFor="identity-password" className="mb-2.5 block text-[9px] font-bold uppercase tracking-[0.17em] text-slate-500">{label}</label>
      <div className="group relative">
        <Lock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition group-focus-within:text-cyan-300" aria-hidden="true" />
        <input id="identity-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} className="w-full rounded-2xl border border-white/[0.09] bg-[#071018]/78 py-4 pl-12 pr-12 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,.035)] outline-none transition duration-300 placeholder:text-slate-700 hover:border-white/15 focus:border-cyan-300/35 focus:ring-2 focus:ring-cyan-300/15" />
        <button type="button" onClick={onToggle} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-600 transition hover:bg-white/[0.05] hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70">
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}
