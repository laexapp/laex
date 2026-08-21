CREATE TABLE IF NOT EXISTS laex_schema_migrations (
  version text PRIMARY KEY,
  checksum text NOT NULL,
  applied_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  execution_ms integer NOT NULL
);

CREATE TABLE IF NOT EXISTS tenants (
  id text PRIMARY KEY,
  name text NOT NULL,
  status text NOT NULL CHECK (status IN ('trial','active','suspended','cancelled')),
  created_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS companies (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id),
  slug text NOT NULL UNIQUE,
  hostname text,
  name text NOT NULL,
  legal_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('trial','active','suspended','cancelled')),
  currency char(3) NOT NULL,
  timezone text NOT NULL,
  configuration jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL,
  UNIQUE (tenant_id,id)
);

CREATE TABLE IF NOT EXISTS platform_records (
  bucket text NOT NULL,
  record_key text NOT NULL,
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY (bucket,record_key)
);

CREATE TABLE IF NOT EXISTS business_records (
  bucket text NOT NULL,
  record_key text NOT NULL,
  tenant_id text NOT NULL,
  company_id text NOT NULL,
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY (tenant_id,company_id,bucket,record_key),
  FOREIGN KEY (tenant_id,company_id) REFERENCES companies(tenant_id,id) DEFERRABLE INITIALLY DEFERRED
);
CREATE INDEX IF NOT EXISTS business_records_lookup_idx ON business_records(tenant_id,company_id,bucket,updated_at DESC);

ALTER TABLE business_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_company_isolation ON business_records;
CREATE POLICY tenant_company_isolation ON business_records
  USING (
    current_setting('laex.platform_access',true) = 'on'
    OR (tenant_id = current_setting('laex.tenant_id',true) AND company_id = current_setting('laex.company_id',true))
  )
  WITH CHECK (
    current_setting('laex.platform_access',true) = 'on'
    OR (tenant_id = current_setting('laex.tenant_id',true) AND company_id = current_setting('laex.company_id',true))
  );

CREATE TABLE IF NOT EXISTS idempotency_keys (
  tenant_id text NOT NULL,
  company_id text NOT NULL,
  operation_key text NOT NULL,
  response jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY (tenant_id,company_id,operation_key),
  FOREIGN KEY (tenant_id,company_id) REFERENCES companies(tenant_id,id) DEFERRABLE INITIALLY DEFERRED
);
ALTER TABLE idempotency_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE idempotency_keys FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS idempotency_isolation ON idempotency_keys;
CREATE POLICY idempotency_isolation ON idempotency_keys USING (current_setting('laex.platform_access',true)='on' OR (tenant_id=current_setting('laex.tenant_id',true) AND company_id=current_setting('laex.company_id',true))) WITH CHECK (current_setting('laex.platform_access',true)='on' OR (tenant_id=current_setting('laex.tenant_id',true) AND company_id=current_setting('laex.company_id',true)));
