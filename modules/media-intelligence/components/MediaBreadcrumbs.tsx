"use client";

import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  operations: "Operaciones",
  flow: "Recorrido ejecutivo",
};

export default function MediaBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean).slice(1);

  return <div className="border-b border-white/[0.055] bg-[#050a12]/70">
    <div className="mx-auto flex min-h-12 w-[min(100%-2rem,92rem)] items-center gap-2 overflow-x-auto text-xs text-slate-500">
      <Link href="/platform" className="inline-flex items-center gap-2 font-medium hover:text-cyan-200">
        <Sparkles size={14} aria-hidden="true" /> LAEX
      </Link>
      <ChevronRight size={13} aria-hidden="true" className="shrink-0 text-slate-700" />
      <Link href="/media-intelligence" className="whitespace-nowrap font-semibold text-slate-300 hover:text-cyan-200">Media Intelligence</Link>
      {segments.map((segment, index) => {
        const segmentHref = `/media-intelligence/${segments.slice(0, index + 1).join("/")}`;
        return <span key={segmentHref} className="inline-flex items-center gap-2">
          <ChevronRight size={13} aria-hidden="true" className="shrink-0 text-slate-700" />
          <Link href={segmentHref} aria-current={segmentHref === pathname ? "page" : undefined} className={segmentHref === pathname ? "whitespace-nowrap font-semibold text-cyan-200" : "whitespace-nowrap hover:text-cyan-200"}>{labels[segment] ?? segment}</Link>
        </span>;
      })}
    </div>
  </div>;
}

