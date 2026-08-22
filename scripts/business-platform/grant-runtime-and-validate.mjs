import pg from "pg";
import { formatSafeMigrationDiagnostic, selectMigrationConnection, validateMigrationConnection } from "./migration-connection.mjs";

const diagnoseOnly = process.argv.includes("--diagnose-only");
const expectedMigrations = [
  "0001_saas_core", "0002_operational_control", "0003_security_invariants",
  "0004_chapter_eight_accounting_identity", "0005_dominican_fiscal_engine",
  "0006_ai_engine_governance", "0007_commerce_publication_engine",
  "0008_commerce_payment_engine",
];
const rlsTables = [
  "accounting_expenses", "accounting_report_runs", "business_ai_activity",
  "business_fiscal_documents", "business_fiscal_profiles", "business_fiscal_reconciliations",
  "business_fiscal_sequences", "business_records", "commerce_order_history", "commerce_orders",
  "commerce_payment_methods", "commerce_payments", "commerce_projections", "commerce_reservations",
  "idempotency_keys", "identity_password_tokens",
];
const forceRlsTables = new Set(rlsTables.filter((table) => ![
  "accounting_expenses",
  "accounting_report_runs",
  "identity_password_tokens",
].includes(table)));

function check(name, passed, details) {
  return { name, status: passed ? "PASS" : "FAIL", details };
}

async function collectDiagnostics(client) {
  const migrations = await client.query(`SELECT version, length(checksum)::int AS checksum_length FROM public.laex_schema_migrations ORDER BY version`);
  const migrationRows = migrations.rows.map((row) => ({ version: row.version, checksumLength: row.checksum_length }));
  const versionsPass = JSON.stringify(migrationRows.map((row) => row.version)) === JSON.stringify(expectedMigrations);
  const checksumsPass = migrationRows.length === expectedMigrations.length && migrationRows.every((row) => row.checksumLength === 64);

  const rls = await client.query(`
    SELECT expected.table_name, COALESCE(c.relrowsecurity, false) AS rls_enabled,
           COALESCE(c.relforcerowsecurity, false) AS rls_forced, c.oid IS NOT NULL AS table_exists
    FROM unnest($1::text[]) AS expected(table_name)
    LEFT JOIN pg_class c ON c.relname = expected.table_name
      AND c.relnamespace = 'public'::regnamespace AND c.relkind = 'r'
    ORDER BY expected.table_name
  `, [rlsTables]);
  const rlsDetails = rls.rows.map((row) => ({
    ...row,
    force_required: forceRlsTables.has(row.table_name),
  }));
  const rlsPass = rlsDetails.every((row) => row.table_exists
    && row.rls_enabled
    && (!row.force_required || row.rls_forced));

  const role = await client.query(`SELECT rolsuper, rolcreaterole, rolcreatedb, rolcanlogin, rolbypassrls FROM pg_roles WHERE rolname = 'laex_runtime'`);
  const runtimeRole = role.rows[0] ?? null;
  const rolePass = Boolean(runtimeRole) && !runtimeRole.rolsuper && !runtimeRole.rolcreaterole
    && !runtimeRole.rolcreatedb && runtimeRole.rolcanlogin && !runtimeRole.rolbypassrls;

  const tables = await client.query(`
    SELECT tablename AS table_name,
      has_table_privilege('laex_runtime', format('%I.%I', schemaname, tablename), 'SELECT') AS select_allowed,
      has_table_privilege('laex_runtime', format('%I.%I', schemaname, tablename), 'INSERT') AS insert_allowed,
      has_table_privilege('laex_runtime', format('%I.%I', schemaname, tablename), 'UPDATE') AS update_allowed,
      has_table_privilege('laex_runtime', format('%I.%I', schemaname, tablename), 'DELETE') AS delete_allowed,
      has_table_privilege('laex_runtime', format('%I.%I', schemaname, tablename), 'TRUNCATE') AS truncate_allowed
    FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
  `);
  const dmlPass = tables.rows.length > 0 && tables.rows.every((row) => row.select_allowed && row.insert_allowed && row.update_allowed && row.delete_allowed);
  const truncatePass = tables.rows.length > 0 && tables.rows.every((row) => !row.truncate_allowed);

  const sequences = await client.query(`
    SELECT sequencename AS sequence_name,
      has_sequence_privilege('laex_runtime', format('%I.%I', schemaname, sequencename), 'USAGE') AS usage_allowed,
      has_sequence_privilege('laex_runtime', format('%I.%I', schemaname, sequencename), 'SELECT') AS select_allowed
    FROM pg_sequences WHERE schemaname = 'public' ORDER BY sequencename
  `);
  const sequencesPass = sequences.rows.every((row) => row.usage_allowed && row.select_allowed);

  const schemaAndFunction = await client.query(`
    SELECT has_schema_privilege('laex_runtime', 'public', 'USAGE') AS schema_usage,
      has_schema_privilege('laex_runtime', 'public', 'CREATE') AS schema_create,
      to_regprocedure('public.laex_require_context()') IS NOT NULL AS function_exists,
      COALESCE((SELECT has_function_privilege('laex_runtime', p.oid, 'EXECUTE')
        FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public' AND p.proname = 'laex_require_context' LIMIT 1), false) AS function_execute
  `);
  const schemaFunction = schemaAndFunction.rows[0];

  const checks = [
    check("migrations_0001_0008", versionsPass, migrationRows.map((row) => row.version)),
    check("migration_checksums", checksumsPass, migrationRows),
    check("rls_and_force_rls", rlsPass, rlsDetails),
    check("laex_runtime_attributes", rolePass, runtimeRole),
    check("table_dml", dmlPass, tables.rows),
    check("truncate_revoked", truncatePass, tables.rows.map((row) => ({ table: row.table_name, truncateAllowed: row.truncate_allowed }))),
    check("sequences", sequencesPass, sequences.rows.length === 0 ? { count: 0, applicable: false } : sequences.rows),
    check("laex_require_context_execute", schemaFunction.function_exists && schemaFunction.function_execute, { exists: schemaFunction.function_exists, execute: schemaFunction.function_execute }),
    check("public_schema_usage", schemaFunction.schema_usage, { usage: schemaFunction.schema_usage }),
    check("public_schema_create_revoked", !schemaFunction.schema_create, { create: schemaFunction.schema_create }),
  ];
  return { mode: diagnoseOnly ? "diagnose-only" : "apply-and-validate", checks,
    passed: checks.every((item) => item.status === "PASS"),
    failedChecks: checks.filter((item) => item.status === "FAIL").map((item) => item.name) };
}

