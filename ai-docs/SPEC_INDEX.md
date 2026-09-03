<!-- ───────────────────────────────
  Template:     Spec Index
  Template-ID:  spec-index
  Generates:    ai-docs/SPEC_INDEX.md
  Description:  Router — which docs to load for which task and the canonical module registry.
  Library ver:  0.2.2
  Last updated: 2026-07-31
─────────────────────────────── -->

# Spec Index — react-widgets

> Start with root [`AGENTS.md`](../AGENTS.md). This is the human router; `.sdd/manifest.json` is the machine source of truth.

## Module Registry

| Module | Responsibility | Manifest coverage state | Start here |
|---|---|---|---|
| Space and messaging | Space, message, files, roster, activity composition, and host events. | Partial (94%) | `modules/space-messaging-spec.md` |
| Recents | Space-list loading/filtering, realtime updates, selection/call/profile host events. | Partial (95%) | `modules/recents-spec.md` |
| Meetings | Destination lookup, create/join/media/leave lifecycle, and meeting UI. | Partial (92%) | `modules/meetings-spec.md` |
| Calling widgets | Call history, number pad, speed dial, voicemail, typed adapters/hooks. | Partial (91%) | `modules/calling-spec.md` |
| Shared UI components | Public/private presentational components and UI utilities. | Partial (93%) | `modules/shared-ui-components-spec.md` |
| Redux and state management | Immutable state, SDK thunks, reducers, selectors, metrics, fixtures. | Partial (94%) | `modules/state-management-spec.md` |
| Containers and HOCs | State/SDK-connected UI, downloads, notifications, presence, scrolling, Mercury. | Partial (92%) | `modules/containers-hooks-spec.md` |
| Widget runtime/auth/demos | Auth/SDK setup, browser/data APIs, teardown, sign-in, demos, samples. | Partial (93%) | `modules/widget-runtime-auth-spec.md` |
| Build and release tooling | Build/transpile/bundle/SRI/serve/publish/deploy/release workflows. | Partial (95%) | `modules/build-release-tooling-spec.md` |
| Test automation | Jest, journeys, smoke/TAP/integration/accessibility, CI test reporting. | Partial (96%) | `modules/test-automation-spec.md` |

All scores were assessed 2026-07-22 from package entrypoints, events/commands, implementation flows, tests, and reconciled sources. Independent spec-validator is **not-run** after the 0.2.2 upgrade; committed reconcile/conformance summary is in [`SDD_BOOTSTRAP_EVIDENCE.md`](SDD_BOOTSTRAP_EVIDENCE.md). Status remains Partial because documented weak-evidence gaps and the five-PR promotion-history gate remain.

## Task Routing

| If the task is… | Load |
|---|---|
| Understanding the system | `ARCHITECTURE.md` |
| Changing a package/widget behavior | the owning `modules/*-spec.md` plus `CONTRACTS.md` |
| Changing host/browser/data API or auth | `modules/widget-runtime-auth-spec.md` + `SECURITY.md` |
| Changing exported events | owning widget spec + `CONTRACTS.md` + `SERVICE_STATE.md` |
| Changing build/release/CDN behavior | `modules/build-release-tooling-spec.md` + `SECURITY.md` |
| Changing tests or CI verification | `TEST_INDEX.md` + `modules/test-automation-spec.md` + `REVIEW_CHECKLIST.md` |
| Running or changing tests | `TEST_INDEX.md` + the affected module spec |
| Updating docs after code | affected module specs, standing indexes, manifest, and source-fidelity policy if protected docs are involved |

## Incident History

No tracked incident/RCA index exists in this repository. Do not infer incidents from generic warnings; add reference rows only when an authoritative ticket/RCA is supplied.

## Phase-Based Loading Protocol

| Phase | Load |
|---|---|
| Orient | `AGENTS.md` + this file |
| Specify | affected module spec, `CONTRACTS.md`, and focused standing docs |
| Build | affected spec + `patterns/`/`rules/` + real source/tests |
| Verify | `REVIEW_CHECKLIST.md`, affected specs, manifest, and independent validation report |

## Spec Registry

| Doc | Location | Purpose |
|---|---|---|
| Architecture | `ARCHITECTURE.md` | system/package shape, state, interactions, host and release boundaries |
| Patterns | `patterns/` | code-grounded correct/incorrect conventions |
| Rules | `RULES.md` + `rules/` | enforceable repository constraints |
| Glossary | `GLOSSARY.md` | domain language and compatibility names |
| Security | `SECURITY.md` | trust boundaries, credentials, rendered data, release secrets |
| Contracts | `CONTRACTS.md` | package, event, browser/data API, and command catalog |
| Service state | `SERVICE_STATE.md` | living events/stores/dependencies/flags registry |
| Test index | `TEST_INDEX.md` | test tiers, canonical commands, locations, frameworks, dependencies, and quality gates |
| Getting started | `GETTING_STARTED.md` | install/build/run/test loop |
| Decisions | `adr/` | durable architecture decisions |
| Review catalog | `REVIEW_CHECKLIST.md` | merge gate selection and finding format |

---

Provenance: generated_by `codex-desktop`; approved_by `pending PR approval`; updated_at `2026-09-03`.
