import Image from "next/image";

import { Project } from "@/core/types/project";
import CommunityConnect from "@/modules/ui/components/CommunityConnect";
import { getProjectCommunityChannels } from "../communityChannels";

type Props = { project: Project; };

export default function ProjectHero({ project }: Props) {
  const communityChannels = getProjectCommunityChannels(project);

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/[0.1] bg-[#071018] shadow-[0_38px_100px_rgba(0,0,0,.55)]">
      <div className="relative min-h-[680px] md:min-h-[760px]">
        <Image src={project.banner} alt={project.name} fill priority className="object-cover object-center opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/10 to-[#03070B]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03070B]/58 via-transparent to-transparent" />

        <div className="relative z-10 flex min-h-[680px] items-end p-7 md:min-h-[760px] md:p-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4">
              <Image src={project.logo} alt={project.name} width={88} height={88} className="h-16 w-16 rounded-2xl border border-white/15 bg-[#071018]/68 p-2 shadow-[0_16px_42px_rgba(0,0,0,.35)] backdrop-blur-xl md:h-20 md:w-20" />
              <div>
                <span className="laex-eyebrow">Project intelligence</span>
                <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">{project.category}</span>
              </div>
            </div>

            <h1 className="laex-display mt-6 text-5xl text-white md:text-7xl">{project.name}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl md:leading-9">{project.description}</p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.08] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-emerald-200">{project.status}</span>
              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-300 backdrop-blur-xl">{project.launchDate}</span>
            </div>

            <div className="mt-8">
              <CommunityConnect channels={communityChannels} variant="compact" routingContext={`project:${project.id}:hero`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
