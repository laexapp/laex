import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveCompanyExperience, toPublicExperience, vehicleStatusLabels } from "@/modules/company-experience/engine";
import { CompanyBrandMark } from "@/modules/company-experience/ui/CompanyBrandMark";
import { CompanyTopBar } from "@/modules/company-experience/ui/CompanyTopBar";
import { ReservationForm } from "@/modules/company-experience/ui/ReservationForm";
import "../../../company-experience-entry.css";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Page({ params, searchParams }: { params: Promise<{ company: string; slug: string }>; searchParams: Promise<{ startDate?: string; endDate?: string }> }) {
  const route = await params;
  const query = await searchParams;
  const definition = resolveCompanyExperience(route.company);
  if (!definition) notFound();
  const data = toPublicExperience(definition);
  const item = data.catalog.find((candidate) => candidate.slug === route.slug);
  if (!item) notFound();
  const style = {
    "--ce-primary": data.brand.primaryColor,
    "--ce-secondary": data.brand.secondaryColor,
    "--ce-accent": data.brand.accentColor,
    "--ce-surface": data.brand.surfaceColor,
    "--ce-text": data.brand.textColor,
    "--ce-font": data.brand.fontFamily,
  } as React.CSSProperties;

  return (
    <main className="ce-shell ce-detail" style={style}>
      <CompanyTopBar data={data} />
      <header className="ce-nav">
        <Link href={`/empresas/${data.company.slug}`} className="ce-logo">
          <CompanyBrandMark brand={data.brand} className="ce-nav-brand-full" priority />
          <CompanyBrandMark brand={data.brand} className="ce-nav-brand-compact" compact priority />
        </Link>
        <Link href={`/empresas/${data.company.slug}`}>← VOLVER A LA FLOTA</Link>
      </header>
      <div className="ce-demo">{data.experience.demoNotice}</div>
      <section className="ce-detail-grid">
        <div className="ce-detail-image">
          <Image src={item.image} alt={item.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 55vw" />
          <CompanyBrandMark brand={data.brand} className="ce-detail-isotipo" compact />
        </div>
        <div>
          <CompanyBrandMark brand={data.brand} className="ce-detail-brand" />
          <span className="ce-eyebrow">{item.year} · VEHÍCULO DEMO</span>
          <h1>{item.name}</h1>
          <span className={`ce-availability ${item.operationalStatus === "available" ? "is-available" : "is-unavailable"}`}>{vehicleStatusLabels[item.operationalStatus ?? "available"]}</span>
          <p>{item.summary}</p>
          <div className="ce-specs"><span><b>{item.passengers}</b> pasajeros</span><span><b>{item.transmission}</b> transmisión</span><span><b>{item.fuel}</b> combustible</span><span><b>{item.luggage}</b> equipajes</span></div>
          <ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          <h2>Disponibilidad y reserva</h2>
          <ReservationForm company={data.company.slug} itemSlug={item.slug} accent={data.brand.accentColor} initialStartDate={query.startDate} initialEndDate={query.endDate} />
        </div>
      </section>
    </main>
  );
}
