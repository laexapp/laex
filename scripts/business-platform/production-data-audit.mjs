import pg from "pg";

const connectionString = process.env.BUSINESS_DATABASE_DIRECT_URL ?? process.env.BUSINESS_DATABASE_URL;
if (!connectionString) throw new Error("BUSINESS_DATABASE_DIRECT_URL or BUSINESS_DATABASE_URL is required");

const pool = new pg.Pool({ connectionString, max: 1, application_name: "laex-production-data-audit" });
const client = await pool.connect();
try {
  await client.query("BEGIN READ ONLY");
  await client.query("SET LOCAL laex.platform_access='on'");
  const companies = await client.query(`
    SELECT c.id, c.tenant_id, c.slug, c.name, c.status,
      (SELECT count(*)::int FROM business_records r WHERE r.tenant_id=c.tenant_id AND r.company_id=c.id AND r.bucket='products') AS products,
      (SELECT count(*)::int FROM business_records r WHERE r.tenant_id=c.tenant_id AND r.company_id=c.id AND r.bucket='inventory') AS inventory_movements,
      (SELECT count(*)::int FROM commerce_projections p WHERE p.tenant_id=c.tenant_id AND p.company_id=c.id AND p.publication_status='published') AS published_projections,
      (SELECT count(*)::int FROM commerce_orders o WHERE o.tenant_id=c.tenant_id AND o.company_id=c.id) AS orders
    FROM companies c
    ORDER BY c.slug
  `);
  const migrations = await client.query("SELECT version, checksum FROM laex_schema_migrations ORDER BY version");
  const publishedProducts = await client.query(`
    SELECT p.tenant_id, p.company_id, p.product_id, p.slug,
      p.payload->>'publicName' AS name,
      COALESCE(p.payload->'promotion'->>'priceMinor',p.payload->>'publicPriceMinor') AS price_minor,
      CASE WHEN jsonb_array_length(COALESCE(p.payload->'images','[]'::jsonb)) > 0 THEN 'associated' ELSE 'pending' END AS media_status,
      p.payload->'images'->0->>'assetReference' AS asset_id,
      COALESCE((SELECT sum((r.payload->>'delta')::int) FROM business_records r WHERE r.tenant_id=p.tenant_id AND r.company_id=p.company_id AND r.bucket='inventory' AND r.payload->>'productId'=p.product_id),0)::int AS inventory_quantity
    FROM commerce_projections p
    WHERE p.publication_status='published'
    ORDER BY p.company_id,p.slug
  `);
  const targetSlug = process.env.COMMERCE_REFERENCE_COMPANY_SLUG?.trim() || null;
  const target = targetSlug ? companies.rows.find((company) => company.slug === targetSlug) ?? null : null;
  console.log(JSON.stringify({
    databaseReachable: true,
    targetSlugConfigured: Boolean(targetSlug),
    targetFound: Boolean(target),
    target,
    companies: companies.rows,
    publishedProducts: publishedProducts.rows,
    migrations: migrations.rows.map(({ version, checksum }) => ({ version, checksumPresent: Boolean(checksum) })),
    productionSelectionRequired: !target,
  }, null, 2));
  await client.query("ROLLBACK");
} catch (error) {
  try { await client.query("ROLLBACK"); } catch {}
  throw error;
} finally {
  client.release();
  await pool.end();
}
