# Glossary — react-widgets

> Start with root [`AGENTS.md`](../AGENTS.md) and [`SPEC_INDEX.md`](SPEC_INDEX.md). Use these code-grounded terms rather than inventing synonyms.

## Domain Terms

| Term | Definition | Authoritative location | Notes / synonyms to avoid |
|---|---|---|---|
| Widget | A self-contained React capability composed with Webex runtime/state integrations and optionally registered for browser/data APIs. | `packages/node_modules/@webex/webex-widget-base/src/index.js` | Not every `react-component-*` package is a widget. |
| Space | The client representation of a Webex room/conversation used by Space and Recents behavior. | `packages/node_modules/@webex/redux-module-spaces/src/reducer.js` | Current public events still use the compatibility resource name `rooms`. |
| Activity | A normalized conversation item such as a message, share, or system activity. | `packages/node_modules/@webex/redux-module-activities/src/reducer.js` | Do not use “message” for every activity type. |
| Destination | A typed widget target identified by email, user ID, space ID, SIP address, or PSTN value where supported. | `packages/node_modules/@webex/widget-space/src/constants.js` | Preserve exact destination strings: `email`, `userId`, `spaceId`, `sip`, `pstn`. |
| Browser global API | `window.webex.widget(element)` and registered `{name}Widget` functions used to mount/remove widgets and receive events. | `packages/node_modules/@webex/webex-widget-base/src/enhancers/withBrowserGlobals.js` | `window.ciscospark` is a compatibility alias, not the preferred name. |
| Data API | Auto-mount behavior driven by a `data-toggle="webex-{name}"` element and other `data-*` options. | `packages/node_modules/@webex/webex-widget-base/src/enhancers/withDataAPI.js` | Do not confuse with Webex REST APIs. |
| Mercury | The Webex SDK realtime channel used for conversation/activity events. | `packages/node_modules/@webex/redux-module-mercury/src/actions.js` | Not a queue owned by this repository. |
| SDK instance | A supplied or constructed authenticated Webex JavaScript SDK object used by thunks and adapters. | `packages/node_modules/@webex/react-redux-spark/src/sdk.js` | Older code often names the variable `sparkInstance`; it still represents Webex SDK state. |
| Basic mode | Recents loading through Webex REST rather than encrypted conversation flows. | `packages/node_modules/@webex/widget-recents/src/enhancers/setup.js` | The source docs explicitly warn that this removes end-to-end encryption. |
| Journey test | A WebdriverIO browser integration scenario covering mounted widgets against local/TAP/integration environments. | `test/journeys/`, `wdio.conf.js` | Not a Jest unit test. |
| SRI manifest | Versioned CDN file catalog containing integrity hashes and signatures for distributable files. | `scripts/utils/sri.js` | Not `.sdd/manifest.json`. |

## Abbreviations & Acronyms

| Abbreviation | Expansion | Meaning in this repo |
|---|---|---|
| SDK | Software Development Kit | Webex JavaScript SDK and calling component adapters consumed by widgets. |
| SRI | Subresource Integrity | Hash/signature metadata generated for CDN widget artifacts. |
| HOC | Higher-Order Component | A React wrapper that injects state, SDK behavior, scrolling, or host integration. |
| TAP | Test Against Production | Journey suites that use deployed CDN artifacts rather than local bundles. |
| PSTN | Public Switched Telephone Network | A supported calling destination type in Space/Meet/Meetings/number-pad flows. |
| SIP | Session Initiation Protocol | A string destination type passed to SDK calling/meeting behavior; this repo does not implement SIP framing. |

## Context-Specific Meanings

| Term | Context / module | Meaning here |
|---|---|---|
| `store` | Redux packages | The in-memory Redux state tree. |
| `store` | browser runtime | `window.webex.widgetStore`, a registry of mounted widget objects. |
| `event` | widget contract | A host callback/DOM/ampersand notification such as `messages:created`. |
| `event` | SDK/realtime flow | A Webex SDK/Mercury notification consumed internally and sometimes translated to a host event. |
| `meeting` / `call` | Meetings packages | SDK meeting object plus Redux IDs/media readiness. |
| `meeting` / `call` | legacy media packages | Legacy media/call records and events used by Space/Recents/Meet. |

## Deprecated / Renamed Terms

| Old term | Current term | Why renamed | Still appears in |
|---|---|---|---|
| Cisco Spark | Webex | Product/package namespace migration. | Protected `@ciscospark/*` compatibility READMEs and legacy identifiers. |
| `@ciscospark/*` | `@webex/*` | npm package namespace migration. | `packages/node_modules/@ciscospark/*/README.md`, Jest compatibility mappings. |
| `sparkInstance` / `sparkState` | Webex SDK instance/state | Historical source naming retained for compatibility. | legacy widget, Redux, and container code. |
| rooms | spaces | Current product terminology; event contract strings remain `rooms:*`. | event constants and payload fields. |

## Maintenance

- Add a term in the same change that introduces a public entity, event, state, destination, or build artifact.
- Cross-reference public surfaces in `CONTRACTS.md` and client state ownership in `ARCHITECTURE.md`.

---

Provenance: generated_by `codex-desktop`; approved_by `repository owner`; updated_at `2026-07-22`.
