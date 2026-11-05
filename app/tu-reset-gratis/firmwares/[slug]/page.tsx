import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import CanonicalFirmwareDetailPage, { generateMetadata, generateStaticParams } from "../../../proyectos/lf-printer/tu-reset-gratis/firmwares/[slug]/page";

export { generateMetadata, generateStaticParams };

export default function PreviewFirmwareDetailPage({ params }: { params: Promise<{ slug: string }> }): ReactNode {
  if (process.env.NODE_ENV !== "development" && process.env.VERCEL_ENV !== "preview") notFound();
  return <CanonicalFirmwareDetailPage params={params}/>;
}
