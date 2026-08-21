# LF-PRINTER official identity assets

## Source of truth

The untouched packages remain in `assets/lf-printer/official-source`.
Their expanded CorelDRAW 2019 package contents live in
`assets/lf-printer/official-archive` and must not be edited by the web app.

The packages identify LH-Films as creator and LF-PRINTER as last author. They
contain vector CorelDRAW document data, embedded fonts, sRGB/CMYK profiles,
document palettes, and low-resolution previews. They do not contain approved
transparent web exports of the logo or product photography.

## Official palette registered from docPalette.xml

| Role | Value |
| --- | --- |
| Ink | `#151314` |
| Cyan | `#00BBFC` |
| Blue | `#2076B9` |
| Magenta | `#FC0A7C` |
| Yellow | `#FFBF00` |
| Green | `#3CB24E` |
| Orange | `#F49421` |
| White | `#FFFFFF` |

The application registry is `modules/lf-printer/infrastructure/brand.ts`.

## Required production exports

| Asset | Required file | Minimum | Ratio/view |
| --- | --- | --- | --- |
| Primary logo | `lf-printer-logo-primary.svg` | Vector | Horizontal, transparent |
| Compact mark | `lf-printer-mark.svg` | Vector | 1:1, transparent |
| Product hero | `{slug}-hero.webp` | 1800 x 1400 | Front 3/4, transparent |
| Product side | `{slug}-side.webp` | 1600 x 1200 | Lateral, transparent |
| Product rear | `{slug}-rear.webp` | 1600 x 1200 | Rear, transparent |
| Technical view | `{slug}-technical.webp` | 1800 x 1400 | Annotatable, transparent |
| Demo video | `{slug}-demo.mp4` | 1920 x 1080 | H.264, 16:9 |
| 360 sequence | `{slug}-360-{001..036}.webp` | 1200 x 1200 | 36 frames, 1:1 |
| Future 3D | `{slug}.glb` | Optimized below 15 MB | Real scale, PBR materials |
| Manual | `{slug}-manual.pdf` | Searchable PDF | Official document |
| Datasheet | `{slug}-datasheet.pdf` | Searchable PDF | Official document |

Missing media must render as `Contenido visual en preparacion`; a different
model must never be substituted. Media paths belong in the product experience
registry, not in page layout components.

## Current integration decision

The two embedded thumbnails were copied to the public official directory only
as documented previews. They are not used as production logos because their
resolution and crop are insufficient. The existing application logo remains in
place until the CEO supplies or approves an SVG/transparent PNG export from the
CorelDRAW master.
