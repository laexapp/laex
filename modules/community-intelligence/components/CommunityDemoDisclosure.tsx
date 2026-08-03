"use client";
import{usePathname}from"next/navigation";
export function CommunityDemoDisclosure(){if(usePathname()!=="/comunidad")return null;return <div className="fixed inset-x-0 top-16 z-40 border-b border-cyan-300/15 bg-[#07111d]/95 px-4 py-2 text-center text-[12px] leading-5 text-slate-300 backdrop-blur-xl">Vista demostrativa de capacidades. Los indicadores validan la experiencia y no representan actividad productiva en tiempo real.</div>}
