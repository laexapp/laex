CREATE TABLE IF NOT EXISTS accounting_expenses (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  company_id text NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  occurred_at timestamptz NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  tax_minor bigint NOT NULL DEFAULT 0 CHECK (tax_minor >= 0),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS accounting_expenses_company_date_idx ON accounting_expenses(tenant_id,company_id,occurred_at);
ALTER TABLE accounting_expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS accounting_expenses_tenant_company ON accounting_expenses;
CREATE POLICY accounting_expenses_tenant_company ON accounting_expenses USING (
  current_setting('laex.platform_access',true)='on' OR
  (tenant_id=current_setting('laex.tenant_id',true) AND company_id=current_setting('laex.company_id',true))
) WITH CHECK (
  current_setting('laex.platform_access',true)='on' OR
  (tenant_id=current_setting('laex.tenant_id',true) AND company_id=current_setting('laex.company_id',true))
);

CREATE TABLE IF NOT EXISTS accounting_report_runs (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  company_id text NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  user_id text NOT NULL,
  report_type text NOT NULL,
  period_from date NOT NULL,
  period_to date NOT NULL,
  result_count integer NOT NULL DEFAULT 0,
  exported boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX IF NOT EXISTS accounting_report_runs_company_date_idx ON accounting_report_runs(tenant_id,company_id,created_at);
ALTER TABLE accounting_report_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS accounting_report_runs_tenant_company ON accounting_report_runs;
CREATE POLICY accounting_report_runs_tenant_company ON accounting_report_runs USING (
  current_setting('laex.platform_access',true)='on' OR
  (tenant_id=current_setting('laex.tenant_id',true) AND company_id=current_setting('laex.company_id',true))
) WITH CHECK (
  current_setting('laex.platform_access',true)='on' OR
  (tenant_id=current_setting('laex.tenant_id',true) AND company_id=current_setting('laex.company_id',true))
);

CREATE TABLE IF NOT EXISTS identity_password_tokens (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  company_id text NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  user_id text NOT NULL,
  token_hash text NOT NULL UNIQUE,
  purpose text NOT NULL CHECK (purpose IN ('activation','recovery')),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
ALTER TABLE identity_password_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS identity_password_tokens_tenant_company ON identity_password_tokens;
CREATE POLICY identity_password_tokens_tenant_company ON identity_password_tokens USING (
  current_setting('laex.platform_access',true)='on' OR
  (tenant_id=current_setting('laex.tenant_id',true) AND company_id=current_setting('laex.company_id',true))
) WITH CHECK (
  current_setting('laex.platform_access',true)='on' OR
  (tenant_id=current_setting('laex.tenant_id',true) AND company_id=current_setting('laex.company_id',true))
);
