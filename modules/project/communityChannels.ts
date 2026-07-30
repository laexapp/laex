import type { Project } from "@/core/types/project";
import type { CommunityChannel } from "@/modules/ui/components/CommunityConnect";

export function getProjectCommunityChannels(project: Project): CommunityChannel[] {
  const channels: Array<CommunityChannel | null> = [
    project.website ? { provider: "website", label: "Sitio oficial", href: project.website } : null,
    project.telegram ? { provider: "telegram", label: "Telegram", href: project.telegram } : null,
    project.twitter ? { provider: "x", label: "X", href: project.twitter } : null,
    project.youtube ? { provider: "youtube", label: "YouTube", href: project.youtube } : null,
  ];

  return channels.filter((channel): channel is CommunityChannel => channel !== null);
}
