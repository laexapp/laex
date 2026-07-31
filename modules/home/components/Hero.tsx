import { ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

import { GlowButton } from "@/modules/ui";
import HeroSpotlight from "./HeroSpotlight";
import CommunityConnect from '@/modules/ui/components/CommunityConnect';
import { laexCommunityChannels } from '@/modules/project/communityChannels';

export default function Hero() {
  return (
    <section className="relative grid min-h-[calc(100vh-5rem)] w-full grid-cols-1 items-center gap-16 overflow-hidden py-20 lg:grid-cols-[0.88fr_1.12fr] lg:py-24 xl:gap-24">
      <div className="pointer-events-none absolute left-[18%] top-1/2 -z-10 h-96 w-96 -translate-y-1/2 rounded-full bg-cyan-300/[0.06] blur-[130px]" />

      <div className="relative z-10">
        <p className="laex-eyebrow flex items-center gap-3">
          <span className="h-px w-10 bg-gradient-to-r from-cyan-300 to-transparent" />
          LAEX Intelligence OS
        </p>

        <h1 className="laex-display mt-8 text-[clamp(3.7rem,7.5vw,7.6rem)] text-white">
          Comprenda la
          <span className="block bg-gradient-to-br from-white via-cyan-100 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_12px_48px_rgba(55,216,238,.13)]">
            señal.
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400 md:text-xl md:leading-9">
          Un sistema operativo de inteligencia para comprender proyectos,
          descubrir oportunidades y decidir con claridad.
        </p>

        <div className="mt-11 flex flex-wrap gap-4">
          <GlowButton asChild size="lg">
            <Link href="/platform#assistant" className="gap-3">
              Entrar a inteligencia <ArrowRight size={18} />
            </Link>
          </GlowButton>

          <GlowButton asChild variant="secondary" size="lg">
            <Link href="/proyectos">Explorar ecosistema</Link>
          </GlowButton>
        </div>

        <CommunityConnect channels={laexCommunityChannels} variant='compact' routingContext='home:hero' className='mt-6' />

        <div className="mt-16 grid max-w-xl grid-cols-3 gap-5 border-t border-white/[0.07] pt-6">
          <Metric value="03" label="Ecosistemas" />
          <Metric value="24/7" label="Monitoreo" />
          <Metric value="AI" label="Decision layer" icon />
        </div>
      </div>

      <div className="relative min-w-0">
        <HeroSpotlight />
      </div>
    </section>
  );
}

function Metric({ value, label, icon = false }: { value: string; label: string; icon?: boolean }) {
  return (
    <div className="grid gap-1.5">
      <strong className="flex items-center gap-2 text-sm font-semibold text-slate-100">
        {icon && <Activity size={14} className="text-cyan-300" aria-hidden="true" />}
        {value}
      </strong>
      <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">{label}</span>
    </div>
  );
}
