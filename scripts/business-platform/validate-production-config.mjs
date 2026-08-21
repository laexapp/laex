const required = [
  "BUSINESS_DATABASE_URL",
  "BUSINESS_DATABASE_DIRECT_URL",
  "BUSINESS_SESSION_SECRET",
  "LAEX_CONTROL_PLANE_SECRET",
  "LAEX_CONTROL_PLANE_PASSWORD",
  "COMMERCE_REFERENCE_COMPANY_SLUG",
  "LAEX_PUBLIC_ORIGIN",
  "LF_PRINTER_PUBLIC_ORIGIN",
  "CANVA_REDIRECT_URI",
];

const missing = required.filter((name) => !process.env[name]?.trim());
const expected = {
  LAEX_PUBLIC_ORIGIN: "https://laexapp.com",
  LF_PRINTER_PUBLIC_ORIGIN: "https://lfprinterapp.com",
  CANVA_REDIRECT_URI: "https://laexapp.com/api/integrations/canva/callback",
};
const invalid = Object.entries(expected).filter(([name, value]) => process.env[name] !== value).map(([name]) => name);
if (process.env.LAEX_MULTIDOMAIN_ROUTING_ENABLED !== "true") invalid.push("LAEX_MULTIDOMAIN_ROUTING_ENABLED");
if (process.env.LAEX_PUBLIC_INDEXING_ENABLED !== "false") invalid.push("LAEX_PUBLIC_INDEXING_ENABLED");
if (process.env.BUSINESS_ALLOW_INSECURE_LOCAL_FALLBACK !== "false") invalid.push("BUSINESS_ALLOW_INSECURE_LOCAL_FALLBACK");
if (process.env.BUSINESS_DEPLOYMENT_MODE !== "saas") invalid.push("BUSINESS_DEPLOYMENT_MODE");
if (missing.length || invalid.length) {
  console.error(JSON.stringify({ ready: false, missing, invalid: [...new Set(invalid)] }));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ ready: true, requiredVariablesPresent: required.length, indexingEnabled: false }));
}
