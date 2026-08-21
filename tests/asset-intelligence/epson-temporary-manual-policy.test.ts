import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { EPSON_TEMPORARY_DEVELOPMENT_POLICY } from "../../modules/asset-intelligence/application/EpsonAcquisitionCoordinator";

const source = (file: string) => readFileSync(join(process.cwd(), file), "utf8");

describe("LF-PRINTER temporary Epson media policy", () => {
  it("uses a real web minimum instead of accepting arbitrary tiny images", () => {
    assert.equal(EPSON_TEMPORARY_DEVELOPMENT_POLICY.temporaryMinimumLongestSide, 640);
    assert.equal(EPSON_TEMPORARY_DEVELOPMENT_POLICY.definitiveMinimumLongestSide, 2000);
  });

  it("limits the exception to the ten CEO-authorized exact models", () => {
    const policy = JSON.parse(source("assets/lf-printer/official-source/temporary-manual-policy.json")) as {
      models: Array<{ assetId: string }>;
      withoutEnlargement: boolean;
      publicationRequiresExactModel: boolean;
      publicationRequiresDocumentedCommercialPermission: boolean;
    };
    assert.deepEqual(policy.models.map(item => item.assetId), ["wf-4830", "wf-4833", "wf-4834", "wf-4810", "wf-7820", "wf-7840", "xp-4105", "xp-4205", "l3250", "l1212"]);
    assert.equal(policy.withoutEnlargement, true);
    assert.equal(policy.publicationRequiresExactModel, true);
    assert.equal(policy.publicationRequiresDocumentedCommercialPermission, true);
  });

  it("keeps per-asset quality classification and without-enlargement processing in the official pipeline", () => {
    const pipeline = source("scripts/media-pipeline/core.mjs");
    assert.match(pipeline, /minimumFor/);
    assert.match(pipeline, /temporary-manual/);
    assert.match(pipeline, /withoutEnlargement:true/);
  });
});
