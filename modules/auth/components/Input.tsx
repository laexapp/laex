import { LucideIcon } from "lucide-react";

interface InputProps {
  icon: LucideIcon;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  iconColor?: string;
}

export default function Input({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  iconColor = "text-cyan-500",
}: InputProps) {
  return (
    <div className="relative">
      <Icon
        size={18}
        className={`absolute left-5 top-1/2 -translate-y-1/2 ${iconColor}`}
      />

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-700 bg-[#0B1018] py-4 pl-14 pr-5 text-white outline-none transition-all focus:border-cyan-400"
      />
    </div>
  );
}