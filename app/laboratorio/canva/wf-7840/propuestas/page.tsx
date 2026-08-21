import { CommercialDerivativeRegistry } from '@/modules/commercial-composition/infrastructure/CommercialDerivativeRegistry';
import { ProposalComparisonClient, type ProposalItem } from './ProposalComparisonClient';

export const dynamic = 'force-dynamic';

export default async function Wf7840ProposalsPage() {
  const derivatives = await new CommercialDerivativeRegistry().list();
  const latest = new Map<string, ProposalItem>();
  for (const item of derivatives) {
    if (item.sourceGlobalAssetId !== 'LAEX-ASSET-0000002' || !item.templateId.startsWith('canva-business-proposal:')) continue;
    const slug = item.templateId.slice('canva-business-proposal:'.length);
    const current = latest.get(slug);
    if (!current || item.createdAt > current.createdAt) latest.set(slug, item);
  }
  const order = ['executive-dark', 'retail-impact', 'editorial-light'];
  const items = order.map((slug) => latest.get(slug)).filter((item): item is ProposalItem => Boolean(item));
  return <main className="mx-auto min-h-screen max-w-[1500px] px-5 py-10 text-slate-950"><ProposalComparisonClient initialItems={items} /></main>;
}