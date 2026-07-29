import type { ProjectSocial } from "@/src/core/projects/identity";

type ProjectSocialLinksProps = {
  social: ProjectSocial;
};

export default function ProjectSocialLinks({
  social,
}: ProjectSocialLinksProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {social.youtube && (
        <a
          href={social.youtube.channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-all duration-300 hover:-translate-y-1 hover:border-red-400 hover:bg-red-500/20"
        >
          📺 YouTube
        </a>
      )}

      {social.whatsapp && (
        <a
          href={social.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300 transition-all duration-300 hover:-translate-y-1 hover:border-green-400 hover:bg-green-500/20"
        >
          🚀 Entrar a la comunidad
        </a>
      )}

      {social.website && (
        <a
          href={social.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-500/20"
        >
          🌐 Sitio oficial
        </a>
      )}

      {social.telegram && (
        <a
          href={social.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 hover:bg-sky-500/20"
        >
          ✈️ Telegram
        </a>
      )}

      {social.discord && (
        <a
          href={social.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:bg-indigo-500/20"
        >
          🎮 Discord
        </a>
      )}

      {social.x && (
        <a
          href={social.x}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-500/40 bg-slate-500/10 px-4 py-2 text-sm font-semibold text-slate-200 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-500/20"
        >
          ✖ X
        </a>
      )}
    </div>
  );
}