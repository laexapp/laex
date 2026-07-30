# LAEX Signal Design System

## Visual premise

LAEX is an intelligence observatory: obsidian space, aurora signals, and precise data instrumentation. The experience should be premium and calm, never a generic SaaS dashboard or an overloaded neon crypto interface.

## Tokens

- Canvas: `#05070D`; deep canvas: `#02040A`.
- Surfaces: `#09111E` and `#0E1A2B`; glass is reserved for overlays and floating instruments.
- Signal cyan (`#37D8EE`) communicates focus, interaction, and verified intelligence.
- Aurora blue and quantum violet are atmospheric/AI accents, not default borders.
- Gold is exceptional emphasis only; emerald, amber, and rose are semantic status colors.

## Typography

Use Geist Sans for all product UI. Display headings are compact and high-impact; body copy is calm and readable. Eyebrows use uppercase, 11px text, 0.3em tracking, and signal cyan.

## Spacing and geometry

Use the 4px spacing scale. Default page gutter is 24px; desktop sections use 96px vertical rhythm. Use 12px radius for small controls, 16px for inputs, 24px for cards, 32px for primary panels, and 40px only for hero-level surfaces.

## Surface hierarchy

1. Canvas — the global obsidian/aurora background.
2. Surface — grouped content with subtle border and panel shadow.
3. Raised surface — high-priority analytical panel.
4. Instrument — inputs, metric cells, badges, and controls.

Do not use cyan borders by default. Use low-contrast neutral borders at rest, then signal cyan on hover, focus, or active state.

## Components

- Primary buttons: signal cyan fill, restrained signal glow, clear focus state.
- Secondary buttons: dark glass with neutral border; signal border only on interaction.
- Cards: one semantic purpose per card; avoid decorative glow unless it conveys hierarchy.
- Status badges: semantic hue must match actual state.
- Inputs: dark instrument surface, 16px radius, visible signal focus ring.
- Navigation: active state uses a precise signal marker; never rely on color alone.

## Motion

Use 160ms for micro-interactions, 240ms for normal controls, and 420ms for large ambient shifts. Prefer opacity, transform, and border changes. Always honor reduced-motion preferences.

## Identity experience

Identity screens use `IdentityShell` as the shared canvas and narrative frame. Form controls must reuse `Input`, `PasswordInput`, `Checkbox`, `Button`, `IdentityDivider`, and `IdentityMessage` from `modules/auth/components`; do not recreate field styles inside Login or Register.

- Inputs include a visible label, semantic autocomplete, neutral rest border, signal focus ring, and an optional validation message.
- Password controls expose a labelled visibility toggle.
- Primary actions provide disabled and loading states; secondary navigation uses `identitySecondaryClass`.
- Status feedback uses `IdentityMessage` with `role="status"`.
- Login and registration retain their own copy and handlers while sharing geometry, surfaces, motion, and accessibility behavior.

## Community Connect

`CommunityConnect` is the presentation framework for project and leader communities. It accepts a list of `{ provider, label, href }` channels and supports `compact`, `inline`, and `panel` placements.

- Supported providers include WhatsApp, Telegram, Discord, Facebook, Instagram, YouTube, TikTok, LinkedIn, X, website, and future generic channels.
- Consumers pass `routingContext` to identify the placement, for example `project:onemillionminers:hero`.
- Future leader routing should be injected through `resolveChannelHref`; the component must not query profiles, Firebase, or URL parameters directly.
- Empty channel lists render nothing. Community placement must remain contextual and never become an interstitial or blocking surface.
