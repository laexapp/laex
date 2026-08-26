import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CalendarSearch, CarFront, Search } from "lucide-react";
import type { PublicCompanyExperienceDTO } from "../types";
import { AvailabilityExplorer } from "./AvailabilityExplorer";
import { CompanyBrandMark } from "./CompanyBrandMark";
import { CompanyTopBar } from "./CompanyTopBar";

export function CompanyExperiencePage({ data }: { data: PublicCompanyExperienceDTO }) {
  const style = {
    "--ce-primary": data.brand.primaryColor,
    "--ce-secondary": data.brand.secondaryColor,
    "--ce-accent": data.brand.accentColor,
    "--ce-surface": data.brand.surfaceColor,
    "--ce-text": data.brand.textColor,
    "--ce-font": data.brand.fontFamily,
  } as React.CSSProperties;

  return (
    <main className="ce-shell" style={style}>
      <CompanyTopBar data={data} />
      <header className="ce-nav">
        <Link href={`/empresas/${data.company.slug}`} className="ce-logo">
          <CompanyBrandMark brand={data.brand} className="ce-nav-brand-full" priority />
          <CompanyBrandMark brand={data.brand} className="ce-nav-brand-compact" compact priority />
        </Link>
        <nav><a href="#disponibilidad">Disponibilidad</a><a href="#flota">Flota</a><a href="#servicios">Servicios</a><a href="#contacto">Contacto</a></nav>
        <a className="ce-nav-cta" href="#disponibilidad"><CalendarDays aria-hidden size={17} /> RESERVAR</a>
      </header>
      {data.experience.demoNotice && <div className="ce-demo">{data.experience.demoNotice}</div>}
      <section className="ce-hero">
        <div className="ce-hero-copy">
          <CompanyBrandMark brand={data.brand} className="ce-hero-brand" priority />
          <span className="ce-eyebrow">MOVILIDAD INTELIGENTE · PROVINCIA DUARTE</span>
          <h1>Tu próxima ruta, <em>lista en minutos.</em></h1>
          <p>{data.company.description}</p>
          <div className="ce-journey"><span><b><Search aria-hidden size={15} /></b><small>01<br />Encuentra</small></span><i>→</i><span><b><CalendarSearch aria-hidden size={15} /></b><small>02<br />Verifica</small></span><i>→</i><span><b><CarFront aria-hidden size={15} /></b><small>03<br />Reserva</small></span></div>
          <a className="ce-button" href="#disponibilidad">COMPROBAR DISPONIBILIDAD <b>→</b></a>
        </div>
        <div className="ce-hero-art">
          <Image src={data.catalog[0].image} alt={data.catalog[0].imageAlt} fill priority sizes="(max-width: 800px) 100vw, 55vw" />
          <div className="ce-hero-overlay" />
          <CompanyBrandMark brand={data.brand} className="ce-hero-isotipo" compact />
          <span className="ce-float-chip ce-float-status"><i /> DISPONIBILIDAD EN TIEMPO REAL</span>
          <span className="ce-float-chip ce-float-place">SAN FRANCISCO DE MACORÍS<br /><b>REPÚBLICA DOMINICANA</b></span>
          <span className="ce-hero-index">LAEX / MOBILITY 01</span>
        </div>
      </section>
      <section id="disponibilidad" className="ce-section ce-fleet-stage">
        <div className="ce-heading"><span className="ce-eyebrow">ENCUENTRA · VERIFICA · RESERVA</span><h2>Una experiencia de alquiler sin fricción.</h2><p>Selecciona tus fechas y descubre qué vehículo demo encaja con tu ruta.</p></div>
        <AvailabilityExplorer company={data.company.slug} catalog={data.catalog} />
      </section>
      <section id="servicios" className="ce-services">
        <div className="ce-services-heading"><div className="ce-heading"><span className="ce-eyebrow">SERVICIOS</span><h2>Tecnología que acompaña cada kilómetro.</h2></div><CompanyBrandMark brand={data.brand} className="ce-services-isotipo" compact /></div>
        <div>{data.services.map((service, index) => <article key={service.id}><b>0{index + 1}</b><h3>{service.name}</h3><p>{service.description}</p></article>)}</div>
      </section>
      <footer id="contacto" className="ce-footer">
        <div><CompanyBrandMark brand={data.brand} className="ce-footer-brand" /><span className="ce-eyebrow">CONTACTO DIRECTO</span><h2>Tu próxima ruta comienza aquí.</h2></div>
        <div><a href={`https://wa.me/${data.contact.whatsapp}`}>WhatsApp · {data.contact.phone}</a><a href={`tel:${data.contact.phone.replace(/[^+\d]/g, "")}`}>{data.contact.phone}</a><a href={`mailto:${data.contact.email}`}>{data.contact.email}</a><span>{data.contact.address}</span><span>{data.contact.hours}</span></div>
      </footer>
    </main>
  );
}
