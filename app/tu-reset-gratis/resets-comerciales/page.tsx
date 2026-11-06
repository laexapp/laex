import { notFound } from "next/navigation";
import CommercialResetsPage from "@/app/proyectos/lf-printer/tu-reset-gratis/resets-comerciales/page";

export default function PreviewCommercialResetsPage() {
  if (process.env.NODE_ENV !== "development" && process.env.VERCEL_ENV !== "preview") notFound();
  return <CommercialResetsPage />;
}
