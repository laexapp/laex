import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const roots = ["app", "modules", "shared", "src", "core", "docs", "design"];
const extensions = new Set([".ts", ".tsx", ".md", ".css"]);
const replacements = new Map([
  ["\u00c3\u00a1", "\u00e1"], ["\u00c3\u00a9", "\u00e9"], ["\u00c3\u00ad", "\u00ed"],
  ["\u00c3\u00b3", "\u00f3"], ["\u00c3\u00ba", "\u00fa"], ["\u00c3\u00b1", "\u00f1"],
  ["\u00c3\u0081", "\u00c1"], ["\u00c3\u0089", "\u00c9"], ["\u00c3\u0093", "\u00d3"],
  ["\u00c3\u009a", "\u00da"], ["\u00c3\u0091", "\u00d1"], ["\u00c2\u00bf", "\u00bf"],
  ["\u00c2\u00a1", "\u00a1"], ["\u00c2\u00b7", "\u00b7"], ["\u00c2 ", " "],
  ["\u00e2\u20ac\u00a6", "\u2026"], ["\u00e2\u2020\u2019", "\u2192"],
  ["\u00e2\u20ac\u00a2", "\u2022"], ["\u00e2\u0161\u00a0", "\u26a0"],
  ["\u00e2\u20ac\u201d", "\u2014"], ["\u00e2\u20ac\u201c", "\u2013"],
]);

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? files(target) : extensions.has(path.extname(entry.name)) ? [target] : [];
  }))).flat();
}

let changed = 0;
for (const root of roots) {
  for (const file of await files(root)) {
    const original = await readFile(file, "utf8");
    let content = original;
    for (const [broken, corrected] of replacements) content = content.replaceAll(broken, corrected);
    if (content !== original) { await writeFile(file, content, "utf8"); changed += 1; }
  }
}
console.log(`Media Intelligence: ${changed} archivo(s) normalizado(s) a UTF-8.`);
