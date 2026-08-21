import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { ONE_MILLION_MINERS_OFFICIAL_LANDING } from "../../modules/project/pages/OneMillionMiners/official-landing";

const source = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("OneMillionMiners official landing integration", () => {
  it("preserves the CEO-provided URL and every encoded parameter exactly", () => {
    assert.equal(
      ONE_MILLION_MINERS_OFFICIAL_LANDING.landingUrl,
      "https://landing.onemillionminers.com/?ref=0x46215C23FD707400c65FdA7Fd515c641A9e78b32&wa=https%3A%2F%2Fchat.whatsapp.com%2FHZMa95USZvnBITd7NI4Ot5%3Fs%3Dcl%26p%3Da%26ilr%3D0&tg=https%3A%2F%2Ft.me%2FOMDWALLET",
    );
  });

  it("keeps the official page isolated from the reversible legacy YouTube experience", () => {
    const route = source("app/proyectos/onemillionminers/page.tsx");
    const experience = source("modules/project/pages/OneMillionMiners/OfficialLandingExperience.tsx");
    assert.match(route, /OfficialLandingExperience/);
    assert.match(experience, /ONE_MILLION_MINERS_OFFICIAL_LANDING/);
    assert.match(experience, /<iframe/);
    assert.doesNotMatch(experience, /YouTube|ProjectMedia|OMDMinersSpanish/);
  });
});

