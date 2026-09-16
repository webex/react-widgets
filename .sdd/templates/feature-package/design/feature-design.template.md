<!-- ───────────────────────────────
  Template:     Feature Design
  Template-ID:  feature-design
  Generates:    features/<KEY>/design/feature-design.md
  Description:  Discovery design container — feature architecture, contracts, scale, rollout, coverage summary, sign-off.
  Library ver:  0.2.2
  Last updated: 2026-06-30
─────────────────────────────── -->

# Feature Design — <feature title>

> Start here → repo root [`AGENTS.md`](../../../AGENTS.md) (agent entry) · router [`SPEC_INDEX.md`](../../../ai-docs/SPEC_INDEX.md) · system [`ARCHITECTURE.md`](../../../ai-docs/ARCHITECTURE.md). This design serves the spec [`feature-spec.md`](../spec/feature-spec.md); it feeds the decomposition [`../tasks/`](../tasks/) and test plan [`test-strategy.md`](../test-strategy.md). (Links relative to this file.)
> Context-efficiency: link to canonical docs — don't duplicate them; reference the repo ARCHITECTURE/CONTRACTS rather than restating them.
> Keep lean: this document owns the technical solution for this feature; link to standing docs and
> per-interface contracts instead of copying their full content.

<!--
  The DISCOVERY design-document container — the home for a feature's architecture and the plan to build it.
  Its **Feature Architecture** section is the core. Save as features/<KEY>/design/feature-design.md. Headings
  are flat; sections preceded by `<!-- Include if: ... -->` are kept only when the condition holds. Fill every
  <...> from REAL code/evidence (file path). Where a section doesn't apply, write the heading + "N/A —
  <reason>" so the Design Coverage Summary shows nothing was skipped. Each section comment gives Capture /
  Avoid / Example.
-->

## Metadata
<!-- Capture: identity + link to the spec it serves + status + change class. Avoid: a design with no link to the
     WHAT/WHY it implements. Example: "Status: soft-committed; Change class: contract-affecting." -->
| Field | Value |
|---|---|
| Feature / ticket key | <KEY> |
| Title | <title> |
| Feature Spec | `../spec/feature-spec.md` (WHAT + WHY this design serves) |
| Status | discovery / soft-committed / tasked / implementation-ready |
| Change class | <routine / security / contract-affecting / perf-critical / persistence / ui> |
| created_by / approved_by / date | <provenance> |
| Generated from | `feature-design` @ SDLC template library `0.2.2` |

## Executive Summary
<!-- Capture: one paragraph — what's being built and the shape of the approach, linking back to requirements.
     Avoid: diving into detail before orientation. Example: "Adds a `<bulk operation>` path in `<module>`
     behind a flag, reusing the existing single-item logic per item (R-1, R-2)." -->
<one paragraph>

## Scenario → Design Map
<!-- Capture: each requirement/scenario → the design element that satisfies it (forward traceability). Avoid:
     a requirement with no design element. Example: "R-1 `<bulk operation>` → `<OperationBlock>` + POST /<resource>:<operation>." -->
| Requirement / scenario (from Feature Spec) | Design element that satisfies it |
|---|---|
| <scenario> | <block / interface / object / flow> |

---

# Feature Architecture
<!--
  THE CORE OF THIS DOCUMENT. The architecture of THIS feature across the services/modules it touches —
  distinct from the repo-wide architecture doc and a module's manifest-routed spec. Ground every claim in real
  code (file path) at the current SHA.
-->

## System Context
<!-- Capture: the feature's place in the wider system — external entities/services it talks to + the boundary
     of this change (a context diagram helps). Avoid: redrawing the whole system. Example: "<module> +
     <caller> and <downstream bus>; <adjacent system> is out of scope." -->
```
<context diagram: this feature + external systems/actors it interacts with>
```
<narrative: what is inside vs outside the boundary of this change>

## Functional-Block Decomposition
<!-- Capture: the feature's logical blocks + how they interact (the actual feature architecture); one block per
     coherent responsibility. Avoid: a single "does it all" block. Example: "<Request> validator → <Operation>
     orchestrator → per-item action → event emitter." -->
```
<block diagram for this feature: blocks + the calls/events/data between them>
```
| Block | Responsibility (for this feature) | New or existing | Touches module(s) |
|---|---|---|---|
| <block> | <what it does> | new / existing | `<module>` |

