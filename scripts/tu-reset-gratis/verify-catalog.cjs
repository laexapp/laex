/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

const root = path.resolve(__dirname, "../..");
const sourcePath = path.join(root, "modules/tu-reset-gratis/catalog.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const catalogModule = new Module(sourcePath, module);
catalogModule.filename = sourcePath;
catalogModule.paths = Module._nodeModulePaths(path.dirname(sourcePath));
catalogModule._compile(outputText, sourcePath);
const catalog = catalogModule.exports;

const models = catalog.resetModels;
assert.equal(models.length, 138, "expected 138 distinct navigable models");
assert.equal(new Set(models.map((model) => model.slug)).size, models.length, "slugs must be unique");
assert.equal(models.filter((model) => model.modelStatus === "identified").length, 134);
assert.equal(models.filter((model) => model.modelStatus === "pending_identification").length, 4);
assert.equal(models.filter((model) => model.resourceStatus === "pending_verification").length, 138);
assert.equal(models.filter((model) => model.publicDownload).length, 0, "unverified downloads must stay disabled");

for (const model of models.filter((entry) => entry.image)) {
  assert.ok(fs.existsSync(path.join(root, "public", model.image.replace(/^\//, ""))), `missing image: ${model.image}`);
}

const xp = catalog.filterResetModels({ query: "XP4205" });
assert.ok(xp.some((model) => model.model === "Epson XP-4205"), "search should ignore separators");
const canon = catalog.filterResetModels({ brand: "Canon" });
assert.ok(canon.length > 0 && canon.every((model) => model.brand === "Canon"), "brand filter should return Canon only");
const lSeries = catalog.filterResetModels({ family: "L-Series" });
assert.ok(lSeries.length > 0 && lSeries.every((model) => model.family === "L-Series"), "family filter should return L series only");
assert.ok(catalog.filterResetModels({ query: "XP4205", brand: "Epson", family: "XP-Series" }).length > 0, "search and filters should combine");

for (const model of models) {
  assert.equal(catalog.getResetModel(model.slug)?.code, model.code, `detail lookup failed: ${model.slug}`);
  assert.equal(catalog.buildResetModelHref(model.slug), `/tu-reset-gratis/${model.slug}`);
}

console.log(`Catalog verification passed: ${models.length} unique fichas; 134 identified, 4 pending identification; 138 resources pending; no downloads enabled.`);
console.log(`Search, brand/family filters, combined filters, ${models.length} detail lookups, links, and ${models.filter((model) => model.image).length} local images passed.`);
