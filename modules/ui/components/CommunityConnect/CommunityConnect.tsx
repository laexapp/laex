'use client';

import { ArrowUpRight, AtSign, Check, ChevronDown, Copy, Globe2, Link2, MessageCircle, MessagesSquare, Music2, Play, Radio, Send, Share2, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo, useState, useSyncExternalStore } from 'react';
import type { CommunityAction, CommunityChannel, CommunityProvider, CommunityRouting, CommunityVariant } from './framework';
import { resolveCommunityChannels } from './framework';

export type CommunityConnectProps = { channels: CommunityChannel[]; variant?: CommunityVariant; title?: string; description?: string; routingContext?: string; routing?: CommunityRouting; actions?: CommunityAction[]; showMeta?: boolean; className?: string; };
const icons: Record<CommunityProvider, LucideIcon> = { whatsapp: MessageCircle, telegram: Send, discord: MessagesSquare, facebook: Users, instagram: AtSign, youtube: Play, tiktok: Music2, reddit: MessagesSquare, linkedin: Link2, x: ArrowUpRight, website: Globe2, other: ArrowUpRight };

export default function CommunityConnect({ channels, variant = 'inline', title = 'Unete a la comunidad', description = 'Conecta con las personas que estan construyendo el ecosistema.', routingContext, routing, actions = ['open', 'copy', 'share'], showMeta = false, className = '' }: CommunityConnectProps) {
  const visitorLeader = useSyncExternalStore(subscribeToLocation, () => readVisitorLeader(routing?.queryKey), () => undefined);
  const [activeMenu, setActiveMenu] = useState<string>();
  const [copied, setCopied] = useState<string>();
  const resolved = useMemo(() => resolveCommunityChannels(channels, routing, visitorLeader), [channels, routing, visitorLeader]);
  if (resolved.length === 0) return null;

  const copyLink = async (key: string, href: string) => { await navigator.clipboard?.writeText(href); setCopied(key); window.setTimeout(() => setCopied(undefined), 1600); };
  const shareLink = async (channel: CommunityChannel, href: string) => { if (navigator.share) { await navigator.share({ title: channel.label, text: `Unete a ${channel.label}`, url: href }); return; } await copyLink(`${channel.provider}-${channel.label}`, href); };

  const links = <div className={`flex flex-wrap ${variant === 'compact' ? 'gap-2' : 'gap-3'}`}>{resolved.map(({ channel, href, source }) => {
    const Icon = icons[channel.provider]; const key = `${channel.provider}-${channel.label}`; const hasMenu = variant !== 'compact' && actions.some((action) => action !== 'open');
    return <div key={key} className='group/community relative'>
      <div className={`relative flex items-stretch overflow-hidden border border-white/[0.09] bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,.05)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-cyan-300/[0.065] hover:shadow-[0_12px_34px_rgba(34,211,238,.08)] ${variant === 'compact' ? 'rounded-xl' : 'rounded-2xl'}`}>
        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} data-community-provider={channel.provider} data-community-source={source} data-routing-context={routingContext} aria-label={`${channel.label} - abrir comunidad`} className={`inline-flex items-center text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-300/70 ${variant === 'compact' ? 'h-10 gap-2 px-3 text-[9px] font-bold uppercase tracking-[0.12em]' : 'min-h-14 gap-3 px-4 text-xs font-semibold'}`}>
          <span className='relative grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-cyan-300/10 bg-cyan-300/[0.06] text-cyan-300'><Icon size={14} aria-hidden='true' />{channel.live && <span className='absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-rose-400 shadow-[0_0_9px_rgba(251,113,133,.9)]' />}</span>
          <span className='text-left'><span className='block'>{channel.label}</span>{showMeta && (channel.memberCount || channel.status) && <span className='mt-0.5 block text-[9px] font-medium uppercase tracking-[0.1em] text-slate-600'>{channel.memberCount ?? channel.status}</span>}</span>
          {source === 'leader' && <span className='rounded-full border border-violet-300/15 bg-violet-300/[0.08] px-2 py-1 text-[8px] uppercase tracking-wider text-violet-200'>Lider</span>}{channel.official && source !== 'leader' && <span className='h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,.65)]' title='Comunidad oficial' />}
        </a>
        {hasMenu && <button type='button' onClick={() => setActiveMenu(activeMenu === key ? undefined : key)} className='grid w-10 place-items-center border-l border-white/[0.07] text-slate-600 transition hover:bg-white/[0.04] hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-300/70' aria-label={`Acciones para ${channel.label}`} aria-expanded={activeMenu === key}><ChevronDown size={14} className={`transition ${activeMenu === key ? 'rotate-180' : ''}`} /></button>}
      </div>
      {activeMenu === key && hasMenu && <div className='absolute right-0 top-[calc(100%+.5rem)] z-30 min-w-44 overflow-hidden rounded-xl border border-white/10 bg-[#071018]/95 p-1.5 shadow-[0_20px_55px_rgba(0,0,0,.5)] backdrop-blur-2xl'>
        {actions.includes('open') && <Action icon={ArrowUpRight} label='Abrir comunidad' href={href} />}{actions.includes('copy') && <Action icon={copied === key ? Check : Copy} label={copied === key ? 'Enlace copiado' : 'Copiar enlace'} onClick={() => copyLink(key, href)} />}{actions.includes('share') && <Action icon={Share2} label='Compartir' onClick={() => shareLink(channel, href)} />}{actions.includes('invite') && <Action icon={Users} label='Invitar' onClick={() => shareLink(channel, href)} />}{actions.includes('join') && <Action icon={Radio} label='Unirse' href={href} />}
      </div>}
    </div>;
  })}</div>;

  if (variant !== 'panel') return <div className={className}>{links}</div>;
  return <section className={`relative overflow-visible rounded-[28px] border border-white/[0.08] bg-[#071018]/72 p-6 shadow-[0_24px_65px_rgba(0,0,0,.3),inset_0_1px_0_rgba(255,255,255,.04)] backdrop-blur-xl md:flex md:items-center md:justify-between md:gap-8 md:p-8 ${className}`}><div className='pointer-events-none absolute left-0 top-0 h-28 w-28 rounded-full bg-cyan-300/[0.07] blur-3xl' /><div className='relative mb-5 md:mb-0'><span className='laex-eyebrow flex items-center gap-2'><Users size={12} /> Community layer</span><h3 className='mt-3 text-xl font-semibold tracking-[-0.025em] text-white'>{title}</h3><p className='mt-2 max-w-md text-xs leading-6 text-slate-500'>{description}</p></div><div className='relative shrink-0'>{links}</div></section>;
}

function Action({ icon: Icon, label, href, onClick }: { icon: LucideIcon; label: string; href?: string; onClick?: () => void }) { const className = 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[11px] font-medium text-slate-400 transition hover:bg-cyan-300/[0.07] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70'; if (href) return <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel='noopener noreferrer' className={className}><Icon size={13} />{label}</a>; return <button type='button' onClick={onClick} className={className}><Icon size={13} />{label}</button>; }

export type { CommunityAction, CommunityChannel, CommunityProvider, CommunityRouting, CommunityVariant } from './framework';

function subscribeToLocation(onStoreChange: () => void) {
  window.addEventListener('popstate', onStoreChange);
  return () => window.removeEventListener('popstate', onStoreChange);
}

function readVisitorLeader(queryKey?: string) {
  const params = new URLSearchParams(window.location.search);
  return params.get(queryKey ?? 'leader') ?? params.get('ref') ?? undefined;
}
