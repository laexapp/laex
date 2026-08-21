# MISSION X-09G - Photoroom controlled pilot

Status: integration ready, provider disabled, no credential installed, no image sent.

## Architecture evolution

The existing LF-PRINTER pipeline remains compatible. Its implementation now
delegates to the provider-neutral LAEX core in `scripts/media-pipeline`.
Project-specific paths, required assets, renditions and external-processing
allowlists live in `scripts/media-pipeline/projects`.

Current compatibility commands:

- `npm run media:sync`
- `npm run media:process`
- `laex-start.cmd`
- `npm run build`

The original entry point `scripts/lf-printer-media/pipeline.mjs` remains valid.

## Credential location

After CEO approval, copy `.env.example` to `.env.local` at the repository root
and set:

```dotenv
LAEX_MEDIA_PROVIDER=photoroom
PHOTOROOM_API_KEY=the-approved-secret
```

`.env.local` is ignored by Git. Never place the key in source code, frontend
variables, screenshots, documentation or commits.

## Controlled WF-4830 test

1. Put only the official pilot input at either
   `assets/lf-printer/official-source/printers/wf-4830-transparent.png` or
   `assets/lf-printer/official-source/printers/wf-4830-transparent.webp`.
2. Confirm `.env.local` contains the approved values.
3. Run `npm run media:process`.
4. The command is hard-scoped to `lf-printer/wf-4830`. The core rejects another
   ID before opening or sending an image.
5. Photoroom returns an RGBA PNG to:
   `assets/lf-printer/official-review/printers/wf-4830-transparent.png`.
6. Automatic validation checks PNG encoding, real alpha, fully transparent
   pixels, transparent corners and a minimum 2000 px longest side.
7. No AI-produced candidate is published by this command.

PNG and WebP masters are accepted. Their original bytes and real internal format
are archived by SHA-256. WebP is converted losslessly to the normalized PNG sent
to the provider. A source below 2000 px on its longest side is recorded as
`pending-improvement`, including found and required resolution plus the explicit
recommendation to retry with a better official source. It is never AI-upscaled.

## Human approval and publication

Compare the candidate against the official source: exact model, proportions,
screen, buttons, trays, ports, paper path, marks and edges. If approved, run:

```powershell
npm run media:approve:wf-4830
```

Approval archives the prior source by SHA-256, promotes the reviewed PNG,
re-runs validation, creates transparent WebP desktop/tablet/mobile renditions
and updates the stable `wf-4830-hero.webp` alias consumed by the Showroom.

Do not process another model until `externalTrialAssetIds` is expanded through a
new CEO and Architect authorization.
