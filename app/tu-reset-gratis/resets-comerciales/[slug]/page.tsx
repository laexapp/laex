import { notFound } from "next/navigation";
import CommercialSolutionPage from "@/app/proyectos/lf-printer/tu-reset-gratis/resets-comerciales/[slug]/page";

export default async function PreviewCommercialSolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  if (process.env.NODE_ENV !== "development" && process.env.VERCEL_ENV !== "preview") notFound();
  const { slug } = await params;
  if (!slug) notFound();
  return <CommercialSolutionPage params={params} />;
}
