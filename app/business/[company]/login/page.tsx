import { notFound } from "next/navigation";
import { CompanyResolver } from "@/modules/business-engine/platform/CompanyResolver";
import { getBusinessRuntime } from "@/modules/business-engine/server/runtime";
import { BusinessLogin } from "@/modules/business-engine/ui/BusinessLogin";
export default async function Page({params}:{params:Promise<{company:string}>}) { let company; try { company=await new CompanyResolver(getBusinessRuntime().store).bySlugOrHost((await params).company); } catch { notFound(); } return <BusinessLogin companySlug={company.slug} companyLabel={company.name} logoUrl={(company as typeof company & {logoUrl?:string}).logoUrl}/>; }
