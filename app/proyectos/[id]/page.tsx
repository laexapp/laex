import { notFound } from "next/navigation";

import { getProject } from "@/core/projects";
import ProjectPage from "@/modules/project/ProjectPage";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) {
    notFound();
  }

  return <ProjectPage project={project} />;
}