import type { Metadata } from "next";

import MediaIntelligenceApp from "@/modules/media-intelligence/components/MediaIntelligenceApp";

export const metadata: Metadata = {
  title: "Media Intelligence | LAEX",
  description: "Centro de operaciones de contenido inteligente con control humano.",
};

export default function MediaIntelligencePage() {
  return <MediaIntelligenceApp />;
}
