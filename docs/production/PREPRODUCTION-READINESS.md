# LAEX + LF-PRINTER preproduction readiness

Date: 2026-08-21. This document prepares publication but does not authorize deployment, DNS changes, indexing, or data deletion.

## Approved topology

- `https://laexapp.com`: LAEX ecosystem, projects, Business and protected Control Plane.
- `https://lfprinterapp.com`: public LF-PRINTER storefront on the same Vercel project and codebase.
- `https://lfprinterapp.com/productos/[slug]`: published Commerce product detail.
- `https://lfprinterapp.com/seguimiento`: public order tracking.
- One Business Engine, one Commerce engine and one production PostgreSQL database.
- LF-PRINTER remains the commercial brand; `lfprinterapp.com` is only its web address.

## Production identity and local data classification

The definitive Commerce company slug is `lf-printer`. Production must set `COMMERCE_REFERENCE_COMPANY_SLUG=lf-printer`.

The local pilot currently has company id `company-chapter-seven-clean`, tenant id `tenant-chapter-seven-clean`, company name `LF-PRINTER`, and historical slug `empresa-limpia-c7`. It contains 33 products, 31 inventory movements, 8 published projections, and 9 audit orders. The local database remains unchanged.

Migration must preserve the existing tenant/company and product identifiers while promoting the company slug to `lf-printer`. Only the eight published products and their associated inventory, media references, prices, promotions, and Commerce projections are approved for the initial public catalog. The other 25 products and the 9 audit orders are classified as non-production until CEO/Architecture explicitly approves otherwise.

Run `npm run business:production-data-audit` before export and after import. A production import is accepted only when the configured target exists, exactly eight intended projections are published, migration checksums match, and tenant/company RLS tests pass.

## Vercel environment contract

Production-only values:

- `BUSINESS_DATABASE_URL`: Neon pooled runtime URL.
- `BUSINESS_DATABASE_DIRECT_URL`: Neon direct URL for migrations and backups; not for application traffic.
- `BUSINESS_SESSION_SECRET`: independent high-entropy business-session signing secret.
- `LAEX_CONTROL_PLANE_SECRET`: independent high-entropy administrative-session signing secret.
- `LAEX_CONTROL_PLANE_PASSWORD`: CEO-selected administrative password.
- `BUSINESS_DEPLOYMENT_MODE=saas`.
- `BUSINESS_ALLOW_INSECURE_LOCAL_FALLBACK=false`.
- `COMMERCE_REFERENCE_COMPANY_SLUG=lf-printer`.
- `LAEX_PUBLIC_ORIGIN=https://laexapp.com`.
- `LF_PRINTER_PUBLIC_ORIGIN=https://lfprinterapp.com`.
- `LAEX_MULTIDOMAIN_ROUTING_ENABLED=true` only after both domains and TLS validate.
- `LAEX_PUBLIC_INDEXING_ENABLED=false` through final acceptance.
- `LAEX_LEGACY_REDIRECT_ENABLED=false` until the prior domain is explicitly identified and approved.
- `LAEX_LEGACY_HOSTS`: comma-separated prior hosts, if approved later.
- `LAEX_ADDITIONAL_ALLOWED_HOSTS=laex.vercel.app` while the Vercel production alias remains available.
- `BUSINESS_BACKUP_RETENTION_DAYS=30`.

Canva, if kept enabled:

- `CANVA_CLIENT_ID`
- `CANVA_CLIENT_SECRET`
- `CANVA_REDIRECT_URI=https://laexapp.com/api/integrations/canva/callback`
- `CANVA_TOKEN_ENCRYPTION_KEY`
- `CANVA_OAUTH_COOKIE_SECRET`
- `CANVA_SCOPES`

Media provider variables remain conditional and no external payment provider is enabled.

## Neon gate

1. Create a production project owned by the LAEX organization in a region close to the Vercel functions.
2. Confirm the PostgreSQL major version is compatible with the local PostgreSQL 18 source.
3. Create a non-superuser runtime role and a separate migration/backup role.
4. Map the Neon pooled connection to `BUSINESS_DATABASE_URL` and the unpooled connection to `BUSINESS_DATABASE_DIRECT_URL`.
5. Run versioned migrations over the direct connection.
6. Import the approved, tenant-scoped production set without changing IDs or audit relationships.
7. Verify RLS, counts, checksums, stock derived from movements, idempotency and the eight public projections.
8. Create a separate Preview database/branch. Preview deployments must never use Production credentials.

## Namecheap/Vercel DNS gate

Add both apex domains and their `www` variants to the existing Vercel project before changing Namecheap DNS. Vercel must display the final project-specific records. The general Vercel values are:

- `laexapp.com`: `A`, host `@`, value `76.76.21.21`.
- `www.laexapp.com`: `CNAME`, host `www`, value displayed by Vercel (general fallback `cname.vercel-dns-0.com`).
- `lfprinterapp.com`: `A`, host `@`, value `76.76.21.21`.
- `www.lfprinterapp.com`: `CNAME`, host `www`, value displayed by Vercel (general fallback `cname.vercel-dns-0.com`).

If Vercel requests a TXT ownership record, use exactly its displayed name/value. Do not replace unrelated MX/TXT records. Vercel's project-specific values take precedence over the general values above.

Configure apex domains as primary and redirect each `www` variant to its corresponding apex. Vercel provisions TLS after DNS validation.

## Release order

1. Approve Vercel and Neon plans.
2. Create Neon and configure scoped Vercel variables with indexing disabled.
3. Apply migrations and curated production import.
4. Deploy from the reviewed `main` commit.
5. Attach domains in Vercel, then set Namecheap records.
6. Validate TLS, host routing, admin blocking, catalog, checkout, tracking, WhatsApp and OneMillionMiners.
7. Register and test the Canva callback if Canva remains enabled.
8. Authorize indexing only after CEO/Architecture signs off.

Rollback is reversible: disable multidomain routing, return the Vercel production alias to the prior deployment, and restore Neon to the accepted recovery point. Never delete the local source database during launch.
