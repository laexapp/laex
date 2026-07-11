import Header from "@/modules/layout/components/Header";
import Hero from "../components/Hero";
import SearchBox from "../components/SearchBox";
import FeaturedProjects from "../components/FeaturedProjects";
import EcosystemShowcase from "../components/EcosystemShowcase";

export default function HomeLayout() {
  return (
    <main className="min-h-screen bg-[#0B1018] text-white">
      <Header />

      <div className="mx-auto max-w-7xl px-6">
        <Hero />

        <div className="-mt-8 mb-20">
          <SearchBox />
        </div>

        <EcosystemShowcase />
        
      </div>

      <FeaturedProjects />
    </main>
  );
}