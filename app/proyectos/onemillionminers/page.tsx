import type { Metadata } from "next";
import OfficialLandingExperience from "@/modules/project/pages/OneMillionMiners/OfficialLandingExperience";

export const metadata: Metadata = {
  title: "OneMillionMiners · LAEX",
  description: "Presentación oficial de OneMillionMiners dentro del ecosistema LAEX.",
  robots: { index: false, follow: false },
};

export default function OneMillionMinersOfficialPage() {
  return <OfficialLandingExperience />;
}

