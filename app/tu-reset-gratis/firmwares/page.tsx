import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import CanonicalFirmwaresPage, { metadata } from "../../proyectos/lf-printer/tu-reset-gratis/firmwares/page";

export { metadata };

export default function PreviewFirmwaresPage(): ReactNode {
  if (process.env.NODE_ENV !== "development" && process.env.VERCEL_ENV !== "preview") notFound();
  return <CanonicalFirmwaresPage/>;
}
