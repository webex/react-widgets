<!-- ───────────────────────────────
  Template:     Service State (living)
  Template-ID:  service-state
  Generates:    ai-docs/SERVICE_STATE.md
  Description:  Living as-built registry — current endpoints/events/stores/deps/limits/metrics/flags; read first to avoid duplicates.
  Library ver:  0.2.2
  Last updated: 2026-06-30
─────────────────────────────── -->

# Service State (living) — react-widgets

> Start with root [`AGENTS.md`](../AGENTS.md), [`SPEC_INDEX.md`](SPEC_INDEX.md), and [`ARCHITECTURE.md`](ARCHITECTURE.md). Despite the template name, this is the library's current as-built surface registry.

## Current Events

| Event / topic | Direction | Producer/consumer | Payload reference |
|---|---|---|---|
| `messages:created` | publish to host | Space and Recents | `packages/node_modules/@webex/widget-space/src/events.js`, `packages/node_modules/@webex/widget-recents/src/events.js` |
| `rooms:unread`, `rooms:read` | publish to host | Space and Recents | `packages/node_modules/@webex/widget-space/src/events.js`, `packages/node_modules/@webex/widget-recents/src/events.js` |
| `rooms:selected` | publish to host | Recents | `packages/node_modules/@webex/widget-recents/src/events.js` |
| `calls:created` | publish to host | Space/Recents legacy calling flow | `packages/node_modules/@webex/widget-space/src/events.js`, `packages/node_modules/@webex/widget-recents/src/events.js`, `packages/node_modules/@webex/widget-meet/src/enhancers/withEventHandler.js` |
| `calls:connected`, `calls:disconnected` | publish to host | Space | `packages/node_modules/@webex/widget-space/src/events.js` |
| `memberships:created`, `memberships:deleted` | publish to host | Recents | `packages/node_modules/@webex/widget-recents/src/events.js` |
| `activity:changed` | publish to host | Space | `packages/node_modules/@webex/widget-space/src/events.js` |
| `add:clicked`, `profile:clicked`, `user_signout:clicked` | publish to host | Recents | `packages/node_modules/@webex/widget-recents/src/events.js` |
| Webex Mercury activities | consume | Redux Mercury/Space/Recents packages | `packages/node_modules/@webex/redux-module-mercury/src/actions.js` |
| meeting `media:ready` | consume | meetings Redux package | `packages/node_modules/@webex/redux-module-meetings/src/actions.js` |

Space declares `calls:memberships:*` constants and legacy Meet declares `memberships:*` constants, but no publisher for either membership set was found in current source. They are intentionally excluded from this current-events registry.

## Data Stores

| Store | Purpose | Owned by this library? |
|---|---|---|
| per-widget Redux store | immutable client resource/status state | yes, in-memory only |
| `window.webex.widgetStore` | mounted browser-widget registry | yes, in-memory only |
| browser `localStorage` focus flags | number-pad focus handoff | yes, temporary keys only |
| Webex service data | conversations, spaces, users, teams, calls, meetings | no; consumed through SDK/services |

## External Dependencies

| Dependency | Used for | Timeout / retry | Circuit breaker / fallback |
|---|---|---|---|
| Webex SDK/services | auth, registration, rooms/conversations, people, teams, meetings, realtime, search, flags, metrics | SDK/plugin-owned; widget thunks expose promise state | loading/error UI; optional features may log and continue |
| Browser media/notification APIs | calls, audio/video, notifications | browser/SDK-owned | permission or capability failures surface through UI/status |
| npm registry | published package delivery | npm tooling | build/publish fails; no silent fallback |
| AWS S3/CloudFront | CDN widget artifacts | CircleCI/orb tooling | deployment job fails; archives remain versioned |
| Sauce Labs/Selenium | browser journeys | WebdriverIO retries connections up to three times | local Selenium when Sauce is disabled |

## Feature Flags (current)

| Flag / option | Gates | Current default | Owner | Safe to remove when |
|---|---|---|---|---|
| Recents `basicMode` | REST vs encrypted initial-space loading | `false` | Recents | only after a contract change removes the alternate mode |
| `enableAddButton` | Recents add-space control/event | `false` | Recents | after consumer migration and major-version removal |
| `enableSpaceListFilter` | Recents filter UI | `true` | Recents | after consumer migration and major-version removal |
| `enableUserProfile` / `enableUserProfileMenu` | Recents profile controls/events | `true` / `false` | Recents | after consumer migration and major-version removal |
| Space `spaceActivities` / `composerActions` | activity and composer controls | enabled | Space | after consumer migration and major-version removal |
| SDK feature/flag values | Webex-service-driven behavior | service-defined | Webex services | only with upstream contract approval |

## Maintenance

- Update the relevant row in the same change that changes an export, event, host option, state store, dependency, or feature flag.
- Stable catalog: `CONTRACTS.md`; security posture: `SECURITY.md`; module details: `modules/`.

---

Provenance: generated_by `codex-desktop`; approved_by `pending PR approval`; updated_at `2026-08-07`.
