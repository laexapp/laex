import ProjectPage from "@/modules/project/ProjectPage";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <ProjectPage projectId={id} />;
}