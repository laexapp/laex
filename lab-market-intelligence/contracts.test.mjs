import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const domain = await readFile(new URL("./domain.ts", import.meta.url), "utf8");
const data = await readFile(new URL("./data.ts", import.meta.url), "utf8");

test("el informe editorial excluye referencias comerciales", () => {
  assert.match(domain, /commercialOrderId\?: never/);
  assert.match(domain, /analysisReportId\?: never/);
});

test("el scoring no recibe estado paid ni precio comercial", () => {
  const report = domain.slice(domain.indexOf("interface AnalysisReport"), domain.indexOf("interface PromotionPackage"));
  assert.doesNotMatch(report, /paid|price|amount|sponsor/i);
});

test("el catálogo contiene siete paquetes configurables sin precios fijos", () => {
  assert.equal((data.match(/configurable:true/g) ?? []).length, 7);
  const catalog = data.slice(data.indexOf("export const packages"));
  assert.doesNotMatch(catalog, /price\s*:/i);
});

test("los cuatro activos usan assetId explícito y la simulación está declarada", () => {
  assert.equal((data.match(/assetId:/g) ?? []).length, 4);
  assert.match(data, /simulated: true as const/);
});
