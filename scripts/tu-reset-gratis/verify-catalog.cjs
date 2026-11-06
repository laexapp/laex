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
  loaded.require = (request) => {
    const resolved = request.startsWith("@/")
      ? path.join(root, request.slice(2))
      : request.startsWith(".") ? path.resolve(path.dirname(filename), request) : null;
    if (resolved && fs.existsSync(`${resolved}.ts`)) return loadTs(path.relative(root, `${resolved}.ts`));
    return Module.prototype.require.call(loaded, request);
  };
  loaded._compile(outputText, filename);
  return loaded.exports;
}
const catalog = loadTs("modules/tu-reset-gratis/catalog.ts");
const { featuredPrintersByYear } = loadTs("modules/tu-reset-gratis/featured.ts");
const { commercialSolutions, filterCommercialSolutions, buildCommercialWhatsAppUrl } = loadTs("modules/tu-reset-gratis/commercial-solutions.ts");
const { LF_PRINTER_CONTACT } = loadTs("modules/lf-printer/config/quick-actions.ts");

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

assert.equal(commercialSolutions.length, 4, "the first commercial catalog should contain four provider references");
assert.equal(new Set(commercialSolutions.map(({ id }) => id)).size, commercialSolutions.length, "commercial solution IDs must be unique");
assert.ok(commercialSolutions.every((solution) => solution.modelCodes.length > 0), "each solution must relate to existing printer fichas");
assert.ok(commercialSolutions.every((solution) => solution.modelCodes.every((code) => models.some((model) => model.code === code))), "commercial model relations must resolve to the canonical catalog");
assert.ok(commercialSolutions.every((solution) => !/mega\.nz|drive\.google|\.zip(?:$|\?)/i.test(JSON.stringify(solution))), "commercial catalog must not expose private or downloadable file links");
assert.ok(filterCommercialSolutions({ query: "WF4830" }).some((solution) => solution.id === "camo-adjustment-program"), "commercial model search should ignore separators");
assert.ok(filterCommercialSolutions({ provider: "INKCHIP" }).length === 2, "provider filter should isolate INKCHIP references");
assert.ok(filterCommercialSolutions({ kind: "chipless_firmware" }).every((solution) => solution.kind === "chipless_firmware"), "solution type filter should work");
const wic = commercialSolutions.find(({ id }) => id === "inkchip-wic-reset-key");
const linkedModel = models.find((model) => wic.modelCodes.includes(model.code));
const waUrl = new URL(buildCommercialWhatsAppUrl(wic, linkedModel.code, "Ana"));
assert.equal(waUrl.hostname, "wa.me");
assert.equal(waUrl.pathname.slice(1), LF_PRINTER_CONTACT.whatsappNumber, "WhatsApp must use the central LF-PRINTER contact configuration");
assert.match(waUrl.searchParams.get("text"), new RegExp(linkedModel.model));
assert.match(waUrl.searchParams.get("text"), /Ana/);
assert.throws(() => buildCommercialWhatsAppUrl(wic, "NOT-A-REAL-MODEL"), /Selecciona un modelo relacionado/);
assert.ok(commercialSolutions.every((solution) => !("price" in solution) && !("downloadUrl" in solution)), "unconfirmed prices and downloads must not enter the commercial dataset");

console.log(`Catalog verification passed: ${models.length} unique fichas; original 138 preserved + 8 current regional models; 142 identified, 4 pending identification; no downloads enabled.`);
console.log(`Search, brand/family filters, combined filters, ${models.length} detail lookups, 10 featured-model routes, pending photo-rights gates, and ${models.filter((model) => model.image).length} local images passed.`);
console.log(`Commercial verification passed: ${commercialSolutions.length} provider references, ${commercialSolutions.reduce((count, solution) => count + solution.modelCodes.length, 0)} linked model relations, working provider/type/model filters, canonical WhatsApp contact, and no public file links or prices.`);
