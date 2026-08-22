import assert from "node:assert/strict";
import test from "node:test";
import { formatSafeMigrationDiagnostic, selectMigrationConnection, validateMigrationConnection } from "./migration-connection.mjs";

const directUrl = ["postgresql://", "owner", ":", "test-only", "@ep-example.neon.tech/neondb?sslmode=require"].join("");
const localUrl = ["postgresql://", "local", ":", "test-only", "@localhost/localdb"].join("");

test("direct-only selects only BUSINESS_DATABASE_DIRECT_URL", () => {
  const selected = selectMigrationConnection({
    BUSINESS_DATABASE_DIRECT_URL: directUrl,
    BUSINESS_DATABASE_URL: localUrl,
  }, { directOnly: true });
  assert.equal(selected.source, "BUSINESS_DATABASE_DIRECT_URL");
  assert.equal(selected.connectionString, directUrl);
});

test("direct-only refuses runtime fallback", () => {
  assert.throws(
    () => selectMigrationConnection({ BUSINESS_DATABASE_URL: directUrl }, { directOnly: true }),
    /BUSINESS_DATABASE_DIRECT_URL is required/,
  );
});

test("rejects VARIABLE= and psql wrappers", () => {
  assert.throws(() => validateMigrationConnection("BUSINESS_DATABASE_DIRECT_URL", `BUSINESS_DATABASE_DIRECT_URL=${directUrl}`), /without VARIABLE=/);
  assert.throws(() => validateMigrationConnection("BUSINESS_DATABASE_DIRECT_URL", `psql ${directUrl}`), /without a psql command/);
});

test("rejects non-PostgreSQL protocols and surrounding text", () => {
  assert.throws(() => validateMigrationConnection("BUSINESS_DATABASE_DIRECT_URL", "https://example.com/neondb"), /protocol must be/);
  assert.throws(() => validateMigrationConnection("BUSINESS_DATABASE_DIRECT_URL", `\"${directUrl}\"`), /without surrounding quotes/);
  assert.throws(() => validateMigrationConnection("BUSINESS_DATABASE_DIRECT_URL", ` ${directUrl}`), /whitespace/);
});

test("returns only safe connection diagnostics", () => {
  const result = validateMigrationConnection("BUSINESS_DATABASE_DIRECT_URL", directUrl);
  assert.deepEqual(result.diagnostic, {
    source: "BUSINESS_DATABASE_DIRECT_URL",
    protocol: "postgresql:",
    hostname: "ep-example.neon.tech",
    database: "neondb",
    ssl: true,
  });
  const output = formatSafeMigrationDiagnostic(result.diagnostic);
  assert.doesNotMatch(output, /owner|secret|postgresql:\/\//);
});
