CREATE TABLE IF NOT EXISTS business_ai_activity (
 id uuid PRIMARY KEY, tenant_id text NOT NULL, company_id text NOT NULL, user_id text NOT NULL,
 session_id text, agent text NOT NULL CHECK(agent IN ('LIA','ALAN','ETHAN')), provider text NOT NULL,
 model text NOT NULL, intent text NOT NULL, tools jsonb NOT NULL DEFAULT '[]', result text NOT NULL,
 data_categories jsonb NOT NULL DEFAULT '[]', input_units bigint NOT NULL DEFAULT 0,
 output_units bigint NOT NULL DEFAULT 0, estimated_cost_usd_micros bigint NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS business_ai_activity_scope_time ON business_ai_activity(tenant_id,company_id,user_id,created_at DESC);
ALTER TABLE business_ai_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_ai_activity FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_company_isolation ON business_ai_activity;
CREATE POLICY tenant_company_isolation ON business_ai_activity USING(current_setting('laex.platform_access',true)='on' OR (tenant_id=current_setting('laex.tenant_id',true) AND company_id=current_setting('laex.company_id',true))) WITH CHECK(current_setting('laex.platform_access',true)='on' OR (tenant_id=current_setting('laex.tenant_id',true) AND company_id=current_setting('laex.company_id',true)));
