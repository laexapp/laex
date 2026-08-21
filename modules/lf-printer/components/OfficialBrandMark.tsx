import Image from "next/image";
import { lfPrinterBrandIdentity } from "../infrastructure/brand-identity";

export function OfficialBrandMark({ compact = false }: { compact?: boolean }) {
  return <div className={`relative flex shrink-0 items-center justify-center ${compact ? "h-14 w-28" : "h-16 w-40"}`} aria-label="LF-PRINTER · Identidad oficial">
    <Image src={lfPrinterBrandIdentity.variants.darkBackground} alt="LF-PRINTER" fill priority sizes={compact ? "112px" : "160px"} className="object-contain object-center"/>
  </div>;
}
