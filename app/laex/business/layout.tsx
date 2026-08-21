import type { ReactNode } from "react";
import { ControlPlaneLogout } from "@/modules/business-engine/ui/ControlPlaneLogout";
export default function Layout({children}:{children:ReactNode}){return <>{children}<ControlPlaneLogout/></>}
