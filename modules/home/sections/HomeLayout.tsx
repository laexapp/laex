import Header from "@/modules/layout/components/Header";
import Link from "next/link";
import { projects } from "@/core/projects/projects";
import ProjectCard from "@/modules/projects/components/ProjectCard";
import HomeProjectCarousel from "../components/HomeProjectCarousel";
import HomeEvidenceStrip from "../components/HomeEvidenceStrip";
import EcosystemShowcase from "../components/EcosystemShowcase";
import CommunityConnect from '@/modules/ui/components/CommunityConnect';
import { laexCommunityChannels } from '@/modules/project/communityChannels';

export default function HomeLayout() {
  return (
    <main className="laex-canvas min-h-screen text-white">
      <Header />

      <HomeProjectCarousel projects={projects} />
      <HomeEvidenceStrip />
      <section className="mx-auto w-[min(100%-2rem,92rem)] py-16 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><span className="laex-eyebrow">Ecosistema LAEX</span><h2 className="laex-display mt-4 text-4xl text-white md:text-6xl">Experiencias conectadas.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">Proyectos y empresas integrados mediante las capacidades reales de LAEX.</p></div><Link href="/proyectos" className="text-[10px] font-black uppercase tracking-[.16em] text-cyan-300 hover:text-white">Ver todos los proyectos →</Link></div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
      </section>

      <div className="relative mx-auto w-[min(100%-2rem,92rem)]">
        <EcosystemShowcase />
        <CommunityConnect channels={laexCommunityChannels} variant='panel' title='La inteligencia se construye en comunidad' description='Descubre proyectos, conversa con el ecosistema y participa en lo que viene.' routingContext='home:final' className='mb-20' />
      </div>
    </main>
  );
}
