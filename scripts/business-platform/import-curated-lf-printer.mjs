import pg from "pg";
import { formatSafeMigrationDiagnostic, validateMigrationConnection } from "./migration-connection.mjs";

const apply = process.argv.includes("--apply");
const sourceRaw = process.env.BUSINESS_SOURCE_DATABASE_URL ?? process.env.BUSINESS_DATABASE_URL;
const targetRaw = process.env.BUSINESS_DATABASE_DIRECT_URL;
if (!sourceRaw) throw new Error("BUSINESS_SOURCE_DATABASE_URL or BUSINESS_DATABASE_URL is required for the local source");
if (!targetRaw) throw new Error("BUSINESS_DATABASE_DIRECT_URL is required for the Neon target");

const source = validateMigrationConnection(process.env.BUSINESS_SOURCE_DATABASE_URL ? "BUSINESS_SOURCE_DATABASE_URL" : "BUSINESS_DATABASE_URL", sourceRaw);
const target = validateMigrationConnection("BUSINESS_DATABASE_DIRECT_URL", targetRaw);
if (source.connectionString === target.connectionString) throw new Error("source_and_target_must_be_different");
if (target.diagnostic.database !== "neondb") throw new Error("target_database_must_be_neondb");

console.log(formatSafeMigrationDiagnostic(source.diagnostic).replace("migration_connection", "source_connection"));
console.log(formatSafeMigrationDiagnostic(target.diagnostic).replace("migration_connection", "target_connection"));

const tenantId = "tenant-chapter-seven-clean";
const companyId = "company-chapter-seven-clean";
const productionSlug = "lf-printer";
const productionHostname = "lfprinterapp.com";
const sourcePool = new pg.Pool({ connectionString: source.connectionString, max: 1, application_name: "laex-curated-export" });
const targetPool = new pg.Pool({ connectionString: target.connectionString, max: 1, application_name: "laex-curated-import" });

function assert(condition, code) {
  if (!condition) throw new Error(code);
}

