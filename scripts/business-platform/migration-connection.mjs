const POSTGRES_PROTOCOLS = new Set(["postgres:", "postgresql:"]);
const SSL_MODES = new Set(["prefer", "require", "verify-ca", "verify-full"]);

export function selectMigrationConnection(environment, { directOnly = false } = {}) {
  const direct = environment.BUSINESS_DATABASE_DIRECT_URL;
  const runtime = environment.BUSINESS_DATABASE_URL;

  if (direct !== undefined) {
    return { source: "BUSINESS_DATABASE_DIRECT_URL", connectionString: direct };
  }
  if (directOnly) {
    throw new Error("BUSINESS_DATABASE_DIRECT_URL is required when --direct-only is enabled");
  }
  if (runtime !== undefined) {
    return { source: "BUSINESS_DATABASE_URL", connectionString: runtime };
  }
  throw new Error("BUSINESS_DATABASE_DIRECT_URL or BUSINESS_DATABASE_URL is required");
}

export function validateMigrationConnection(source, connectionString) {
  if (typeof connectionString !== "string" || connectionString.length === 0) {
    throw new Error(`${source} is empty`);
  }
  if (connectionString !== connectionString.trim()) {
    throw new Error(`${source} must not contain leading or trailing whitespace`);
  }
  if (/^[A-Za-z_][A-Za-z0-9_]*\s*=/.test(connectionString)) {
    throw new Error(`${source} must contain only the PostgreSQL URL, without VARIABLE=`);
  }
  if (/^psql(?:\.exe)?(?:\s|$)/i.test(connectionString)) {
    throw new Error(`${source} must contain only the PostgreSQL URL, without a psql command`);
  }
  if (/^["']|["']$/.test(connectionString)) {
    throw new Error(`${source} must contain the URL without surrounding quotes`);
  }

  let parsed;
  try {
    parsed = new URL(connectionString);
  } catch {
    throw new Error(`${source} is not a valid URL`);
  }
  if (!POSTGRES_PROTOCOLS.has(parsed.protocol)) {
    throw new Error(`${source} protocol must be postgres: or postgresql:`);
  }
  if (!parsed.hostname) {
    throw new Error(`${source} must include a hostname`);
  }

  const database = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
  if (!database) {
    throw new Error(`${source} must include a database name`);
  }
  const sslMode = parsed.searchParams.get("sslmode")?.toLowerCase();
  const ssl = parsed.searchParams.get("ssl")?.toLowerCase() === "true"
    || (sslMode !== undefined && SSL_MODES.has(sslMode));

  return {
    connectionString,
    diagnostic: {
      source,
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      database,
      ssl,
    },
  };
}

export function formatSafeMigrationDiagnostic(diagnostic) {
  return [
    "migration_connection",
    `source: ${diagnostic.source}`,
    `protocol: ${diagnostic.protocol}`,
    `hostname: ${diagnostic.hostname}`,
    `database: ${diagnostic.database}`,
    `ssl: ${diagnostic.ssl}`,
  ].join("\n");
}
