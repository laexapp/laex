import type { ProjectSocial } from "@/src/core/projects/identity";
import CommunityConnect, { type CommunityChannel } from "@/modules/ui/components/CommunityConnect";

type ProjectSocialLinksProps = { social: ProjectSocial; routingContext?: string; };

export default function ProjectSocialLinks({ social, routingContext }: ProjectSocialLinksProps) {
  const candidates: Array<CommunityChannel | null> = [
    social.whatsapp ? { provider: "whatsapp", label: "WhatsApp", href: social.whatsapp } : null,
    social.telegram ? { provider: "telegram", label: "Telegram", href: social.telegram } : null,
    social.discord ? { provider: "discord", label: "Discord", href: social.discord } : null,
    social.facebook ? { provider: "facebook", label: "Facebook", href: social.facebook } : null,
    social.instagram ? { provider: "instagram", label: "Instagram", href: social.instagram } : null,
    social.youtube ? { provider: "youtube", label: "YouTube", href: social.youtube.channelUrl } : null,
    social.x ? { provider: "x", label: "X", href: social.x } : null,
    social.website ? { provider: "website", label: "Sitio oficial", href: social.website } : null,
  ];
  const channels = candidates.filter((channel): channel is CommunityChannel => channel !== null);

  return <CommunityConnect channels={channels} routingContext={routingContext} />;
}
