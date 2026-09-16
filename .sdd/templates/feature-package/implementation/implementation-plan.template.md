<!-- ───────────────────────────────
  Template:     Implementation Plan
  Template-ID:  implementation-plan
  Generates:    features/<KEY>/tasks/<epic-slug>/implementation-plan-<n>.md
  Description:  Decomposition — per-task dev plan: current context, approach, changes, rollback, anticipated PR split.
  Library ver:  0.2.2
  Last updated: 2026-06-30
─────────────────────────────── -->

# Implementation Plan — <task title>

> Start here → repo root [`AGENTS.md`](../../../../AGENTS.md) (agent entry) · router [`SPEC_INDEX.md`](../../../../ai-docs/SPEC_INDEX.md). This plan builds its task [`task-<n>.md`](./task-1.md) under epic [`epic.md`](./epic.md); design is [`feature-design.md`](../../design/feature-design.md). (Links relative to this file.)
> Context-efficiency: link to canonical docs — don't duplicate them; ground in current code (file path), don't restate the design.

<!--
  DECOMPOSITION LAYER 3 of 3. The per-task developer plan: how one PR-sized task will actually be built,
  grounded in the current code. Save as features/<KEY>/tasks/<epic-slug>/implementation-plan-<n>.md.
  Headings are flat; sections preceded by `<!-- Include if: ... -->` are kept only when the condition holds.
  Each section comment gives Capture / Avoid / Example. Fill from real code (file path) at the current SHA.
-->

## Task Context
<!-- Capture: the task + parent links + target repos + stream. Avoid: a plan detached from its task. -->
| Field | Value |
|---|---|
| Task | `./task-<n>.md` |
| Parent epic / feature | `./epic.md` · `../../design/feature-design.md` |
| Target repo(s) / module(s) | `<owner/repo>` · `<module>`; repeat per repo when this task is atomic across repos |
| Execution stream / wave | <stream> |
| created_by / date | <provenance> |
| Generated from | `implementation-plan` @ SDLC template library `0.2.2` |

## Current Context (code-grounded)
<!-- Capture: what the relevant code does TODAY with file path evidence — the baseline this task changes.
     Group by target repo when the task spans repos. Avoid describing intended (not actual) behavior.
     Example: "<owner/repo> :: <operation>() handles one id @<module>/service.ts." -->
- <current behavior / structure> — evidence: `<file path>`

## Proposed Approach & Sequencing
<!-- Capture: the ordered steps a reviewer can follow. Avoid: a vague "implement the feature". Example:
     "1) add <Request> DTO 2) add service.<operationMany> 3) wire route 4) emit events per item." -->
1. <step>

<!-- Include if: the task changes a database schema or stored data shape -->
## Schema / Data Changes
<!-- Capture: the table/field change + migration/backfill plan. Avoid: a destructive in-place change. Example:
     "add <entity>.<field> (nullable); backfill not needed." -->
- <table/field change; migration + true-up/backfill plan>

<!-- Include if: the task adds or changes an API / interface -->
## API / Interface Changes
<!-- Capture: the endpoint/signature change + compact request/response shape + schema/API source. Avoid:
     changing a response shape silently or pasting a full schema here. Example:
     "POST /<resource>:<operation> -> {results:[{id,status}]}; openapi.yaml#/paths/... ." -->
- <endpoint/signature change; compact shape; schema/API source>

<!-- Include if: the task changes a cross-service contract -->
## Contract Changes
<!-- Capture: the Provides/Requires delta + links to the contract doc, schema/API source, module summary, and
     root index. Avoid: an undocumented contract change. Example:
     "Provides ADDED <operation> -> design/contracts/<operation>.md; openapi.yaml#/paths/...;
     update <module-path>/ai-docs/<module-name>-spec.md Public Surface and ai-docs/CONTRACTS.md." -->
- <Provides/Requires delta; links to `../../design/contracts/*.md`, schema/API source, module spec summary, and root `CONTRACTS.md` row>

<!-- Include if: the task touches a security or compliance surface -->
## Security / Compliance (task-scoped)
<!-- Capture: the authz/validation/secret handling for THIS task. Avoid: skipping authz on a privileged op.
     Example: "verify privileged scope per target boundary before applying the operation." -->
- <authz, validation, secret handling, data classification for this task>

<!-- Include if: the task affects build, CI, or deployment -->
## Build / CI / Deployment Impact
<!-- Capture: new build/test steps, pipeline/config changes. Avoid: a new test tier with no CI wiring. Example:
     "adds an integration test stage gated on a test datastore." -->
- <new build/test steps, pipeline or config changes>

## Backward-Compat / Rollback
<!-- Capture: how existing callers/data keep working + how to back it out safely. Avoid: an irreversible change
     with no rollback. Example: "flag-gated; disable the flag to revert; no data migration to undo." -->
