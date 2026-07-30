import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
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
      <span className="hidden rounded-md border border-cyan-300/20 bg-cyan-300/[0.05] px-2 py-1 text-[9px] font-bold tracking-[0.2em] text-cyan-200 sm:inline-flex">
        N·X
      </span>
    </div>
  );
}
