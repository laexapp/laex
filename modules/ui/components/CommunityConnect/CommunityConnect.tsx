import { ArrowUpRight, AtSign, Globe2, Link2, MessageCircle, MessagesSquare, Music2, Play, Send, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CommunityProvider = "whatsapp" | "telegram" | "discord" | "facebook" | "instagram" | "youtube" | "tiktok" | "linkedin" | "x" | "website" | "other";

export type CommunityChannel = {
  provider: CommunityProvider;
  label: string;
  href: string;
};

type Props = {
  channels: CommunityChannel[];
  variant?: "compact" | "inline" | "panel";
  title?: string;
  description?: string;
  routingContext?: string;
  resolveChannelHref?: (channel: CommunityChannel) => string;
};

const icons: Record<CommunityProvider, LucideIcon> = {
  whatsapp: MessageCircle,
  telegram: Send,
  discord: MessagesSquare,
  facebook: Users,
  instagram: AtSign,
  youtube: Play,
  tiktok: Music2,
  linkedin: Link2,
  x: ArrowUpRight,
  website: Globe2,
  other: ArrowUpRight,
};

export default function CommunityConnect({ channels, variant = "inline", title = "Community Connect", description = "Conecta con los canales oficiales del ecosistema.", routingContext, resolveChannelHref }: Props) {
  const available = channels.filter((channel) => channel.href);
  if (available.length === 0) return null;

  const links = (
    <div className={`flex flex-wrap ${variant === "compact" ? "gap-1.5" : "gap-2.5"}`}>
      {available.map((channel) => {
        const Icon = icons[channel.provider];
        const href = resolveChannelHref?.(channel) ?? channel.href;
        return (
          <a key={`${channel.provider}-${channel.label}`} href={href} target="_blank" rel="noopener noreferrer" data-community-provider={channel.provider} data-routing-context={routingContext} aria-label={`${channel.label} — abrir comunidad`} className={`group inline-flex items-center rounded-xl border border-white/[0.09] bg-white/[0.035] text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-cyan-300/[0.06] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 ${variant === "compact" ? "h-9 gap-1.5 px-2.5 text-[9px] font-bold uppercase tracking-[0.1em]" : "h-11 gap-2.5 px-3.5 text-xs font-semibold"}`}>
            <Icon size={variant === "compact" ? 13 : 15} className="text-slate-600 transition group-hover:text-cyan-300" aria-hidden="true" />
            {channel.label}
          </a>
        );
      })}
    </div>
  );

  if (variant !== "panel") return links;

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#071018]/72 p-6 shadow-[0_24px_65px_rgba(0,0,0,.3),inset_0_1px_0_rgba(255,255,255,.04)] backdrop-blur-xl md:flex md:items-center md:justify-between md:gap-8 md:p-8">
      <div className="pointer-events-none absolute left-0 top-0 h-28 w-28 rounded-full bg-cyan-300/[0.07] blur-3xl" />
      <div className="relative mb-5 md:mb-0">
        <span className="laex-eyebrow">Network layer</span>
        <h3 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-white">{title}</h3>
        <p className="mt-2 max-w-md text-xs leading-6 text-slate-500">{description}</p>
      </div>
      <div className="relative shrink-0">{links}</div>
    </section>
  );
}
