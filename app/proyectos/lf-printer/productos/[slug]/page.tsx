import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { OfficialBrandMark } from "@/modules/lf-printer/components/OfficialBrandMark";
import { ProductCommerceDetail } from "@/modules/lf-printer/components/ProductCommerceDetail";
import { getLFPrinterCommerceCatalog } from "@/modules/lf-printer/infrastructure/commerce-public";

export const dynamic = "force-dynamic";

export default async function LFPrinterProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catalog = await getLFPrinterCommerceCatalog();
  const product = catalog.products.find(item => item.slug === slug);
  if (!product) notFound();
  const related = catalog.products.filter(item => item.slug !== slug && (item.category === product.category || item.featured)).slice(0, 4);
  return <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
    <header className="border-b border-slate-200 bg-[#06101a] text-white"><div className="mx-auto flex h-20 w-[min(100%-2rem,92rem)] items-center justify-between gap-4"><Link href="/proyectos/lf-printer" aria-label="Volver a LF-PRINTER"><OfficialBrandMark compact/></Link><Link href="/proyectos/lf-printer#catalogo" className="flex items-center gap-2 text-xs font-bold"><ArrowLeft size={16}/> Volver a productos</Link></div></header>
    <nav aria-label="Ruta del producto" className="mx-auto w-[min(100%-2rem,92rem)] py-4 text-xs text-slate-500"><Link href="/proyectos/lf-printer">Inicio</Link><span className="mx-2">/</span><Link href={`/proyectos/lf-printer#catalogo`}>{product.category}</Link><span className="mx-2">/</span><span className="text-slate-800">{product.model || product.name}</span></nav>
    <ProductCommerceDetail companySlug={catalog.companySlug} product={product} related={related}/>
    <footer className="border-t border-slate-200 bg-white py-8"><div className="mx-auto flex w-[min(100%-2rem,92rem)] flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:justify-between"><p>LF-PRINTER Commerce · Powered by LAEX</p><p>Información publicada desde Commerce Projection</p></div></footer>
  </main>;
}
