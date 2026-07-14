interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}

export default function Checkbox({
  id,
  checked,
  onChange,
  children,
}: CheckboxProps) {
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-cyan-500"
      />

      <label
        htmlFor={id}
        className="text-sm leading-6 text-slate-400"
      >
        {children}
      </label>
    </div>
  );
}