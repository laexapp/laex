import type { Metadata } from "next";
import { BusinessWorkspace } from "@/modules/business-engine/ui/ChapterTwoAuditLab";
export const metadata: Metadata = { title: "Business Engine Lab | LAEX", description: "Laboratorio controlado de LAEX Business Platform" };
export default function Page() { return <BusinessWorkspace apiBase="/api/laboratory/business-engine" companyName="LF-PRINTER" warehouseId="warehouse-lf-main" mode="laboratory" autoLogin credentials={{ email: "owner@lf-printer.demo", password: "LAEX-Demo-2026!" }}/>; }
