# LAEX + LF-PRINTER production launch runbook

This preparation is inert until `LAEX_MULTIDOMAIN_ROUTING_ENABLED=true` is set in the production secret manager.

## Approved topology

- `laexapp.com`: LAEX platform, projects, Business and protected Control Plane.
- `lfprinterapp.com`: LF-PRINTER public storefront on the same Next.js deployment. The commercial name remains **LF-PRINTER**.
- One Business Engine, one Commerce Projection and one PostgreSQL cluster.

## Required production values

Configure in the hosting secret manager; never commit values: pooled `BUSINESS_DATABASE_URL`, direct `BUSINESS_DATABASE_DIRECT_URL` for operations, `BUSINESS_SESSION_SECRET`, `LAEX_CONTROL_PLANE_PASSWORD`, `LAEX_CONTROL_PLANE_SECRET`, `COMMERCE_REFERENCE_COMPANY_SLUG`, both public origins, routing/indexing flags and Canva secrets. Register the exact production Canva callback before changing `CANVA_REDIRECT_URI`.

## DNS/TLS gate

1. Attach apex and `www` variants of both domains to the same deployment.
2. Validate ownership and automatic certificate issuance.
3. Enforce HTTPS; defer HSTS preload until every intended subdomain is HTTPS-only.
4. Verify routing while indexing and legacy redirects remain disabled.
5. Confirm that `lfprinterapp.com` resolves `/`, `/productos/<slug>` and `/seguimiento`, while Business, Control Plane, laboratory and administrative APIs return 404.

## Smoke tests

- LAEX: `/`, `/proyectos`, `/proyectos/onemillionminers`, `/business/<company>`.
- LF-PRINTER: `/`, `/productos/<slug>`, `/seguimiento`.
- On LF host, protected platform, Business, laboratory and Control Plane routes return 404.
- Product → cart → reservation → WhatsApp does not duplicate an order.
- `/api/health` reports PostgreSQL healthy without exposing credentials.
- Canva authorization/callback works after registering the new redirect URI.

## Backup and recovery gate

1. Run `npm run business:backup:scheduled` against production PostgreSQL.
2. Store encrypted backups outside the application filesystem with retention.
3. Run `npm run business:restore-test -- <backup>` in an isolated recovery database.
4. Record RPO/RTO, checksum, operator and restore result. Never restore over production during a test.

## Rollback

Set `LAEX_MULTIDOMAIN_ROUTING_ENABLED=false` and redeploy. Keep indexing and legacy redirect flags disabled until final acceptance.
