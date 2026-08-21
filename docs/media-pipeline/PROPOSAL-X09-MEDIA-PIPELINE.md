# LAEX Media Pipeline proposal

Date: 2026-08-04. Status: proposal only; no paid plan or credential added.

## Recommendation

Start with a provider-neutral LAEX asset registry plus Photoroom Basic for the
first production pilot. Use Cloudinary Free only for transformation/delivery
experiments, not as the sole source of truth. Move to Photoroom Plus only when
approved premium shadows, relighting, and backgrounds are needed at scale.

## Provider comparison

| Provider | Current entry price | Limits/use | Quality and fit | Integration | Privacy/licensing note |
| --- | ---: | --- | --- | --- | --- |
| Photoroom Basic API | USD 20/month for 1,000 images; USD 0.02/image | Remove background, crop, resize; 10 clean trial calls | Strong product cutouts | Easy REST API | Send only approved product photos; retain originals in LAEX storage |
| Photoroom Plus API | USD 100/month for 1,000 images; USD 0.10/image | Backgrounds, shadows, relighting and positioning | Best initial all-in-one product workflow | Easy/medium REST API | Generated scenes require human product-fidelity review |
| Cloudinary Free | USD 0; 25 monthly credits | Upload, revision tracking, transformations and CDN; 1 credit = 1,000 transformations or 1 GB storage | Excellent delivery/DAM layer | Easy Next.js integration | Do not make it the only archive; configure access and retention |
| Cloudinary Plus | USD 99 monthly or USD 89/month annually; 225 credits | Own-S3 backup, roles, access lists, transformations | Strong multi-project delivery | Medium | Background-removal add-on is being deprecated for new accounts; use only the newer transformation after a pricing test |
| Adobe Firefly Services | Enterprise/provisioned pricing; operation-based rate card | Photoshop, Firefly, upscale, compositing and batch APIs | Highest creative-control ceiling | Hard; Admin Console and OAuth server-to-server | Adobe says customer inputs are not used to train foundation Firefly models; outputs remain Customer Content |
| remove.bg | First 50 API calls/month advertised free; paid pricing varies by credit plan | Background removal up to 50 MP | Very good specialist fallback | Very easy REST API | Specialist only; no DAM, rendition registry, or scene governance |

Prices are USD before local taxes and must be rechecked at purchase approval.

## Architecture

1. Upload enters a private `original` store and is never overwritten.
2. Registry creates immutable asset ID, version, SHA-256, project, source URL,
   owner, license, capture date, consent, and review status.
3. A queued job sends the approved original to a configured processor adapter.
4. Processor returns an alpha PNG. Automated checks verify alpha corners,
   subject coverage, dimensions, and perceptual similarity.
5. Local deterministic renditions create WebP desktop/tablet/mobile variants.
6. Optional premium scene and shadow are separate derivatives, never replacements
   for the transparent product master.
7. A human reviewer compares model name, buttons, trays, ports, proportions, and
   labels before publication.
8. Publishing updates the stable asset ID alias atomically. Rollback points to the
   previous approved version; URLs used by components do not change.

Suggested entities: `MediaAsset`, `MediaVersion`, `MediaDerivative`,
`MediaLicense`, `ProcessingJob`, `ReviewDecision`, and `UsageReference`.

Suggested adapters: `StorageProvider`, `BackgroundRemovalProvider`,
`ImageOptimizationProvider`, `SceneProvider`, and `DeliveryProvider`.

## Product invariants

- AI may remove background, upscale, relight, resize, and create a separate scene.
- The official transparent master is never generatively redrawn.
- Automated perceptual comparison is advisory; publication requires human review.
- A generated scene is labelled as a composition, not an official photograph.
- Any changed model, button, tray, display, port, logo, label, or proportion fails.

## Logos

Never send a logo to generative AI or automatic vector tracing for final use.
Open the CDR master in a licensed compatible CorelDRAW version, verify fonts and
the official palette, convert text to curves only in an export copy, and export:

- `brand/logo-primary.svg`
- `brand/logo-light.svg`
- `brand/logo-dark.svg`
- `brand/logo-1024.png` with alpha
- `brand/logo-1024.webp`
- `brand/favicon.svg`, `favicon.ico`, and 16/32/48/180/192/512 PNG sizes

A designer should inspect curves, spacing, overprint, embedded color profiles,
and light/dark contrast. Budget guideline: USD 50-200 for a simple verified export
package; USD 200-600 if the master needs font recovery, curve repair, or a formal
mini brand guide. Obtain quotes before authorization.

## WF-4830 local proof

Input: existing 300 x 200 official-reference catalog image. The original remains
unchanged. A deterministic border-key extraction produced:

- `wf-4830-alpha-test.png`
- `wf-4830-desktop-test.webp`
- `wf-4830-tablet-test.webp`
- `wf-4830-mobile-test.webp`

Validation: RGBA output, transparent corner, 34,409 fully transparent pixels and
23,422 partially transparent edge pixels out of 60,000. The source is too small
for production or genuine responsive resolution, so this proves workflow and
alpha handling only. It must not be promoted as a production master.

## Approval gates

Phase 1: approve provider and monthly ceiling. Phase 2: create vendor account and
secret storage. Phase 3: process 10 representative assets and compare fidelity.
Phase 4: approve production integration. No credential belongs in Git or browser
code, and no external processing occurs before explicit approval.
