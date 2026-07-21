import Header from "@/modules/layout/components/Header";
import Hero from "../components/Hero";
import EcosystemShowcase from "../components/EcosystemShowcase";
import FeaturedProjectsSection from "./FeaturedProjectsSection";

export default function HomeLayout() {
  return (
    <main className="min-h-screen bg-[#0B1018] text-white">
      <Header />

      <div className="mx-auto max-w-7xl px-6">
        <Hero />

        <EcosystemShowcase />
      </div>

      <FeaturedProjectsSection />
    </main>
  );
}