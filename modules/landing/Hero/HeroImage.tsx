import Image from "next/image";
import { Project } from "@/core/types/project";

type HeroImageProps = {
  project: Project;
};

export default function HeroImage({ project }: HeroImageProps) {
  return (
    <div className="relative">

      <div className="overflow-hidden rounded-3xl border border-cyan-900 bg-[#0f172a] shadow-2xl">

        <Image
          src={project.banner}
          alt={project.name}
          width={900}
          height={600}
          className="h-[420px] w-full object-cover"
          priority
        />

      </div>

    </div>
  );
}