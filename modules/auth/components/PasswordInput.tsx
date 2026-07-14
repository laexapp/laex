import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  value: string;
  showPassword: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}

export default function PasswordInput({
  value,
  showPassword,
  onChange,
  onToggle,
}: PasswordInputProps) {
  return (
    <div className="relative">
      <Lock
        size={18}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500"
      />

      <input
        type={showPassword ? "text" : "password"}
        placeholder="Contraseña"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-700 bg-[#0B1018] py-4 pl-14 pr-14 text-white outline-none transition-all focus:border-cyan-400"
      />

      <button
        type="button"
        onClick={onToggle}
        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
      >
        {showPassword ? (
          <EyeOff size={20} />
        ) : (
          <Eye size={20} />
        )}
      </button>
    </div>
  );
}