## Object-Model Changes
<!-- Capture: the new/changed domain objects the implementer will touch. Avoid: omitting a field change that
     breaks consumers. Example: "<Entity>: changed — add `<field>` (nullable)." -->
| Object / entity | New / changed / removed | Fields / shape change | Owning module |
|---|---|---|---|

## Design Decisions & Rationale
<!-- Capture: each decision + WHY, at feature altitude. Avoid: a decision with no rationale. Example: "D-1 reuse
     single-item behavior in a loop — why: keeps one code path; bulk behavior is orchestration." -->
- **D-1 <decision>:** <what> — **why:** <rationale>

## Alternatives Explored
<!-- Capture: options considered, pros/cons, why dismissed (stops re-litigation). Avoid: presenting one option
     as if no others existed. Example: "A direct storage write path — faster, but bypasses domain validation — rejected." -->
| Alternative | Pros | Cons | Why not chosen |
|---|---|---|---|

## Dependencies & Assumptions
<!-- Capture: what must hold for the design to work + upstream deps (traced to tickets). Avoid: an unstated
     assumption that silently breaks the design. Example: "Assumes the event bus is at-least-once; depends on
     `<service>` v2 being deployed." -->
- **Assumes:** <assumption — and what breaks if false>
- **Depends on:** <upstream feature / service / migration — link>

<!-- Include if: one diagram does not capture the design — add the views that matter (logical / security / deployment / data-flow). [condition-id: feature.needs_arch_views] -->
## Architecture Views
<!-- Capture: only the views that add information beyond the block diagram. Avoid: redundant views that repeat
     the same picture. Example: a deployment view showing the new worker pool. -->
- **Logical view:** <diagram/narrative>
- **Deployment view:** <diagram/narrative>
- **Data-flow view:** <diagram/narrative>

---

## Feature-Toggle Strategy
<!-- Capture: the toggle(s) gating the feature — name, OFF behavior, safe default, owner, removal trigger. Avoid:
     a flag defaulting ON, or no removal plan. Example: "<operationFlag> | gates the endpoint | documented OFF response | OFF |
     <owner> | remove after GA." -->
| Toggle | Gates | Behavior when OFF | Default | Owner | Removal trigger |
|---|---|---|---|---|---|

<!-- Include if: the feature has throughput/latency/concurrency expectations (perf-critical or high-volume). [condition-id: feature.scale_requirements] -->
## Scale Requirements
<!-- Ownership: technical capacity and scale design. Product-level target/guardrail metrics live in
     feature-spec.md. -->
<!-- Capture: the concrete throughput/concurrency/latency/volume targets. Avoid: numbers copied from another
     feature. Example: "Throughput: <n> batches/s; Latency p99: < <bound>/batch of <size>." -->
| Dimension | Requirement |
|---|---|
| Throughput (req/s or events/s) | <value> |
| Concurrency | <value> |
| Latency p80 / p90 / p99 | <values> |
| Data volume / growth | <value> |

## Impacted Services / Modules & Task Split
<!--
  Capture: one block per impacted service group; keep the split high-level. The authoritative PR-sized
  breakdown is formalized in ../tasks/ (epic + task + implementation-plan). Avoid: maintaining the same
  task list in two places.
  Example: "<module-a> — endpoint/API changes; <worker> — async processing; <client> — user action."
-->
For each impacted service group / module:

### <Service group or module name>
- **Deployment target:** <where it runs / ships>
- **Epic:** <delivery epic key/URL, or "TBD until tasked">
- **Changes:**
  - <high-level change area; detailed tasks live in ../tasks/>

<!-- Include if: the feature introduces a brand-new service/component. [condition-id: feature.new_service] -->
### New Services
<!-- Capture: each new service + purpose + deployment target + cost + why new vs extend. Avoid: a new service
     where extending an existing one would do. Example: "<operation-worker> | async batch processing | <platform> | extend
     rejected: isolation needed." -->
| Service | Purpose | Deployment target | Cost profile | Justification (why new vs extend) |
|---|---|---|---|---|

## Service Impact Matrix
<!-- Capture: who changes AND who explicitly does NOT (blast radius). Avoid: omitting the explicit "no"s.
     Example: "<module-b> | no | unaffected — `<operation>` does not touch `<domain area>`." -->
| Service / module | Changes? | What changes (or why not) | Owner |
|---|---|---|---|
| `<service>` | yes / **no** | <one line> | <team> |

