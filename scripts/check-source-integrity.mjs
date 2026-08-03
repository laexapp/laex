import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const roots = ["app", "modules", "shared", "src", "core", "docs", "design"];
const extensions = new Set([".ts", ".tsx", ".md", ".css"]);
const suspicious = /\u00c3|\u00c2|\u00e2\u20ac|\u00f0\u0178/;
const failures = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(target);
    else if (extensions.has(path.extname(entry.name))) {
      const lines = (await readFile(target, "utf8")).split(/\r?\n/);
      lines.forEach((line, index) => { if (suspicious.test(line)) failures.push(`${target}:${index + 1}`); });
    }
  }
}

for (const root of roots) await walk(root);
if (failures.length) {
  console.error("Se detectaron secuencias de codificación dañada:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Codificación UTF-8: sin secuencias dañadas.");
