import assert from "node:assert/strict";
import test from "node:test";
import { PUBLIC_HOSTS, PUBLIC_ORIGINS } from "../../core/config/public-origins";
import { blockedOnLfPrinter, commerceApiAllowedOnLfPrinter, isAllowedProductionHost, isLfPrinterHost, lfPrinterDestination } from "../../core/routing/production-domains";

test("production origins use the approved LAEX and LF-PRINTER domains", () => {
  assert.equal(PUBLIC_ORIGINS.laex, "https://laexapp.com");
  assert.equal(PUBLIC_ORIGINS.lfPrinter, "https://lfprinterapp.com");
  assert.equal(PUBLIC_HOSTS.lfPrinter, "lfprinterapp.com");
  assert.equal(isLfPrinterHost("www.lfprinterapp.com"), true);
  assert.equal(isAllowedProductionHost("lfprinterapp.com"), true);
});

test("LF-PRINTER clean public routes resolve to the existing showroom", () => {
  assert.equal(lfPrinterDestination("/"), "/proyectos/lf-printer");
  assert.equal(lfPrinterDestination("/productos/wf-4830"), "/proyectos/lf-printer/productos/wf-4830");
  assert.equal(lfPrinterDestination("/seguimiento"), "/proyectos/lf-printer/seguimiento");
});

test("LF-PRINTER host blocks administrative surfaces", () => {
  for (const path of ["/business", "/laex/business", "/laboratorio/business-engine", "/configuracion/canva", "/api/laex-control/companies", "/api/business-engine/state"]) {
    assert.equal(blockedOnLfPrinter(path), true, path);
  }
});

test("LF-PRINTER host only exposes Commerce for its configured company", () => {
  const previous = process.env.COMMERCE_REFERENCE_COMPANY_SLUG;
  process.env.COMMERCE_REFERENCE_COMPANY_SLUG = "lf-printer";
  assert.equal(commerceApiAllowedOnLfPrinter("/api/commerce/lf-printer"), true);
  assert.equal(commerceApiAllowedOnLfPrinter("/api/commerce/lf-printer/search"), true);
  assert.equal(commerceApiAllowedOnLfPrinter("/api/commerce/empresa-demo-b"), false);
  if (previous === undefined) delete process.env.COMMERCE_REFERENCE_COMPANY_SLUG;
  else process.env.COMMERCE_REFERENCE_COMPANY_SLUG = previous;
});
