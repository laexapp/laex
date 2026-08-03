import { readFile, writeFile } from "node:fs/promises";

const breadcrumb = "modules/media-intelligence/components/MediaBreadcrumbs.tsx";
let content = await readFile(breadcrumb, "utf8");
content = content.replace('  let href = "/media-intelligence";\n', "");
content = content.replace(
  '{segments.map((segment) => {\n        href += `/${segment}`;\n        return <span key={href}',
  '{segments.map((segment, index) => {\n        const segmentHref = `/media-intelligence/${segments.slice(0, index + 1).join("/")}`;\n        return <span key={segmentHref}'
);
content = content.replaceAll('href={href} aria-current={href === pathname ? "page" : undefined} className={href === pathname ?', 'href={segmentHref} aria-current={segmentHref === pathname ? "page" : undefined} className={segmentHref === pathname ?');
await writeFile(breadcrumb, content, "utf8");

const ecosystem = "modules/media-intelligence/domain/ecosystem.ts";
content = await readFile(ecosystem, "utf8");
content = content.replace(
  'async execute<TPayload, TData>(_request: EcosystemRequest<TPayload>): Promise<EcosystemResult<TData>> {\n    return',
  'async execute<TPayload, TData>(request: EcosystemRequest<TPayload>): Promise<EcosystemResult<TData>> {\n    void request;\n    return'
);
await writeFile(ecosystem, content, "utf8");
