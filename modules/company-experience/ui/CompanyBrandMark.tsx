import Image from "next/image";
import type { PublicCompanyExperienceDTO } from "../types";

type CompanyBrandMarkProps = {
  brand: PublicCompanyExperienceDTO["brand"];
  className?: string;
  compact?: boolean;
  priority?: boolean;
};

export function CompanyBrandMark({ brand, className = "", compact = false, priority = false }: CompanyBrandMarkProps) {
  const src = compact ? brand.faviconUrl : brand.logoUrl;

  if (!src) return <span className={className}>{brand.logoText}</span>;

  return (
    <span className={`${className} ${compact ? "ce-brand-mark-isotipo" : "ce-brand-mark-logo"}`.trim()}>
      <Image
        src={src}
        alt={compact ? `${brand.logoText} isotipo` : brand.logoText}
        width={compact ? 1254 : 2172}
        height={compact ? 1254 : 724}
        priority={priority}
        sizes={compact ? "64px" : "(max-width: 680px) 180px, 520px"}
      />
    </span>
  );
}
