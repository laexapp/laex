import type { Metadata } from "next";
import OperationsApp from "@/modules/media-intelligence/components/OperationsApp";
export const metadata: Metadata = { title: "Operaciones | LAEX Media Intelligence", description: "Flujos funcionales locales y simulados de Media Intelligence." };
export default function OperationsPage() { return <OperationsApp />; }
