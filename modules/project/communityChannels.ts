import type { Project } from '@/core/types/project';
import type { CommunityChannel } from '@/modules/ui/components/CommunityConnect';

export function getProjectCommunityChannels(project: Project): CommunityChannel[] {
  const channels: Array<CommunityChannel | null> = [
    { provider: 'other', label: 'Comunidad', href: `/comunidad?project=${project.id}`, official: true, status: 'active' },
    project.website ? { provider: 'website', label: 'Sitio oficial', href: project.website, official: true, status: 'active' } : null,
    project.telegram ? { provider: 'telegram', label: 'Telegram', href: project.telegram, official: true, status: 'active' } : null,
    project.twitter ? { provider: 'x', label: 'X', href: project.twitter, official: true, status: 'active' } : null,
    project.youtube ? { provider: 'youtube', label: 'YouTube', href: project.youtube, official: true, status: 'active' } : null,
  ];
  return channels.filter((channel): channel is CommunityChannel => channel !== null);
}

export const laexCommunityChannels: CommunityChannel[] = [
  { provider: 'other', label: 'Comunidad LAEX', href: '/comunidad', official: true, status: 'active' },
];
