const normalizeOrigin = (value: string | undefined, fallback: string) => {
  try {
    const url = new URL(value || fallback);
    return `${url.protocol}//${url.host}`;
  } catch {
    return fallback;
  }
};

export const PUBLIC_ORIGINS = {
  laex: normalizeOrigin(process.env.LAEX_PUBLIC_ORIGIN, "https://laexapp.com"),
  lfPrinter: normalizeOrigin(process.env.LF_PRINTER_PUBLIC_ORIGIN, "https://lfprinterapp.com"),
} as const;

export const PUBLIC_HOSTS = {
  laex: new URL(PUBLIC_ORIGINS.laex).hostname.toLowerCase(),
  lfPrinter: new URL(PUBLIC_ORIGINS.lfPrinter).hostname.toLowerCase(),
} as const;

export const publicIndexingEnabled = process.env.LAEX_PUBLIC_INDEXING_ENABLED === "true";
