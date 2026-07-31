import Header from "@/modules/layout/components/Header";
import Hero from "../components/Hero";
import EcosystemShowcase from "../components/EcosystemShowcase";
import FeaturedProjectsSection from "./FeaturedProjectsSection";
import CommunityConnect from '@/modules/ui/components/CommunityConnect';
import { laexCommunityChannels } from '@/modules/project/communityChannels';

export default function HomeLayout() {
  return (
    <main className="laex-canvas min-h-screen text-white">
      <Header />

      <div className="relative mx-auto w-[min(100%-2rem,92rem)]">
        <Hero />
      </div>

      <FeaturedProjectsSection />

      <div className="relative mx-auto w-[min(100%-2rem,92rem)]">
        <EcosystemShowcase />
        <CommunityConnect channels={laexCommunityChannels} variant='panel' title='La inteligencia se construye en comunidad' description='Descubre proyectos, conversa con el ecosistema y participa en lo que viene.' routingContext='home:final' className='mb-20' />
      </div>
    </main>
  );
}
