import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const roots = ["app", "modules", "shared", "src", "core"];
async function walk(directory) {
  return (await Promise.all((await readdir(directory, { withFileTypes: true })).map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : /\.tsx?$/.test(entry.name) ? [target] : [];
  }))).flat();
}

const exact = new Map([
  ["params.ref ? \"\"", "params.ref ?? \"\""],
  ["data.referralCode ? \"\"", "data.referralCode ?? \"\""],
  ["data.createdAt ? null", "data.createdAt ?? null"],
  ["directoryLinks ? (", "directoryLinks ?? ("],
  ["visitorLeaderId ? routing", "visitorLeaderId ?? routing"],
  ["params.get(queryKey ? 'leader') ? params.get('ref') ? undefined", "params.get(queryKey ?? 'leader') ?? params.get('ref') ?? undefined"],
  ["channel.memberCount ? channel.status", "channel.memberCount ?? channel.status"],
  ["getYouTubeThumbnail(video.url) ? \"\"", "getYouTubeThumbnail(video.url) ?? \"\""],
  ["accents[project.id] ? \"#37D8EE\"", "accents[project.id] ?? \"#37D8EE\""],
  ["items ? configuredItems", "items ?? configuredItems"],
  ["workspace.status ? \"active\"", "workspace.status ?? \"active\""],
  ["process.env.MEDIA_DEV_SESSION_SECRET ? \"laex-local-emulator-session-not-for-production\"", "process.env.MEDIA_DEV_SESSION_SECRET ?? \"laex-local-emulator-session-not-for-production\""],
  ["seed.workspaces ? []", "seed.workspaces ?? []"], ["seed.memberships ? []", "seed.memberships ?? []"],
  ["seed.invitations ? []", "seed.invitations ?? []"], ["seed.preferences ? []", "seed.preferences ?? []"], ["seed.audit ? []", "seed.audit ?? []"],
  ["workspaces.get(scopeKey(scope)) ? null", "workspaces.get(scopeKey(scope)) ?? null"],
  ["preferences.get(scopeKey(scope)) ? null", "preferences.get(scopeKey(scope)) ?? null"],
  [") ? null);", ") ?? null);"],
]);

for (const file of (await Promise.all(roots.map(walk))).flat()) {
  const original = await readFile(file, "utf8");
  let content = original.replace(/(\?\.[A-Za-z_$][\w$]*(?:\([^;]*?\)|\[[^\]]+\]|\.[A-Za-z_$][\w$]*)*) \? (?=[\"'`\d\[\{A-Za-z_$]|null|undefined)/g, "$1 ?? ");
  for (const [broken, fixed] of exact) content = content.replaceAll(broken, fixed);
  if (content !== original) await writeFile(file, content, "utf8");
}
