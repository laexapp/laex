import { Check } from "lucide-react";

interface CheckboxProps { id: string; checked: boolean; onChange: (checked: boolean) => void; children: React.ReactNode; }

export default function Checkbox({ id, checked, onChange, children }: CheckboxProps) {
  return (
    <div className="flex items-start gap-3">
      <label className="relative mt-0.5 grid h-5 w-5 shrink-0 cursor-pointer place-items-center">
        <input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer absolute inset-0 appearance-none rounded-md border border-white/15 bg-white/[0.035] transition checked:border-cyan-300/40 checked:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70" />
        <Check size={13} className="pointer-events-none relative text-[#031016] opacity-0 peer-checked:opacity-100" strokeWidth={3} />
      </label>
      <label htmlFor={id} className="text-xs leading-6 text-slate-500">{children}</label>
    </div>
  );
}
