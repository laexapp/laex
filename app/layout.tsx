import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CommunityContextDock } from "@/modules/community-intelligence/components/CommunityContextDock";
import { CommunityDemoDisclosure } from "@/modules/community-intelligence/components/CommunityDemoDisclosure";
import { ProjectLegalGuard } from "@/modules/community-intelligence/components/ProjectLegalGuard";
import "./globals.css";
const geistSans=Geist({variable:"--font-geist-sans",subsets:["latin"]});const geistMono=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"]});
export const metadata:Metadata={title:"LAEX | Descubre. Aprende. Decide.",description:"Ecosistema inteligente para aprender, crear y conectar oportunidades."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}><body className="min-h-full flex flex-col">{children}<CommunityDemoDisclosure/><ProjectLegalGuard/><CommunityContextDock/></body></html>}
