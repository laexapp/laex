import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/platform" className="group flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70" aria-label="LAEX Intelligence OS — Inicio">
      <Image
        src="/brand/logo/logo-header.png"
        alt="LAEX"
        width={1536}
        height={1024}
        priority
        style={{
          width: "clamp(150px, 16vw, 205px)",
          height: "auto",
        }}
      />
      <span className="hidden rounded-md border border-cyan-300/20 bg-cyan-300/[0.05] px-2 py-1 text-[9px] font-bold tracking-[0.2em] text-cyan-200 transition group-hover:border-cyan-300/40 group-hover:bg-cyan-300/[0.09] sm:inline-flex">
        N·X
      </span>
    </Link>
  );
}
