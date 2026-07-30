export const TYPOGRAPHY = {
  fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  monoFamily: "var(--font-geist-mono), ui-monospace, monospace",

  size: {
    label: "11px",
    caption: "12px",
    body: "16px",
    lead: "18px",
    title: "32px",
    section: "48px",
    display: "72px",
  },

  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  lineHeight: {
    body: 1.6,
    title: 1.15,
    display: 1.02,
  },
} as const;