<!-- Include if: the feature changes datastores, messaging, or storage infrastructure. [condition-id: feature.infra_changes] -->
## Platform / Infrastructure Changes
<!-- Capture: the DB/messaging/storage/cloud change + migration plan. Avoid: a schema change with no migration.
     Example: "new <broker> topic <domain.operation>; add the consumer group." -->
- <DB / messaging / storage / cloud-service change + migration/true-up plan>

<!-- Include if: the feature requires CI/CD pipeline changes. [condition-id: feature.cicd_changes] -->
## CI/CD Pipeline Changes
<!-- Capture: new build/test/deploy steps, gates, environments. Avoid: a new component with no pipeline. Example:
     "add a load-test stage gated before prod for the high-volume path." -->
- <new build/test/deploy steps, gates, environments>

## Interface & Contract Definitions
<!-- Ownership: interface inventory and links. Full schema/error/version details live in
     design/contracts/*.md and the native schema/API source when one exists; stable as-built surfaces are
     summarized in the owning module spec, indexed from ai-docs/CONTRACTS.md, and reflected in SERVICE_STATE.md. -->
<!-- Capture: one row per interface added/changed (producer/consumer/change-type) + links to its contract doc
     and schema/API source. Avoid: inventing a route shape here or pasting a full schema. Example:
     "POST /<resource>:<operation> | <producer> | <consumer> | new | contracts/<operation>.md |
     openapi.yaml#/paths/... | additive." -->
| Interface (API / event / schema) | Producer | Consumer(s) | Change type (new/modify/remove) | Contract doc | Schema / API source | Compatibility / deprecation |
|---|---|---|---|---|---|---|
| <interface> | <svc> | <svc> | new / modify / remove | `contracts/<name>.md` | `<schema-or-api-detail>` | <compatible / transition plan> |

<!-- Include if: this feature adds/changes a non-trivial interface — write one per-interface contract doc under contracts/. [condition-id: feature.nontrivial_interface] -->
> Per-interface contract documents live in `contracts/*.md` (i.e. `design/contracts/`), one per
> cross-service interface. Prefer native schema files (`.yaml` for OpenAPI/AsyncAPI unless the repo
> already uses `.yml`, `.proto`, `.graphql`, JSON Schema, or SDK API reports) as the exact source.

<!-- Include if: the feature changes the data model (schema, migration, caching). [condition-id: feature.data_model_changes] -->
## Data-Model Design
<!-- Ownership: technical schema/migration/cache design for this feature. Standing entity ownership lives
     in DATA_MODEL.md. -->
<!-- Capture: schema changes + migration/true-up + cache effects. Avoid: a destructive migration. Example: "add
     nullable column expand→migrate→contract; no backfill." -->
- <schema changes; migration / true-up plan; cache patterns + TTL/invalidation>

<!-- Include if: the feature has authz/RBAC or data-privacy implications. [condition-id: feature.security_rbac] -->
## Security / RBAC Design
<!-- Ownership: technical authz/RBAC/privacy design for this feature. Standing security posture lives in
     SECURITY.md. -->
<!-- Capture: scopes, authz model, data classification/privacy, trust-boundary changes. Avoid: a privileged op
     with no scope check. Example: "requires privileged scope checked per target boundary." -->
- <scopes, authz model, data classification/privacy, trust-boundary changes>

<!-- Include if: the feature crosses a wire protocol / binary format (e.g. gRPC, a SOAP/XML protocol). [condition-id: feature.wire_protocol] -->
## Protocol / Wire-Format Design
<!-- Capture: the protocol-level design. Avoid: inventing a wire format — ground it in the owning repo. Example:
     "extends the existing `<ProtocolService>` with a `<BatchOperation>` RPC." -->
- <protocol-level design and canonical protocol/schema source>

<!-- Include if: the feature has a user-visible surface. [condition-id: feature.user_visible_surface] -->
## UX Design & Traceability
<!-- Capture: the user flow + Figma link + each UX element → its backing API. Avoid: a UI with no backing API
     mapping. Example: "<bulk action control> → POST /<resource>:<operation>." -->
- User-visible flow (screens/states); **Figma:** <link>.
| UX element | Backing API / interface |
|---|---|

<!-- Include if: the feature has bulk / CSV / batch behavior. [condition-id: feature.bulk_batch] -->
## Bulk / CSV / Batch Design
<!-- Capture: the bulk contract, column spec, batch sizing, partial-failure semantics. Avoid: an all-or-nothing
     batch where partial success matters. Example: "max <limit>/batch; return per-row status; no whole-batch rollback." -->
- <bulk contract, column spec, batch sizing, partial-failure semantics>

## HA & Failure-Condition Matrix
<!-- Capture: failure conditions × probability × impact × mitigation (the resiliency posture). Avoid: assuming
     dependencies never fail. Example: "bus unavailable | med | events lost | buffer + retry on recovery." -->
| Failure condition | Probability | Impact | Mitigation / fallback |
|---|---|---|---|

<!-- Include if: the primary or error/rollback paths warrant a sequence view. [condition-id: feature.needs_sequence_diagrams] -->
## Sequence Diagrams
<!-- Capture: the sequence inventory first, then one sequence per major operation group. Count operation
     groups from scenarios, public/API surfaces, events, commands, async jobs, cross-repo rollout steps,
     and state transitions. Merge operations into one diagram only when they share the same actors,
     ordering, transport, state transition, and failure behavior. Include error/rollback/retry/recovery
     paths. Avoid: one generic happy-path diagram for a design with multiple behaviors. Example: a mermaid
     sequence of the batch with a per-user failure branch. -->
Sequence coverage:

| Operation group | Diagram | Failure / recovery coverage |
|---|---|---|
| `<operation group>` | `<diagram title>` | <alt/opt branch or separate diagram covering error/timeout/retry/rejected/rollback/recovery> |

```
<sequence diagram: primary path, plus error/rollback paths>
```

## Rollout / Migration Interlock
<!-- Capture: the ordered cross-repo rollout (toggle timeline, waves, strict ordering). Avoid: enabling before
     dependencies ship. Example: "1) ship code flag-OFF 2) enable INT 3) canary prod 4) full." -->
| Step / wave | What ships | Depends on | Toggle state | Owner |
|---|---|---|---|---|

## Test Strategy
<!-- Capture: the key scenarios this design must prove + link to the full plan. Avoid: duplicating the test
     plan here. Example: "must prove: 500-batch < 5s; partial-failure returns per-user status." -->
→ Full plan: `../test-strategy.md`. Key scenarios this design must prove: <list>.

## Design Coverage Summary
<!--
  Capture: for every concern, mark In-scope / N/A / Out-of-scope, MECHANICALLY derived from the sections above
  (In-scope if filled; N/A if marked N/A; Out-of-scope if excluded). Avoid: a concern left blank — that reads
  as "silently skipped". Example: "Data model | N/A | no schema change."
-->
| Concern | In-scope / N/A / Out-of-scope | Where addressed |
|---|---|---|
| System context | | System Context |
| Functional decomposition | | Functional-Block Decomposition |
| Object model | | Object-Model Changes |
| Alternatives | | Alternatives Explored |
| Feature toggle | | Feature-Toggle Strategy |
| Scale | | Scale Requirements |
| Service impact | | Service Impact Matrix |
| Interfaces / contracts | | Interface & Contract Definitions |
| Data model | | Data-Model Design |
| Security / RBAC | | Security / RBAC Design |
| HA / failure | | HA & Failure-Condition Matrix |
| Rollout / migration | | Rollout / Migration Interlock |
| Test strategy | | Test Strategy |

## Reviewer Sign-Off
<!-- Capture: the cross-functional sign-offs needed before implementation-ready. Avoid: marking the design ready
     with sign-offs still pending. Example: "Architect | @arch | approved | 2026-06-18." -->
| Role | Reviewer | Status (pending / approved / changes-requested) | Date |
|---|---|---|---|
| Architect | | | |
| Tech Lead | | | |
| Product | | | |
| UX | | | |
| QA | | | |
| Delivery / SRE | | | |

## References / Traceability
- Feature Spec (WHAT + WHY): `../spec/feature-spec.md`
- Repo architecture: `../../../ai-docs/ARCHITECTURE.md` · module docs: manifest-routed, source-local as `<module-path>/ai-docs/<module-name>-spec.md` by default
- Per-interface contracts: `contracts/*.md` (`design/contracts/`) · Test strategy: `../test-strategy.md`
- Decomposition (epics/tasks/implementation plans): `../tasks/`
- Coverage / contracts baseline: `.sdd/manifest.json`
