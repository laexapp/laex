import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import CanonicalResetsPage, { metadata } from "../proyectos/lf-printer/tu-reset-gratis/page";

export { metadata };

export default function PreviewResetsPage(): ReactNode {
  if (process.env.NODE_ENV !== "development" && process.env.VERCEL_ENV !== "preview") notFound();
  return <CanonicalResetsPage/>;
}
