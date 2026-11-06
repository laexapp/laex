/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

const root = path.resolve(process.argv[2] ?? path.resolve(__dirname, "../.."));
function loadTs(relativePath) {
  const filename = path.join(root, relativePath);
  const source = fs.readFileSync(filename, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  loaded._compile(outputText, filename);
  return loaded.exports;
}
const catalog = loadTs("modules/tu-reset-gratis/catalog.ts");
const { featuredPrintersByYear } = loadTs("modules/tu-reset-gratis/featured.ts");

const models = catalog.resetModels;
assert.equal(models.length, 146, "expected original 138 models plus 8 current regional models");
assert.equal(new Set(models.map((model) => model.slug)).size, models.length, "slugs must be unique");
assert.equal(models.filter((model) => model.modelStatus === "identified").length, 142);
assert.equal(models.filter((model) => model.modelStatus === "pending_identification").length, 4);
assert.equal(models.filter((model) => model.resourceStatus === "pending_verification").length, 146);
assert.equal(models.filter((model) => model.publicDownload).length, 0, "unverified downloads must stay disabled");

const featured = featuredPrintersByYear[2026];
assert.equal(featured.length, 10, "2026 CEO proposal should have ten candidates");
assert.equal(new Set(featured.map((entry) => entry.slug)).size, 10, "featured model candidates must be unique");
assert.ok(featured.every((entry) => catalog.getResetModel(entry.slug)), "each featured candidate must link to its own model ficha");
assert.ok(featured.every((entry) => entry.photoStatus === "rights_pending"), "unverified image rights must keep photos hidden");
assert.ok(featured.every((entry) => entry.sourceUrl.startsWith("https://epson.com.do/")), "candidates must use Epson Dominican Republic evidence");

for (const model of models.filter((entry) => entry.image)) {
  assert.ok(fs.existsSync(path.join(root, "public", model.image.replace(/^\//, ""))), `missing image: ${model.image}`);
}

const xp = catalog.filterResetModels({ query: "XP4205" });
assert.ok(xp.some((model) => model.model === "Epson XP-4205"), "search should ignore separators");
assert.ok(catalog.filterResetModels({ query: "L3350" }).some((model) => model.model === "Epson L3350"), "current market candidate should be searchable");
const canon = catalog.filterResetModels({ brand: "Canon" });
assert.ok(canon.length > 0 && canon.every((model) => model.brand === "Canon"), "brand filter should return Canon only");
const lSeries = catalog.filterResetModels({ family: "L-Series" });
assert.ok(lSeries.length > 0 && lSeries.every((model) => model.family === "L-Series"), "family filter should return L series only");
assert.ok(catalog.filterResetModels({ query: "XP4205", brand: "Epson", family: "XP-Series" }).length > 0, "search and filters should combine");

for (const model of models) {
  assert.equal(catalog.getResetModel(model.slug)?.code, model.code, `detail lookup failed: ${model.slug}`);
  assert.equal(catalog.buildResetModelHref(model.slug), `/tu-reset-gratis/${model.slug}`);
}

console.log(`Catalog verification passed: ${models.length} unique fichas; original 138 preserved + 8 current regional models; 142 identified, 4 pending identification; no downloads enabled.`);
console.log(`Search, brand/family filters, combined filters, ${models.length} detail lookups, 10 featured-model routes, pending photo-rights gates, and ${models.filter((model) => model.image).length} local images passed.`);
