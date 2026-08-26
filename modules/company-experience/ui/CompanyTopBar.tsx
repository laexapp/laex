import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { PublicCompanyExperienceDTO } from "../types";

export function CompanyTopBar({ data }: { data: PublicCompanyExperienceDTO }) {
  return (
    <div className="ce-topbar">
      <div className="ce-topbar-contact">
        <span><MapPin aria-hidden size={15} /> San Francisco de Macorís, R.D.</span>
        <a href={`tel:${data.contact.phone.replace(/[^+\d]/g, "")}`}><Phone aria-hidden size={15} /> {data.contact.phone}</a>
        <a href={`mailto:${data.contact.email}`}><Mail aria-hidden size={15} /> {data.contact.email}</a>
      </div>
      <div className="ce-topbar-social" aria-label="Canales sociales y mensajería">
        <span aria-hidden>IG</span><span aria-hidden>f</span><MessageCircle aria-hidden size={14} />
      </div>
    </div>
  );
}
