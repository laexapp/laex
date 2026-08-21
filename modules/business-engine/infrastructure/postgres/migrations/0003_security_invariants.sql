CREATE OR REPLACE FUNCTION laex_require_context() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF current_setting('laex.platform_access',true) <> 'on' AND
     (NEW.tenant_id <> current_setting('laex.tenant_id',true) OR NEW.company_id <> current_setting('laex.company_id',true)) THEN
    RAISE EXCEPTION 'tenant_company_context_mismatch' USING ERRCODE='42501';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS business_records_context_guard ON business_records;
CREATE TRIGGER business_records_context_guard BEFORE INSERT OR UPDATE ON business_records FOR EACH ROW EXECUTE FUNCTION laex_require_context();
DROP TRIGGER IF EXISTS idempotency_context_guard ON idempotency_keys;
CREATE TRIGGER idempotency_context_guard BEFORE INSERT OR UPDATE ON idempotency_keys FOR EACH ROW EXECUTE FUNCTION laex_require_context();

REVOKE TRUNCATE ON business_records,idempotency_keys FROM PUBLIC;
