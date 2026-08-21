import { BusinessApp } from "@/modules/business-engine/ui/BusinessApp";
export default async function Page({params}:{params:Promise<{company:string}>}){return <BusinessApp companySlug={(await params).company}/>}