const sourceClient = await sourcePool.connect();
const targetClient = await targetPool.connect();
try {
  await sourceClient.query("BEGIN READ ONLY");
  await sourceClient.query("SET LOCAL laex.platform_access='on'");

  const tenant = (await sourceClient.query("SELECT * FROM tenants WHERE id=$1", [tenantId])).rows[0];
  const company = (await sourceClient.query("SELECT * FROM companies WHERE id=$1 AND tenant_id=$2", [companyId, tenantId])).rows[0];
  assert(tenant && company, "source_company_context_missing");

  const projections = (await sourceClient.query(`
    SELECT * FROM commerce_projections
    WHERE tenant_id=$1 AND company_id=$2 AND publication_status='published'
    ORDER BY product_id
  `, [tenantId, companyId])).rows;
  assert(projections.length === 8, "source_must_have_exactly_eight_published_projections");
  const productIds = projections.map((row) => row.product_id);

  const products = (await sourceClient.query(`
    SELECT * FROM business_records
    WHERE tenant_id=$1 AND company_id=$2 AND bucket='products'
      AND payload->>'id'=ANY($3::text[])
    ORDER BY record_key
  `, [tenantId, companyId, productIds])).rows;
  assert(products.length === 8, "published_product_record_count_mismatch");

  const inventory = (await sourceClient.query(`
    SELECT * FROM business_records
    WHERE tenant_id=$1 AND company_id=$2 AND bucket='inventory'
      AND payload->>'productId'=ANY($3::text[])
    ORDER BY record_key
  `, [tenantId, companyId, productIds])).rows;
  const productMedia = (await sourceClient.query(`
    SELECT * FROM business_records
    WHERE tenant_id=$1 AND company_id=$2 AND bucket='productMedia'
      AND payload->>'productId'=ANY($3::text[])
    ORDER BY record_key
  `, [tenantId, companyId, productIds])).rows;
  const projectionRecords = (await sourceClient.query(`
    SELECT * FROM business_records
    WHERE tenant_id=$1 AND company_id=$2 AND bucket='commerceProjections'
      AND payload->>'productId'=ANY($3::text[])
      AND payload->>'publicationStatus'='published'
    ORDER BY record_key
  `, [tenantId, companyId, productIds])).rows;
  const locations = (await sourceClient.query(`
    SELECT * FROM business_records
    WHERE tenant_id=$1 AND company_id=$2 AND bucket=ANY($3::text[])
    ORDER BY bucket,record_key
  `, [tenantId, companyId, ["branches", "warehouses"]])).rows;
  const platformContext = (await sourceClient.query(`
    SELECT * FROM platform_records
    WHERE (bucket='platformTenants' AND payload->>'id'=$1)
       OR (bucket='platformCompanies' AND payload->>'id'=$2)
    ORDER BY bucket,record_key
  `, [tenantId, companyId])).rows;

  const sourceOrders = Number((await sourceClient.query("SELECT count(*) AS count FROM commerce_orders WHERE tenant_id=$1 AND company_id=$2", [tenantId, companyId])).rows[0].count);
  const sourceUnpublishedProducts = Number((await sourceClient.query(`
    SELECT count(*) AS count FROM business_records
    WHERE tenant_id=$1 AND company_id=$2 AND bucket='products'
      AND NOT (payload->>'id'=ANY($3::text[]))
  `, [tenantId, companyId, productIds])).rows[0].count);

  const packageSummary = {
    tenantId, companyId, productionSlug,
    products: products.length,
    inventoryMovements: inventory.length,
    productMedia: productMedia.length,
    businessProjectionRecords: projectionRecords.length,
    normalizedProjections: projections.length,
    locations: locations.length,
    excludedProducts: sourceUnpublishedProducts,
    excludedOrders: sourceOrders,
  };
  console.log(JSON.stringify({ phase: "selection", mode: apply ? "apply" : "dry-run", ...packageSummary }, null, 2));

  if (!apply) {
    await sourceClient.query("ROLLBACK");
    process.exitCode = 0;
  } else {
    await targetClient.query("BEGIN ISOLATION LEVEL SERIALIZABLE");
    await targetClient.query("SET LOCAL laex.platform_access='on'");
    const targetData = await targetClient.query(`
      SELECT
        (SELECT count(*) FROM tenants)::int AS tenants,
        (SELECT count(*) FROM companies)::int AS companies,
        (SELECT count(*) FROM business_records)::int AS business_records,
        (SELECT count(*) FROM commerce_projections)::int AS projections,
        (SELECT count(*) FROM commerce_orders)::int AS orders
    `);
    assert(Object.values(targetData.rows[0]).every((value) => value === 0), "target_not_empty_import_refused");

    const companyConfiguration = { ...company.configuration, slug: productionSlug, status: "active" };
    await targetClient.query("INSERT INTO tenants(id,name,status,created_at) VALUES($1,$2,$3,$4)", [tenant.id, tenant.name, "active", tenant.created_at]);
    await targetClient.query(`
      INSERT INTO companies(id,tenant_id,slug,hostname,name,legal_name,status,currency,timezone,configuration,created_at)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    `, [company.id, company.tenant_id, productionSlug, productionHostname, company.name, company.legal_name, "active", company.currency, company.timezone, companyConfiguration, company.created_at]);

    for (const row of platformContext) {
      const payload = row.bucket === "platformCompanies"
        ? { ...row.payload, slug: productionSlug, status: "active" }
        : { ...row.payload, status: "active" };
      await targetClient.query("INSERT INTO platform_records(bucket,record_key,payload,updated_at) VALUES($1,$2,$3,$4)", [row.bucket, row.record_key, payload, row.updated_at]);
    }
    for (const row of [...locations, ...products, ...inventory, ...productMedia, ...projectionRecords]) {
      await targetClient.query(`
        INSERT INTO business_records(bucket,record_key,tenant_id,company_id,payload,updated_at)
        VALUES($1,$2,$3,$4,$5,$6)
      `, [row.bucket, row.record_key, row.tenant_id, row.company_id, row.payload, row.updated_at]);
    }
    for (const row of projections) {
      await targetClient.query(`
        INSERT INTO commerce_projections(id,tenant_id,company_id,product_id,slug,payload,publication_status,version,updated_at)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
      `, [row.id, row.tenant_id, row.company_id, row.product_id, row.slug, row.payload, row.publication_status, row.version, row.updated_at]);
    }

    const validation = await targetClient.query(`
      SELECT
        (SELECT count(*) FROM business_records WHERE tenant_id=$1 AND company_id=$2 AND bucket='products')::int AS products,
        (SELECT count(*) FROM business_records WHERE tenant_id=$1 AND company_id=$2 AND bucket='inventory')::int AS inventory,
        (SELECT count(*) FROM business_records WHERE tenant_id=$1 AND company_id=$2 AND bucket='productMedia')::int AS media,
        (SELECT count(*) FROM commerce_projections WHERE tenant_id=$1 AND company_id=$2 AND publication_status='published')::int AS projections,
        (SELECT count(*) FROM commerce_orders WHERE tenant_id=$1 AND company_id=$2)::int AS orders,
        (SELECT count(*) FROM commerce_reservations WHERE tenant_id=$1 AND company_id=$2)::int AS reservations
    `, [tenantId, companyId]);
    const counts = validation.rows[0];
    assert(counts.products === 8, "target_product_count_invalid");
    assert(counts.inventory === inventory.length, "target_inventory_count_invalid");
    assert(counts.media === productMedia.length, "target_media_count_invalid");
    assert(counts.projections === 8, "target_projection_count_invalid");
    assert(counts.orders === 0 && counts.reservations === 0, "test_orders_or_reservations_imported");

    const identityValidation = await targetClient.query(`
      SELECT bool_and(source.product_id=target.product_id AND source.id=target.id
        AND source.slug=target.slug AND source.payload=target.payload) AS preserved
      FROM unnest($1::uuid[], $2::text[], $3::text[], $4::jsonb[]) AS source(id,product_id,slug,payload)
      JOIN commerce_projections target ON target.id=source.id
    `, [projections.map((row) => row.id), productIds, projections.map((row) => row.slug), projections.map((row) => row.payload)]);
    assert(identityValidation.rows[0]?.preserved, "projection_identity_or_payload_changed");

    await targetClient.query("COMMIT");
    await sourceClient.query("ROLLBACK");
    console.log(JSON.stringify({ phase: "import-complete", status: "PASS", ...packageSummary, targetCounts: counts, projectionIdentityPreserved: true }, null, 2));
  }
} catch (error) {
  try { await sourceClient.query("ROLLBACK"); } catch {}
  try { await targetClient.query("ROLLBACK"); } catch {}
  console.error(JSON.stringify({ phase: "curated-import", status: "ERROR", error: error instanceof Error ? error.message : "unknown_error" }));
  process.exitCode = 1;
} finally {
  sourceClient.release();
  targetClient.release();
  await sourcePool.end();
  await targetPool.end();
}
