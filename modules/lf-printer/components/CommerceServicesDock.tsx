import Link from "next/link";
import { Clock3, MessageCircle, ShieldCheck, Wrench } from "lucide-react";
import { lfPrinterWhatsappUrl } from "../config/quick-actions";

export function CommerceServicesDock() {
  return (
    <section aria-label="Servicios LF-PRINTER" className="commerce-services-dock">
      <article className="commerce-service-card">
        <Wrench size={17}/><span><b>Taller LF-PRINTER</b><small>Recepción, diagnóstico y reparación documentada.</small></span>
      </article>
      <article className="commerce-service-card">
        <ShieldCheck size={17}/><span><b>Servicio con seguimiento</b><small>Autorización, control de calidad y entrega.</small></span>
      </article>
      <article className="commerce-service-note">
        <Clock3 size={14}/><span>Seguimiento responsable durante todo el servicio.</span>
      </article>
      <Link href="/proyectos/lf-printer/seguimiento" className="commerce-contact-link">
        <Clock3 size={15}/> Consultar mi pedido
      </Link>
      <a href={lfPrinterWhatsappUrl} target="_blank" rel="noreferrer" className="commerce-contact-link">
        <MessageCircle size={15}/> Contactar soporte por WhatsApp
      </a>
    </section>
  );
}
