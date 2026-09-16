<!-- ───────────────────────────────
  Template:     Feature Spec
  Template-ID:  feature-spec
  Generates:    features/<KEY>/spec/feature-spec.md
  Description:  Per-feature capture — WHAT+WHY, scope, acceptance, success/guardrail metrics, contracts delta, requirements state.
  Library ver:  0.2.2
  Last updated: 2026-06-30
─────────────────────────────── -->

# Feature Spec — <feature title>

> Start here → repo root [`AGENTS.md`](../../../AGENTS.md) (agent entry) · router [`SPEC_INDEX.md`](../../../ai-docs/SPEC_INDEX.md) · system [`ARCHITECTURE.md`](../../../ai-docs/ARCHITECTURE.md). Then this spec → design [`feature-design.md`](../design/feature-design.md) → test plan [`test-strategy.md`](../test-strategy.md). (Links relative to `features/<KEY>/spec/`; the root may be a workspace-level `AGENTS.md`.)
> Context-efficiency: link to canonical docs — don't duplicate them; capture product intent here, the design lives in feature-design.

<!--
  Per-feature spec (instantiated during Capture and refined during Discovery). Captures PRODUCT intent (WHAT+WHY) —
  no architecture (that's the Feature Design). Headings are flat; sections preceded by `<!-- Include if:
  ... -->` are kept only when the change class or the stated condition fires.
  Where a universal section doesn't apply, write the heading + "N/A — <reason>" so Spec State shows nothing
  was skipped by accident. Each section comment gives Capture / Avoid / Example.
-->

## Metadata
<!-- Capture: identity + status + change class + provenance. Avoid: leaving change class blank (it gates the
     conditional sections). Example: "Change class: contract-affecting + perf-critical." -->
| Field | Value |
|---|---|
| Feature / ticket key | <KEY> |
| Title | <title> |
| Status | draft / groomed / architected / tasked / implementation-ready |
| Change class | <routine / security / contract-affecting / perf-critical / persistence / ui> — from questionnaire |
| created_by / approved_by / date | <provenance> |
| Generated from | `feature-spec` @ SDLC template library `0.2.2` |

## Problem & Goal (WHAT + WHY)
<!-- Capture: the user-language WHAT and the problem/business WHY. Avoid: stating a solution as the problem, or
     omitting WHY. Example: "What: let operators perform `<bulk operation>`. Why: current one-by-one workflow is too slow during incidents." -->
**What:** <user-language statement of what's being built>
**Why:** <the problem it solves / business goal — required>

## Stakeholders & Open Questions
<!-- Capture: who must be consulted/sign off, and every blocking open question WITH an owner. Avoid: an open
     question with no owner (it gets silently dropped). Example: "Q-1 retention window? owner: @legal; blocks: schema." -->
| Stakeholder / role | Interest in this feature | Sign-off needed? |
|---|---|---|
| <role> | <why they care> | yes / no |

**Open questions:**
- **Q-1 <question>** — owner: <who> — blocks: <what it gates> — status: open / answered

## Scope
<!-- Capture: in-scope + out-of-scope (non-empty!) + open product decisions. Avoid: an empty out-of-scope (the
     #1 cause of scope creep). Example: "Out: no API change; no migration of historical data." -->
**In scope:** <bullets>
**Out of scope:** <bullets — MUST NOT be empty>
**Open decisions:** <unresolved PM/arch points, or "none">

## Requirements
<!-- Capture: numbered requirements, each with a stable ID, rationale, acceptance, and STATE (Draft → Agreed →
     Implemented → Verified / Dropped). Avoid: requirements with no ID (tasks/tests can't trace to them).
     Example: "R-1 | process up to <limit> items | operational speed | returns per-item result | Agreed." -->
| Req ID | Requirement (WHAT) | Rationale (WHY) | Acceptance (how proven) | State |
|---|---|---|---|---|
| R-1 | <statement> | <why> | <observable/testable condition> | Draft / Agreed / Implemented / Verified |

## Acceptance Criteria
<!-- Capture: the observable, testable conditions that close the feature, referencing Req IDs. Avoid: subjective
     criteria ("works well"). Example: "Processing <limit> items returns in <latency bound> and emits one event each (R-1)." -->
- <observable, testable condition> (R-<n>)

## Success & Guardrail Metrics
<!-- Capture: success metrics (intended improvement) AND guardrail metrics (must-not-regress bounds). Avoid:
     only success metrics — guardrails are what tell an agent what it may NOT break. Example: "success: workflow
     time ↓80%; guardrail: existing error rate stays below the agreed bound." -->
| Metric | Type (success / guardrail) | Baseline | Target / bound | How measured |
|---|---|---|---|---|
| <metric> | success / guardrail | <value> | <value> | <source / dashboard> |

## Prior-Work Register
<!-- Capture: existing code/features/specs related to this change + whether to reuse/extend/supersede. Avoid:
     reinventing an existing capability. Example: "<existing-capability>/ | already supports related operation | extend." -->
| Existing artifact (path / feature / spec) | How it relates | Reuse / extend / supersede |
|---|---|---|
| `<path or feature>` | <relationship> | reuse / extend / supersede |

## Contracts Delta
<!-- Ownership: this section captures only the product-level contract DELTA. Full interface schema lives
     in ../design/contracts/ and the native schema/API source when one exists. The owning module spec
     summarizes the stable surface, and root ai-docs/CONTRACTS.md indexes it; neither is a full schema dump. -->
<!-- Capture: Provides/Requires as a DELTA (ADDED/MODIFIED/REMOVED) vs the module's current baseline. Avoid:
     restating the whole surface. Include the schema/detail source when known. Example:
     "Provides: ADDED POST /<resource>:<operation>; schema openapi.yaml#/paths/... ." -->
**Provides:** ADDED/MODIFIED/REMOVED <interface / event / endpoint + guarantees>
**Requires:** ADDED/MODIFIED/REMOVED <dependency + availability/fallback>

## Impacted Modules / Repos
<!-- Capture: each module/repo touched + the impact + its manifest coverage state. Avoid: a vague "various".
     Example: "`<module>/` | adds `<operation>` surface | manifest state." -->
| Module / repo | Impact | Manifest coverage state |
|---|---|---|
| `<module>` | <one line> | <from `.sdd/manifest.json`> |

<!-- ===== Conditional sections — keep a section only when its Include-if condition holds ===== -->

<!-- Include if: the feature is non-trivial or technically uncertain — capture feasibility before committing [condition-id: feature.feature_nontrivial] -->
## Feasibility & Risks
<!-- Capture: can it be built as scoped (constraints/unknowns), spikes needed, and the risk table. Avoid:
     committing with an unexamined unknown. Example: "Spike: confirm `<operation>` can process <limit> items within the target boundary." -->
- **Feasibility:** <can it be built as scoped? known constraints / unknowns>
- **Spikes needed:** <investigations to de-risk, or "none">
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| <risk> | low/med/high | low/med/high | <mitigation> |

<!-- Include if: the feature interacts with other features/states (toggles, modes, concurrent flows) [condition-id: feature.feature_interactions] -->
## Interaction / Scenario Matrix
<!-- Capture: the condition/state combinations the feature must behave correctly across + expected outcome +
     coverage. Avoid: only the happy combination. Example: "item already in target state × repeated operation → no-op, no error." -->
| Scenario / condition combination | Expected behavior | Covered by (Req / test) |
|---|---|---|
| <condition × state> | <expected> | R-<n> / <test> |

<!-- Include if: the change touches data shapes / required fields [condition-id: feature.touches_data_shapes] -->
## Product-Requested Data / Fields
<!-- Capture: each new/changed field + its meaning/requirement. Avoid: a field with no stated purpose. -->
| Field | Meaning / requirement |
|---|---|

<!-- Include if: backward-compat / coexistence / rollout is in scope [condition-id: feature.backward_compat] -->
## Migration Expectations
<!-- Capture: the cutover/coexistence rule. Avoid: a breaking cutover with no coexistence window. Example:
     "old + new paths coexist for one release; flag default OFF." For public-surface changes, this is the
     product-level consumer transition expectation; exact contract details live in design/contracts/. -->
- <rule / cutover expectation>

<!-- Include if: the change is perf-critical [condition-id: feature.perf_critical] -->
## Scale & Performance
<!-- Ownership: product-level performance requirement only. The technical scale design and capacity
     approach live in feature-design.md. -->
<!-- Capture: the throughput/latency requirement. Avoid: numbers copied from another feature. Example:
     "bulk op: 500 users < 5s p99." -->
| Metric | Requirement |
|---|---|
| Throughput / latency p90/p99 | <value> |

<!-- Include if: the change touches a security or compliance surface [condition-id: feature.security_compliance] -->
## Compliance & Security
<!-- Ownership: product/security obligations only. The technical authz/RBAC and trust-boundary design
     lives in feature-design.md; standing posture lives in SECURITY.md. -->
<!-- Capture: the validation the change needs (pen-test/SAST/PII review). Avoid: skipping review on an authz
     change. Example: "authorization review — `<operation>` must check privileged scope per target boundary." -->
- <validation needed: pen-test / SAST / DAST / PII review …>

<!-- Include if: the feature is flagged or needs staged rollout [condition-id: feature.needs_rollout] -->
## Rollout & Flags
<!-- Ownership: product rollout expectation only. Toggle mechanics and rollout interlock live in
     feature-design.md. -->
<!-- Capture: each flag, its purpose, safe default, new/existing. Avoid: a flag defaulting ON before rollout.
     Example: "<operationFlag> | gate new endpoint | OFF | new." -->
| Flag | Purpose | Default | New/Existing |
|---|---|---|---|

<!-- Include if: serviceability matters — new logs/metrics/alerts [condition-id: feature.serviceability] -->
## Serviceability
<!-- Capture: the logs/metrics/dashboards/alerts to add. Avoid: shipping with no signal for the new path.
     Example: "metric users_bulk_disabled_total; alert on error-rate spike." -->
- Logs / metrics / dashboards / alerts to add.

<!-- Include if: documentation is part of the release contract [condition-id: feature.doc_obligations] -->
## Documentation Obligations
<!-- Capture: the docs that must ship with the feature. Avoid: an API change with no doc update. Example:
     "update the admin help guide + the public API reference." -->
- <help guide / API docs / privacy data sheet …>

<!-- Include if: the feature changes a user-visible screen/flow [condition-id: feature.changes_ui] -->
## UI Flow & Design
<!-- Ownership: user-visible requirement only. Detailed UX and backing interface mapping live in
     feature-design.md. -->
<!-- Capture: the user-visible flow + Figma link + whether it changes an existing flow. Avoid: a UI change with
     no design reference. Example: "adds a bulk-select bar to the users table; Figma <link>." -->
- User-visible flow (screens/states); **Figma:** <link>. Does this change an existing flow? <y/n>

<!-- Include if: the feature changes a network/HTTP API [condition-id: feature.changes_api] -->
## API / Event Contract
<!-- Ownership: exact delta and links only. Full schema lives in ../design/contracts/. Stable catalog
     lives in ai-docs/CONTRACTS.md as an index/pointer. Native schema files such as OpenAPI/AsyncAPI
     `.yaml`, `.proto`, `.graphql`, JSON Schema, or SDK API reports are the exact machine-readable source. -->
<!-- Capture: the exact interface contract(s) + link to the per-interface contract doc + whether dev-portal
     review is needed. Avoid: inventing a route shape or pasting full schemas. Example:
     "POST /<resource>:<operation> -> contracts/<operation>.md; schema openapi.yaml#/paths/... ." -->
- Exact interface contract(s); link to `contracts/*.md` and schema/API source. API registry/dev-portal review needed? <y/n>

<!-- Include if: the feature publishes or consumes events [condition-id: feature.changes_events] -->
## Event Contract
<!-- Capture: published/consumed event deltas + schema/ordering effects. Avoid: changing a payload silently.
     Example: "UserDisabled gains `reason`; backward-compatible additive field." -->
- Published/consumed event deltas; payload schema source; ordering/delivery guarantees affected?

<!-- Include if: the feature changes a published package's public surface [condition-id: feature.changes_public_api] -->
## Public API & Semver Impact
<!-- Capture: the exported symbols changed + the semver impact + API detail source. Avoid: a breaking export in
     a minor bump or inventing custom YAML for SDK APIs. Example: "adds optional arg -> minor; API report
     docs/api-report.md." -->
- Exported symbols/types changed; semver impact (major/minor/patch); API detail source?

<!-- Include if: this is a monorepo and the change spans packages [condition-id: feature.cross_package] -->
## Cross-Package Impact
<!-- Capture: which packages change + inter-package contract effects. Avoid: a cross-package change with no
     version-sync note. -->
- Which packages change; inter-package contract effects.

## Spec State
<!-- Capture: mark each section complete/partial/pending/N-A so capture can stop and resume. Avoid: leaving it
     stale vs the sections above. Example: "Requirements: partial; Metrics: pending." -->
| Section | State (complete / partial / pending / N/A) |
|---|---|
| Problem & Goal | |
| Stakeholders & Open Questions | |
| Scope | |
| Requirements | |
| Acceptance Criteria | |
| Success & Guardrail Metrics | |
| Prior-Work Register | |
| Contracts Delta | |
| Impacted Modules | |
| Conditional sections (as triggered) | |

## Change Log
<!-- Capture: dated material changes — who/what/why. Version control retains detailed file changes. Avoid:
     rewriting history instead of appending. Example: "2026-06-18 | scope cut: drop CSV import | @pm | de-risk v1." -->
| Date | Change | By | Why |
|---|---|---|---|
| <YYYY-MM-DD> | <what changed> | <who> | <rationale> |

## References
- Feature design: `../design/feature-design.md` · decomposition: `../tasks/`
- Repo architecture: `../../../ai-docs/ARCHITECTURE.md` · module docs: manifest-routed, source-local as `<module-path>/ai-docs/<module-name>-spec.md` by default
- Test plan: `../test-strategy.md` · intake: `.generated/sdd/features/<KEY>/run-records/intake-questionnaire.md`
