# Community Connect Framework

Community Connect is the reusable social layer for LAEX. It presents project and platform communities with the same glass, glow, border, motion and focus language used throughout LAEX.

## Component

Import `CommunityConnect` and pass a list of `CommunityChannel` objects. The component supports `compact`, `inline` and `panel` variants, plus the actions `open`, `join`, `copy`, `share` and `invite`.

```tsx
<CommunityConnect
  channels={channels}
  variant='panel'
  routingContext='project:omdb:footer'
  actions={['open', 'copy', 'share', 'invite', 'join']}
/>
```

Each channel is platform-neutral. Supported providers currently include WhatsApp, Telegram, Discord, X, Facebook, Instagram, YouTube, TikTok, Reddit, LinkedIn, websites and future providers through `other`.

## Project configuration

`getProjectCommunityChannels(project)` is the visual adapter for existing project information. A channel can be hidden with `enabled: false` without changing the component. Configuration supports future visual metadata through `official`, `status`, `memberCount`, `lastActivity`, `eventLabel` and `live`.

No database or service is required by this layer. A future administration surface can provide the same typed channel array.

## Leader routing

The component reads the visitor leader from `?leader=<id>` and falls back to `?ref=<id>`. Pass a `routing` object with either a leader directory or resolved `leaderLinks`. `resolveCommunityChannels` replaces only providers configured by that leader and keeps official project links as fallback.

```tsx
<CommunityConnect
  channels={channels}
  routing={{
    leaders: [{ id: 'luis', links: { whatsapp: 'https://example.com/luis' } }],
  }}
/>
```

All instances on a page resolve the same visitor parameter automatically. The `data-community-source` attribute identifies `leader` or `official` for future analytics without adding analytics logic now.

## Extension contract

- Reuse the component in news, academy, markets, profiles, dashboards, feeds, events, courses and streams.
- Keep platform configuration outside the component.
- Add provider icons only in the icon registry; the routing and action layers do not change.
- Keep all links serializable so Server Components can safely pass configuration into this interactive Client Component.
- Do not add Firebase, Auth, API or database concerns to this UI framework.

## Current placements

Home hero, project cards, Home closing section, project hero, below project video, after executive summary, after analysis, project footer, Login and Registration.
