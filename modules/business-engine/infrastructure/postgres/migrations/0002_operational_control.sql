CREATE TABLE IF NOT EXISTS backup_history (
  id text PRIMARY KEY,
  kind text NOT NULL CHECK(kind IN ('manual','scheduled')),
  status text NOT NULL CHECK(status IN ('pending','completed','failed')),
  created_at timestamptz NOT NULL,
  completed_at timestamptz,
  location text,
  size_bytes bigint,
  checksum text,
  restore_test_status text NOT NULL DEFAULT 'not-tested',
  retention_until timestamptz,
  error_code text
);

CREATE TABLE IF NOT EXISTS service_health_events (
  id bigserial PRIMARY KEY,
  service text NOT NULL,
  severity text NOT NULL,
  code text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  resolved_at timestamptz
);

CREATE TABLE IF NOT EXISTS deployment_metadata (
  singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),
  application_version text NOT NULL,
  storage_engine text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
INSERT INTO deployment_metadata(singleton,application_version,storage_engine)
VALUES(true,'1.0.0','postgresql') ON CONFLICT(singleton) DO UPDATE SET storage_engine='postgresql',updated_at=clock_timestamp();
