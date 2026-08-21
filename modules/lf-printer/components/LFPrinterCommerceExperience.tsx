"use client";

import { useCallback, useEffect, useState } from "react";
import type { LFPrinterCommerceCatalog, PublicCommerceCatalog } from "../infrastructure/commerce-presentation";
import { toLFPrinterCommerceCatalog } from "../infrastructure/commerce-presentation";
import { subscribeToCommerceChanges } from "../infrastructure/commerce-events";
import { CommerceCatalog } from "./CommerceCatalog";

export function LFPrinterCommerceExperience({ initial }: { initial: LFPrinterCommerceCatalog }) {
  const [catalog, setCatalog] = useState(initial);
  const applyCatalog = useCallback((next: PublicCommerceCatalog) => setCatalog(toLFPrinterCommerceCatalog(initial.companySlug, next)), [initial.companySlug]);
  const reload = useCallback(async () => { const response = await fetch(`/api/commerce/${initial.companySlug}/search?page=1&pageSize=48`, { cache: "no-store" }); if (response.ok) applyCatalog(await response.json() as PublicCommerceCatalog); }, [applyCatalog, initial.companySlug]);
  useEffect(() => subscribeToCommerceChanges(initial.companySlug, () => void reload()), [initial.companySlug, reload]);
  return <CommerceCatalog companySlug={catalog.companySlug} initial={catalog} onCatalogChange={applyCatalog}/>;
}
