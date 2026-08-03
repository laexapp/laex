import { readFile, writeFile } from "node:fs/promises";

const fixes = {
  "app/api/media-intelligence/workflow/route.ts": [
    ["body.payload?{}", "body.payload??{}"], ["payload.email?\"\"", "payload.email??\"\""], ["payload.role?\"viewer\"", "payload.role??\"viewer\""],
    ["payload.title?content.title", "payload.title??content.title"], ["previous?.number?0", "previous?.number??0"], ["payload.body?previous?.body?\"\"", "payload.body??previous?.body??\"\""], ["payload.note?\"Edición\"", "payload.note??\"Edición\""],
    ["payload.scenario?\"success\"", "payload.scenario??\"success\""], ["payload.title?\"\"", "payload.title??\"\""], ["payload.objective?\"Alcance\"", "payload.objective??\"Alcance\""], ["payload.audience?workspace.audience", "payload.audience??workspace.audience"],
    ["payload.at?new Date", "payload.at??new Date"], ["payload.key?campaign.id", "payload.key??campaign.id"],
  ],
  "modules/media-intelligence/components/MediaBreadcrumbs.tsx": [["labels[segment] ? segment", "labels[segment] ?? segment"]],
  "modules/media-intelligence/components/OperationsApp.tsx": [["data.error ? \"No fue posible", "data.error ?? \"No fue posible"]],
  "modules/media-intelligence/components/WorkflowApp.tsx": [["state.activeWorkspaceId)?state", "state.activeWorkspaceId)??state"], ["workspace.contents[0]?.id?\"\"", "workspace.contents[0]?.id??\"\""]],
  "modules/ui/components/CommunityConnect/framework.ts": [["leaderLinks?.[channel.provider] ? channel.href", "leaderLinks?.[channel.provider] ?? channel.href"]],
  "src/core/projects/identity/repository.ts": [[") ? null", ") ?? null"]],
};

for (const [file, replacements] of Object.entries(fixes)) {
  let content = await readFile(file, "utf8");
  for (const [before, after] of replacements) content = content.replaceAll(before, after);
  await writeFile(file, content, "utf8");
}
