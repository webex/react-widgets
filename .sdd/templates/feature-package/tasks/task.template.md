<!-- ───────────────────────────────
  Template:     Task
  Template-ID:  task
  Generates:    features/<KEY>/tasks/<epic-slug>/task-<n>.md
  Description:  Decomposition — a PR-sized task with an ownership boundary, acceptance + verifier-exit criteria, traceability.
  Library ver:  0.2.2
  Last updated: 2026-06-30
─────────────────────────────── -->

# Task — <task title>

> Start here → repo root [`AGENTS.md`](../../../../AGENTS.md) (agent entry) · router [`SPEC_INDEX.md`](../../../../ai-docs/SPEC_INDEX.md). This task sits under its epic [`epic.md`](./epic.md) ↔ its plan [`implementation-plan-<n>.md`](./implementation-plan-1.md); it implements part of [`feature-design.md`](../../design/feature-design.md). (Links relative to this file.)
> Context-efficiency: link to canonical docs — don't duplicate them; reference the design section this task implements.

<!--
  DECOMPOSITION LAYER 2 of 3. A PR-sized unit under an epic — small enough for one reviewable PR. Its defining
  feature is an explicit OWNERSHIP BOUNDARY so parallel tasks don't collide. Save as
  features/<KEY>/tasks/<epic-slug>/task-<n>.md. Headings are flat; sections preceded by `<!-- Include if:
  ... -->` are kept only when the condition holds. Each section comment gives Capture / Avoid / Example.
-->

## Metadata
<!-- Capture: identity, task type, target repo/module, tracker key, state. Avoid: a "task" that's really a whole
     epic. Example: "Task type: API; Target: <module>; State: not_started." -->
| Field | Value |
|---|---|
| Task title | <title> |
| Parent epic | `./epic.md` |
| Parent feature | `../../design/feature-design.md` (and `../../spec/feature-spec.md`) |
| Task type | backend / API / migration / validation / docs / observability / security / rollout / UI |
| Target repo(s) / module(s) | `<owner/repo>` · `<module>`; repeat per repo when this task is atomic across repos |
| Tracker key | <key/URL, or "TBD — not projected"> |
| State | not_started / in_progress / ready_for_merge / merged |
| created_by / approved_by / date | <provenance> |
| Generated from | `task` @ SDLC template library `0.2.2` |

## Source Mapping
<!-- Capture: the exact feature-design (or epic) section this task implements — why it exists. Avoid: a task
     with no design link. Example: "Implements Feature Architecture → <OperationBlock> block." -->
- Implements: <Feature_Design section path> → <what part>

## Primary Code Touchpoints
<!-- Capture: the files/modules this task changes, grounded in real paths and grouped by target repo when
     more than one repo is in scope. Avoid: vague "the users area". Example:
     "<owner/repo> :: <module>/api/<operation>.ts (new route)". -->
- `<path/file>` — <what changes>

## Ownership Boundary
<!-- Capture: the files/regions THIS task owns so two PR-sized tasks never edit the same lines, and what it must
     NOT touch. Group by target repo when more than one repo is in scope. Avoid: overlapping boundaries
     between sibling tasks. Example: "Owns <repo-a>:<module>/api/<operation>.ts; must NOT touch
     <repo-a>:<module>/events/* (owned by T2)." -->
- Owns: `<path or path#region>`
- Must NOT touch (owned by another task): `<path>` → owned by `<task>`

## Multi-Repo Scope
<!-- Capture: use "N/A — single target repo" for normal repo-scoped tasks. If this task spans repos, state why
     it is one atomic task instead of separate repo-scoped tasks, and list each repo's manifest plus
     standing-docs root. Module specs remain source-local under each module path. -->
| Target repo | Module/component | Why included in this task | Manifest / standing docs root |
|---|---|---|---|
| `<owner/repo>` | `<module>` | <reason / N/A for single repo> | `.sdd/manifest.json` / `ai-docs/` |

## Dependencies / Execution Stream
<!-- Capture: blocked-by / parallel-safe / wave. Avoid: claiming parallel-safe when boundaries overlap. Example:
     "blocked-by T1; parallel-safe with T3; wave 2." -->
| This task | Depends on (blocked-by) | Parallel-safe with | Wave / stream |
|---|---|---|---|

## Acceptance Criteria
<!-- Capture: task-specific, observable, testable conditions. Avoid: restating the feature's acceptance. Example:
     "[ ] POST /<resource>:<operation> returns a per-item result array." -->
- [ ] <criterion>

## Verifier Exit Criteria
<!-- Capture: the pass/fail checks an INDEPENDENT verifier (different runtime than the implementer) runs — how
     it's PROVEN correct, distinct from acceptance. Avoid: duplicating acceptance. Example: "[ ] changed-line
     coverage ≥ 80%; [ ] no contract drift vs ai-docs/CONTRACTS.md." -->
- [ ] <check the verifier must confirm>

## Traceability
<!-- Capture: requirement/rule → code symbol → test, so each change traces back to intent and forward to a test.
     Avoid: a requirement with no test. Example: "R-1 | <OperationService>.<method> | <operation>.spec.ts: processes <limit>." -->
| Requirement / rule id | Code symbol (class.method / file) | Test that proves it |
|---|---|---|

## Coverage Expectation
<!-- Capture: the changed-line coverage threshold + where evidence lives. Avoid: no coverage target on new code.
     Example: "≥ 80%; evidence: CI coverage report." -->
- Changed-line coverage ≥ <threshold>%; evidence: <report path / CI check>

## Cross-Cutting Prompts
<!-- Capture: answer each (or mark N/A) — don't skip silently. Avoid: leaving security/idempotency blank on a
     write path. Example: "Idempotency: re-applying an already-applied operation is a no-op." -->
- **Logging:** <what to log / N/A>
- **Metrics:** <what to emit / N/A>
- **Security:** <authz/validation/secret handling / N/A>
- **Idempotency:** <retry/replay safety / N/A>
- **Rollout:** <flag/sequencing assumption / N/A>

## Non-Goals / Out-of-Scope
<!-- Capture: what this task explicitly does NOT do (prevents creep into sibling tasks). Avoid: an empty
     non-goals on a task adjacent to others. Example: "Does NOT add the UI — that's T4." -->
- <out-of-scope item>

<!-- Include if: this task is gated by a feature flag or has rollout assumptions -->
## Feature-Flag & Rollout Assumptions
<!-- Capture: the flag, default, and what must be true to deploy safely. Avoid: assuming the flag is already ON.
     Example: "Flag <operationFlag> default OFF; enable only after T2 events ship." -->
- Flag: `<name>` · default: <on/off> · assumption: <what must be true to deploy safely>

## References
- Epic: `./epic.md` · Implementation plan: `./implementation-plan-<n>.md`
- Feature design: `../../design/feature-design.md` · Coverage/contracts baseline: each target repo's `.sdd/manifest.json`
