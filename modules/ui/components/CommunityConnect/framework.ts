export type CommunityProvider = 'whatsapp' | 'telegram' | 'discord' | 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'reddit' | 'linkedin' | 'x' | 'website' | 'other';
export type CommunityStatus = 'active' | 'quiet' | 'scheduled' | 'live';
export type CommunityAction = 'join' | 'share' | 'copy' | 'open' | 'invite';
export type CommunityVariant = 'compact' | 'inline' | 'panel';
export type CommunityChannel = { provider: CommunityProvider; label: string; href: string; enabled?: boolean; official?: boolean; status?: CommunityStatus; memberCount?: string; lastActivity?: string; eventLabel?: string; live?: boolean; };
export type CommunityLeaderProfile = { id: string; links: Partial<Record<CommunityProvider, string>>; };
export type CommunityRouting = { leaderId?: string; queryKey?: string; leaders?: CommunityLeaderProfile[]; leaderLinks?: Partial<Record<CommunityProvider, string>>; };
export type ResolvedCommunityChannel = { channel: CommunityChannel; href: string; source: 'official' | 'leader'; };

export function resolveCommunityChannels(channels: CommunityChannel[], routing?: CommunityRouting, visitorLeaderId?: string): ResolvedCommunityChannel[] {
  const leaderId = visitorLeaderId ?? routing?.leaderId;
  const directoryLinks = routing?.leaders?.find((leader) => leader.id === leaderId)?.links;
  const leaderLinks = directoryLinks ?? (leaderId ? routing?.leaderLinks : undefined);
  return channels.filter((channel) => channel.enabled !== false && channel.href).map((channel) => ({ channel, href: leaderLinks?.[channel.provider] ?? channel.href, source: leaderLinks?.[channel.provider] ? 'leader' as const : 'official' as const }));
}
