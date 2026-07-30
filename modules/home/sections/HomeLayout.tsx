import Header from "@/modules/layout/components/Header";
import Hero from "../components/Hero";
import EcosystemShowcase from "../components/EcosystemShowcase";
import FeaturedProjectsSection from "./FeaturedProjectsSection";

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
      </div>
    </main>
  );
}
