import { Blocks, Building2, DatabaseZap, Layers3 } from "lucide-react";

const capabilities = [
  { Icon: Layers3, value: "04", label: "Proyectos integrados" },
  { Icon: DatabaseZap, value: "LIVE", label: "Market Intelligence" },
  { Icon: Blocks, value: "ON-CHAIN", label: "Evidencia blockchain" },
  { Icon: Building2, value: "MULTIEMPRESA", label: "Experiencias aisladas" },
];

export default function HomeEvidenceStrip() {
  return (
    <section className="mx-auto mt-6 grid w-[min(100%-2rem,92rem)] overflow-hidden rounded-2xl border border-white/[.045] bg-[#06101a]/58 shadow-[0_24px_75px_rgba(0,0,0,.26),inset_0_1px_0_rgba(255,255,255,.025)] backdrop-blur-xl md:grid-cols-2 xl:grid-cols-4">
      {capabilities.map(({ Icon, value, label }) => (
        <div
          key={label}
          className="flex items-center gap-4 border-b border-white/[.045] p-5 last:border-0 md:border-r xl:border-b-0"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-cyan-300/10 bg-cyan-300/[.055] text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,.055)]">
            <Icon size={21} />
          </span>
          <div>
            <b className="block text-sm tracking-[.05em] text-cyan-200">
              {value}
            </b>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.12em] text-slate-500">
              {label}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