- **Compatibility:** <how existing callers/data keep working>
- **Consumer transition / deprecation:** <if a public surface changes incompatibly, how consumers move>
- **Rollback:** <how to revert; is it safe mid-rollout?>

## Logs / Metrics / Alerting
<!-- Capture: the observability this task adds/relies on. Avoid: shipping a new path with no signal. Example:
     "log per-item result at debug; metric <operation>_total." -->
- <logs/metrics/alerts to add or update>

## Implementation Caveats
<!-- Capture: gotchas — idempotency, ordering/sequencing, eventual consistency, edge cases. Avoid: ignoring
     partial-failure. Example: "partial failure: return per-item status; do not roll back the whole batch." -->
- <caveat>

## Anticipated PR Split
<!-- Capture: how the task breaks into PR(s), one logical concern each. Avoid: one giant PR mixing concerns.
     Example: "PR1 service+tests; PR2 route+events." -->
| PR | Scope (one logical concern) | Depends on |
|---|---|---|

## Manual Validation
<!-- Capture: hand checks before/after merge beyond automated tests. Avoid: relying only on unit tests for a
     user-facing path. Example: "disable 3 users via the admin UI; confirm events on the bus." -->
- [ ] <manual check>

## AI Docs Impact
<!-- Capture: decide every canonical AI doc or schema source this task must update before code is written.
     Use one matrix per target repo/component. For a multi-repo task, repeat this section for each repo
     named in the task's Multi-Repo Scope. Avoid one combined matrix that hides which repo owns the docs.
     Use "not required — <reason>" instead of leaving a row blank. If a required destination is
     missing/conflicting/protected, mark "blocked" and name the pre-work. -->

### <owner/repo> — <module/component>
| Field | Value |
|---|---|
| Manifest | `.sdd/manifest.json` |
| Standing docs root | `ai-docs/` |

| Doc / source | Decision (required / not required / blocked) | Reason / trigger | Required update or no-impact reason |
|---|---|---|---|
| Touched module spec(s) | <required / not required / blocked> | <behavior, requirement, public surface, invariant, flow, state, protocol, UI, data, or test-strategy impact> | `<module-path>/ai-docs/<module-name>-spec.md` / <reason> |
| `ai-docs/SPEC_INDEX.md` | <required / not required / blocked> | <module registry, responsibility, canonical spec path, coverage mirror, docs routing, task routing, or standing-doc location impact> | <row/update or reason> |
| `ai-docs/CONTRACTS.md` | <required / not required / blocked> | <endpoint/export/event/command/RPC/schema/Requires impact> | <row/update or reason> |
| Native schema/API source | <required / not required / blocked> | <OpenAPI/AsyncAPI/proto/GraphQL/JSON Schema/SDK/API report/package entry point impact> | <source update or reason> |
| `ai-docs/SERVICE_STATE.md` | <required / not required / blocked> | <current endpoint/event/store/dependency/limit/metric/flag impact> | <row/update or reason> |
| `ai-docs/DATA_MODEL.md` | <required / not required / blocked> | <entity, ownership, relationship, migration, retention, cache-backed data impact> | <row/update or reason> |
| `ai-docs/SECURITY.md` | <required / not required / blocked> | <trust boundary, authn/authz, secrets, data classification, validation, encoding, session, risk impact> | <section/update or reason> |
| `ai-docs/GLOSSARY.md` | <required / not required / blocked> | <domain term, entity, event, state, or public concept impact> | <term/update or reason> |
| `ai-docs/ARCHITECTURE.md` | <required / not required / blocked> | <component responsibility, interaction, flow, dependency, infra, cross-repo, cross-cutting impact> | <section/update or reason> |
| `ai-docs/RULES.md` | <required / not required / blocked> | <enforceable convention, review, test, logging, error, security, or drift-threshold impact> | <rule/update or reason> |
| README / public API / help / release docs | <required / not required / blocked> | <user/developer-facing documentation impact> | <doc/update or reason> |

## Documentation Updates
<!-- Capture: the docs/specs that must change in the same change (spec-currency). Avoid: merging without doc
     updates. Group by target repo and populate this from every AI Docs Impact row marked "required".
     Example: "update the owning module spec or design/contracts/<interface>.md, then add or adjust the
     ai-docs/CONTRACTS.md index pointer if the stable surface changes." -->
### <owner/repo>
- <owning module Public Surface summary>
- <ai-docs/SPEC_INDEX.md row if routing/registry changes>
- <root ai-docs/CONTRACTS.md index row>
- <canonical schema/API source, if changed>
- <SERVICE_STATE / DATA_MODEL / SECURITY / GLOSSARY / ARCHITECTURE / RULES update, if required>
- <spec / README / API doc / help guide to update>

## References
- Task: `./task-<n>.md` · Epic: `./epic.md` · Feature design: `../../design/feature-design.md`
