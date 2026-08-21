import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceDir = path.join(root, 'assets', 'lf-printer', 'official-source', 'brand');
const registryFile = path.join(root, 'assets', 'asset-intelligence', 'global-asset-registry.json');
const manifestFile = path.join(root, 'assets', 'lf-printer', 'official', 'brand-identity.json');
const publicDir = path.join(root, 'public', 'assets', 'lf-printer', 'official', 'logos');
const now = new Date().toISOString();
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

const definitions = [
  { role: 'master', file: 'LFPRINTER-LOGO-MASTER.png', output: 'lf-printer-logo-primary.png', usage: ['light', 'neutral'] },
  { role: 'dark-background', file: 'LFPRINTER-LOGO-FONDO-OCURO.png', output: 'lf-printer-logo-on-dark.png', usage: ['dark'] },
];

await fs.mkdir(publicDir, { recursive: true });
const analyzed = [];
for (const definition of definitions) {
  const sourcePath = path.join(sourceDir, definition.file);
  const bytes = await fs.readFile(sourcePath);
  const metadata = await sharp(bytes).metadata();
  if (metadata.format !== 'png' || !metadata.hasAlpha || metadata.width !== 1200 || metadata.height !== 1200) {
    throw new Error(`${definition.file} no cumple PNG 1200x1200 con transparencia.`);
  }
  const outputPath = path.join(publicDir, definition.output);
  const rendition = await sharp(bytes).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await fs.writeFile(outputPath, rendition);
  const outputMetadata = await sharp(rendition).metadata();
  analyzed.push({
    role: definition.role,
    usage: definition.usage,
    sourceUri: path.relative(root, sourcePath).replaceAll('\\', '/'),
    sourceChecksumSha256: sha256(bytes),
    source: { format: 'image/png', width: metadata.width, height: metadata.height, density: metadata.density, hasAlpha: true, hasIccProfile: Boolean(metadata.icc) },
    renditionUri: `/${path.relative(path.join(root, 'public'), outputPath).replaceAll('\\', '/')}`,
    renditionChecksumSha256: sha256(rendition),
    rendition: { format: 'image/png', width: outputMetadata.width, height: outputMetadata.height, hasAlpha: true },
  });
}

const master = analyzed.find((item) => item.role === 'master');
const registry = JSON.parse(await fs.readFile(registryFile, 'utf8'));
let globalAsset = registry.assets.find((item) => item.currentChecksumSha256 === master.sourceChecksumSha256 || (item.manufacturer === 'lf-printer' && item.model === 'LF Printer Brand Identity' && item.assetKind === 'logo'));
if (!globalAsset) {
  const assetId = `LAEX-ASSET-${String(registry.nextSequence++).padStart(7, '0')}`;
  globalAsset = {
    assetId,
    manufacturer: 'lf-printer',
    model: 'LF Printer Brand Identity',
    owner: 'LF-PRINTER',
    assetKind: 'logo',
    status: 'published',
    license: { name: 'Identidad oficial propiedad de LF-PRINTER', summary: 'Uso autorizado dentro del ecosistema LAEX y comunicaciones oficiales de LF-PRINTER.', legalStatus: 'cleared', allowsCommercialUse: true, allowsModification: false, requiresWrittenAuthorization: false },
    legalStatus: 'cleared',
    sourcePageUrl: 'urn:laex:source:lf-printer-official-brand-identity',
    currentVersion: 1,
    currentChecksumSha256: master.sourceChecksumSha256,
    usages: [{ projectId: 'lf-printer', contexts: ['showroom', 'media-pipeline', 'commercial-composition', 'canva-connect', 'shared-brand-identity'], firstReferencedAt: now, lastReferencedAt: now }],
    versions: [{ version: 1, checksumSha256: master.sourceChecksumSha256, originalUri: master.sourceUri, sourceUrl: 'urn:laex:source:lf-printer-provided', acquiredAt: now, format: 'image/png', dimensions: { width: 1200, height: 1200 } }],
    processingHistory: [], replacementHistory: [],
    approvalHistory: [{ id: `${assetId}:approval:brand-onboarding`, kind: 'approval', at: now, actor: 'LF-PRINTER', projectId: 'lf-printer', version: 1, status: 'approved', reference: 'official-brand-identity', notes: 'Archivo maestro oficial suministrado para integración en LAEX.' }],
    publicationHistory: [{ id: `${assetId}:publication:brand-onboarding`, kind: 'publication', at: now, actor: 'LAEX brand identity sync', projectId: 'lf-printer', version: 1, status: 'published', reference: master.renditionUri, notes: 'Rendición web trazable; el original permanece inmutable.' }],
    createdAt: now, updatedAt: now,
  };
  registry.assets.push(globalAsset);
}
registry.updatedAt = now;
await fs.writeFile(registryFile, `${JSON.stringify(registry, null, 2)}\n`);

const manifest = {
  schemaVersion: 1,
  projectId: 'lf-printer',
  globalAssetId: globalAsset.assetId,
  canonicalRole: 'master',
  immutableMasterChecksumSha256: master.sourceChecksumSha256,
  generatedAt: now,
  policy: { masterImmutable: true, derivativesReceiveNoGlobalAssetId: true, deriveFromMasterWhenPossible: true, humanApprovalRequiredForReplacement: true },
  assets: analyzed.map((item) => ({ ...item, relationship: item.role === 'master' ? 'canonical-master' : 'official-derivative', derivedFromGlobalAssetId: globalAsset.assetId })),
};
await fs.mkdir(path.dirname(manifestFile), { recursive: true });
await fs.writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Identidad LF-PRINTER sincronizada como ${globalAsset.assetId}.`);
