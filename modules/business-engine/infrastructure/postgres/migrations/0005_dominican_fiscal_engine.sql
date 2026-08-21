CREATE TABLE IF NOT EXISTS business_fiscal_profiles (
  tenant_id text NOT NULL,
  company_id text PRIMARY KEY,
  rnc text NOT NULL,
  legal_name text,
  trade_name text,
  fiscal_address text,
  tax_regime text NOT NULL CHECK (tax_regime IN ('traditional','electronic','transition')),
  environment text NOT NULL CHECK (environment IN ('disabled','pre-certification','certification','production')),
  rule_version text NOT NULL,
  certificate_reference text,
  credential_reference text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, company_id)
);

CREATE TABLE IF NOT EXISTS business_fiscal_sequences (
  id uuid PRIMARY KEY,
  tenant_id text NOT NULL,
  company_id text NOT NULL,
  document_type text NOT NULL CHECK (document_type IN ('E31','E32','E33','E34','E41','E43','E44','E45','E46','E47')),
  range_start bigint NOT NULL CHECK (range_start > 0),
  range_end bigint NOT NULL,
  next_number bigint NOT NULL,
  authorization_reference text NOT NULL,
  environment text NOT NULL CHECK (environment IN ('pre-certification','certification','production')),
  status text NOT NULL CHECK (status IN ('active','exhausted','disabled')),
  CHECK (range_end >= range_start), CHECK (next_number >= range_start),
  UNIQUE (tenant_id, company_id, document_type, authorization_reference)
);
CREATE UNIQUE INDEX IF NOT EXISTS business_fiscal_one_active_sequence
  ON business_fiscal_sequences (tenant_id, company_id, document_type) WHERE status = 'active';

CREATE TABLE IF NOT EXISTS business_fiscal_documents (
  id uuid PRIMARY KEY,
  tenant_id text NOT NULL,
  company_id text NOT NULL,
  business_document_id text NOT NULL,
  document_type text NOT NULL,
  e_ncf varchar(13),
  status text NOT NULL,
  original_fiscal_document_id uuid REFERENCES business_fiscal_documents(id),
  canonical_payload jsonb NOT NULL,
  integrity_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, company_id, business_document_id, document_type),
  UNIQUE (tenant_id, company_id, e_ncf)
);

CREATE TABLE IF NOT EXISTS business_fiscal_reconciliations (
  id uuid PRIMARY KEY, tenant_id text NOT NULL, company_id text NOT NULL,
  period_from date NOT NULL, period_to date NOT NULL,
  status text NOT NULL CHECK (status IN ('balanced','differences')),
  differences jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE business_fiscal_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_fiscal_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_fiscal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_fiscal_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_fiscal_profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE business_fiscal_sequences FORCE ROW LEVEL SECURITY;
ALTER TABLE business_fiscal_documents FORCE ROW LEVEL SECURITY;
ALTER TABLE business_fiscal_reconciliations FORCE ROW LEVEL SECURITY;

DO $$ DECLARE table_name text; BEGIN
  FOREACH table_name IN ARRAY ARRAY['business_fiscal_profiles','business_fiscal_sequences','business_fiscal_documents','business_fiscal_reconciliations'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS tenant_company_isolation ON %I', table_name);
    EXECUTE format('CREATE POLICY tenant_company_isolation ON %I USING (current_setting(''laex.platform_access'',true) = ''on'' OR (tenant_id = current_setting(''laex.tenant_id'', true) AND company_id = current_setting(''laex.company_id'', true))) WITH CHECK (current_setting(''laex.platform_access'',true) = ''on'' OR (tenant_id = current_setting(''laex.tenant_id'', true) AND company_id = current_setting(''laex.company_id'', true)))', table_name);
  END LOOP;
END $$;