const selected = selectMigrationConnection(process.env, { directOnly: true });
const { connectionString, diagnostic } = validateMigrationConnection(selected.source, selected.connectionString);
console.log(formatSafeMigrationDiagnostic(diagnostic));
const pool = new pg.Pool({ connectionString, max: 1, application_name: "laex-runtime-grants" });
const client = await pool.connect();

try {
  if (!diagnoseOnly) {
    await client.query("BEGIN");
    await client.query(`
      GRANT USAGE ON SCHEMA public TO laex_runtime;
      REVOKE CREATE ON SCHEMA public FROM laex_runtime;
      GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO laex_runtime;
      REVOKE TRUNCATE ON ALL TABLES IN SCHEMA public FROM laex_runtime;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO laex_runtime;
      GRANT EXECUTE ON FUNCTION public.laex_require_context() TO laex_runtime;
      ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO laex_runtime;
      ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner IN SCHEMA public REVOKE TRUNCATE ON TABLES FROM laex_runtime;
      ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO laex_runtime;
      ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO laex_runtime;
    `);
  }
  const report = await collectDiagnostics(client);
  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) {
    if (!diagnoseOnly) await client.query("ROLLBACK");
    process.exitCode = 1;
  } else if (!diagnoseOnly) await client.query("COMMIT");
} catch (error) {
  if (!diagnoseOnly) await client.query("ROLLBACK");
  console.error(JSON.stringify({ mode: diagnoseOnly ? "diagnose-only" : "apply-and-validate",
    status: "ERROR", error: error instanceof Error ? error.message : "unknown_error" }));
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
