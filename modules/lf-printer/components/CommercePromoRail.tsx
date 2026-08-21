export interface CommercePromoRailItem { id:string;title:string;href:string;startsAt:string;endsAt:string }
/** Reserved presentation boundary for future tenant-scoped Commerce campaigns. */
export function CommercePromoRail({campaigns}:{campaigns:CommercePromoRailItem[]}){
  if(!campaigns.length)return <section aria-label="Promociones futuras" className="min-h-72 border-t border-dashed border-white/10 p-4 text-[10px] leading-4 text-slate-600">Espacio reservado para promociones autorizadas desde Commerce.</section>;
  return <section aria-label="Promociones" className="grid gap-2 border-t border-white/10 p-4">{campaigns.map(item=><a key={item.id} href={item.href} className="rounded-lg border border-white/10 p-3 text-xs font-bold">{item.title}</a>)}</section>;
}
