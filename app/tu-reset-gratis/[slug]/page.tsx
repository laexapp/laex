import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import CanonicalModelPage, { generateMetadata, generateStaticParams } from "../../proyectos/lf-printer/tu-reset-gratis/[slug]/page";

export { generateMetadata, generateStaticParams };

export default function PreviewModelPage({ params }: { params: Promise<{ slug: string }> }): ReactNode {
  if (process.env.NODE_ENV !== "development" && process.env.VERCEL_ENV !== "preview") notFound();
  return <CanonicalModelPage params={params}/>;
}
