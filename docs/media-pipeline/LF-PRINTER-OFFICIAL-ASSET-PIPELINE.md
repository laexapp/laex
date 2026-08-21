# LF-PRINTER official asset pipeline

Date: 2026-08-04. External provider status: disabled. No credentials configured.

## Operational flow

1. Place a canonical PNG or WebP in `assets/lf-printer/official-source/printers`.
2. `npm run media:sync` verifies the real internal format and requires at least
   2000 px on the longest side. Insufficient sources become
   `pending-improvement`; the registry records found/required resolution and
   recommends retrying with a better official source. No AI upscaling occurs.
3. The original is archived by SHA-256 without overwriting an earlier version.
4. WebP sources are normalized locally to PNG before background removal. After
   human approval, Sharp creates transparent WebP renditions at 1600, 1200 and
   800 px.
5. The pipeline publishes stable filenames under
   `public/assets/lf-printer/official/printers`.
6. `{id}-hero.webp` is updated as the compatibility alias already consumed by
   the Showroom. No component edit is required.
7. `predev` and `prebuild` execute synchronization automatically. An asset in
   `review-required` remains locked and cannot be published by those commands.

The required IDs are `wf-4830`, `wf-4833`, `wf-4834`, `wf-7820`, `wf-7840`,
`xp-4200`, `xp-4205` and `l3250`. Future IDs are discovered automatically
from the safe `{id}-transparent.png` naming pattern, without changing code.

Generated files for every ID:

- `{id}-transparent.png`
- `{id}-hero.webp`
- `{id}-desktop.webp`
- `{id}-tablet.webp`
- `{id}-mobile.webp`

The machine-readable registry is
`assets/lf-printer/official/media-registry.json` and records checksum,
dimensions, publication time and stable outputs.

## Provider adapter

The provider-neutral LAEX core is in `scripts/media-pipeline`; the original
`scripts/lf-printer-media` entry points remain as compatibility wrappers.
Photoroom is implemented but disabled. It is activated only after approval:

```powershell
npm run media:process
```

Provider results go to `assets/lf-printer/official-review/printers`; they are
not published automatically. After a human confirms model fidelity, approve a
candidate with:

```powershell
npm run media:approve:wf-4830
```

Official PNGs with valid transparency do publish automatically. AI-produced
cutouts retain the mandatory human gate because alpha validation cannot detect
a removed button, tray, port or label.

## Official Epson source priority

1. **Epson Partner Portal / ProFocus**: best commercial source when LF-PRINTER
   is accepted as an authorized reseller. Epson explicitly exposes product
   marketing resources. Portal terms authorize approved partners to download
   and distribute marketing material in support of the Epson relationship,
   while requiring proprietary notices and restricting modifications without
   consent. Request written confirmation that background removal, resizing and
   WebP conversion are permitted for the intended storefront.
2. **Epson Newsroom Media Library**: useful public press library with searchable
   business and retail inkjet categories. It is a discovery source, not an
   automatic blanket license for commercial modification. Record the asset page
   and obtain permission when usage terms are unclear.
3. **Official regional product page**: good for exact model verification and
   source attribution, but downloaded web thumbnails may be too small and page
   terms do not automatically grant editing rights.
4. **Authorized Epson representative/distributor**: request the original media
   kit and written usage scope when a model is missing from the portals.

There is a public Epson Media Library and an authenticated Partner Portal; no
public evidence was found for an unrestricted global "Epson Media Center" that
grants every retailer commercial reuse rights.

## Provider comparison

| Option | Role | Current cost/limit | Strength | Main limitation | Decision |
| --- | --- | --- | --- | --- | --- |
| Epson Partner Portal | Official source | Partner access | Highest authenticity and commercial provenance | Eligibility and contract restrictions | First choice for source files |
| Epson Newsroom Media Library | Official press source | Public browsing | Official imagery and model categories | Press availability and license scope vary | Secondary source, verify rights |
| Photoroom Basic API | Background removal | USD 0.02/image; plans from USD 20/month; 10 clean trial calls | Strong product cutouts, PNG RGBA, resize | Still needs fidelity review | Recommended first processor |
| Photoroom Plus API | Scenes, shadows, relighting | USD 0.10/image; plans from USD 100/month; sandbox results watermarked | Commerce-oriented composition | Generative edits must remain separate derivatives | Later optional stage |
| Cloudinary | DAM, transformation, CDN | Free tier uses 25 monthly credits; paid plans vary | Stable IDs, overwrite/versioning, web delivery | Background-removal-on-upload can overwrite the stored original | Recommended future delivery layer, never sole archive |
| Adobe Photoshop API v2 / Firefly Services | Enterprise creative automation | Contract/rate-card pricing | Advanced masks, color decontamination, PSD workflows, 5 GB files | Higher integration and account complexity | Enterprise option, not initial processor |
| remove.bg | Specialist fallback | Credit pricing; verify at approval | Simple background-removal API | No complete DAM, provenance or review workflow | Quality benchmark/fallback only |

## Recommendation

Use Epson Partner Portal or a documented Epson representative as the source of
truth. Start processing with Photoroom Basic after the 10-call clean pilot is
approved. Keep originals and the registry in LAEX. Add Cloudinary later for DAM
and CDN delivery if the ecosystem volume justifies it. Adobe is better reserved
for complex enterprise creative workflows, not the first LF-PRINTER cutout.

## Primary references checked

- Epson Partner Portal: https://epson.com/epson-partner-portal
- Epson ProFocus terms: https://profocus.epson.com/Account/Terms
- Epson Newsroom Media Library: https://news.epson.com/multimedia
- Photoroom pricing: https://www.photoroom.com/api/pricing
- Photoroom API reference: https://docs.photoroom.com/api-reference-openapi
- Cloudinary upload API: https://cloudinary.com/documentation/image_upload_api_reference
- Cloudinary background removal: https://cloudinary.com/documentation/background_removal
- Adobe Photoshop API v2: https://developer.adobe.com/firefly-services/docs/photoshop/
- Adobe remove background: https://developer.adobe.com/firefly-services/docs/photoshop/guides/remove-background/
