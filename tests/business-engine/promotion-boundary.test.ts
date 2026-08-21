import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const source = (path: string) => readFileSync(path, "utf8");
describe("Chapter 3 promotion boundaries", () => {
  it("keeps the official runtime independent from LF-PRINTER and laboratory bootstrap", () => { const runtime = source("modules/business-engine/server/runtime.ts"); assert.doesNotMatch(runtime, /LF_PRINTER|lf-printer|ensureLfPrinterPilot|owner@lf-printer|product-t544/i); });
  it("keeps official HTTP routes free from pilot provisioning and demo commands", () => { const routes = ["app/api/business-engine/route.ts", "app/api/business-engine/session/route.ts", "app/api/business-engine/assistants/route.ts"].map(source).join("\n"); assert.doesNotMatch(routes, /ensureLfPrinterPilot|demo-workshop|owner@lf-printer/i); });
  it("isolates pilot provisioning behind a dedicated SQLite laboratory runtime", () => { const laboratory = source("app/api/laboratory/business-engine/route.ts"); assert.match(laboratory, /ensureLfPrinterPilot/); assert.match(laboratory, /getLaboratoryBusinessRuntime/); assert.doesNotMatch(laboratory, /getBusinessRuntime\(/); const ui = source("app/laboratorio/business-engine/page.tsx"); assert.match(ui, /\/api\/laboratory\/business-engine/); });
});


