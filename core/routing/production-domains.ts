import { PUBLIC_HOSTS, PUBLIC_ORIGINS } from "../config/public-origins";

const cleanHost = (value: string | null) => (value ?? "").split(",")[0].trim().toLowerCase().split(":")[0];
const splitHosts = (value: string | undefined) => (value ?? "").split(",").map(cleanHost).filter(Boolean);

export const productionRoutingEnabled = () => process.env.LAEX_MULTIDOMAIN_ROUTING_ENABLED === "true";
export const legacyRedirectEnabled = () => process.env.LAEX_LEGACY_REDIRECT_ENABLED === "true";
export const requestHost = (headers: Headers) => cleanHost(headers.get("x-forwarded-host") ?? headers.get("host"));

export const isAllowedProductionHost = (host: string) => {
  if (!host || host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost")) return true;
  const exactVercelPreviewHost = process.env.VERCEL_ENV === "preview" ? cleanHost(process.env.VERCEL_URL ?? null) : "";
  return host === exactVercelPreviewHost || new Set([PUBLIC_HOSTS.laex, PUBLIC_HOSTS.lfPrinter, `www.${PUBLIC_HOSTS.laex}`, `www.${PUBLIC_HOSTS.lfPrinter}`, ...splitHosts(process.env.LAEX_ADDITIONAL_ALLOWED_HOSTS)]).has(host);
};

export const isLfPrinterHost = (host: string) => host === PUBLIC_HOSTS.lfPrinter || host === `www.${PUBLIC_HOSTS.lfPrinter}`;
export const isLaexHost = (host: string) => host === PUBLIC_HOSTS.laex || host === `www.${PUBLIC_HOSTS.laex}`;
export const isLegacyHost = (host: string) => splitHosts(process.env.LAEX_LEGACY_HOSTS).includes(host);

export const blockedOnLfPrinter = (pathname: string) => [
  "/business", "/laex", "/laboratorio", "/configuracion", "/settings", "/profile", "/perfil", "/media-intelligence",
  "/api/business-app", "/api/business-engine", "/api/laboratory", "/api/laex-control", "/api/integrations", "/api/media-intelligence",
].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export const commerceApiAllowedOnLfPrinter = (pathname: string) => {
  const company = process.env.COMMERCE_REFERENCE_COMPANY_SLUG?.trim().toLowerCase();
  if (!company) return false;
  const prefix = `/api/commerce/${company}`;
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
};

export const lfPrinterDestination = (pathname: string) => {
  if (pathname === "/") return "/proyectos/lf-printer";
  if (pathname === "/productos") return "/proyectos/lf-printer#catalogo";
  if (pathname.startsWith("/productos/")) return `/proyectos/lf-printer${pathname}`;
  if (pathname === "/seguimiento") return "/proyectos/lf-printer/seguimiento";
  if (pathname === "/tu-reset-gratis" || pathname.startsWith("/tu-reset-gratis/")) return `/proyectos/lf-printer${pathname}`;
  return null;
};

export const canonicalOrigins = PUBLIC_ORIGINS;
