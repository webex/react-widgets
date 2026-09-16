<!-- ───────────────────────────────
  Template:     Epic
  Template-ID:  epic
  Generates:    features/<KEY>/tasks/<epic-slug>/epic.md
  Description:  Decomposition — a coherent slice of the design: mapped sections, child tasks, sequencing, exit criteria.
  Library ver:  0.2.2
  Last updated: 2026-06-30
─────────────────────────────── -->

# Epic — <epic title>

> Start here → repo root [`AGENTS.md`](../../../../AGENTS.md) (agent entry) · router [`SPEC_INDEX.md`](../../../../ai-docs/SPEC_INDEX.md). This epic delivers a slice of the design [`feature-design.md`](../../design/feature-design.md); its child tasks ↔ [`task-<n>.md`](./task-1.md) → impl plan. (Links relative to this file.)
> Context-efficiency: link to canonical docs — don't duplicate them; map to design sections, don't restate them.

<!--
  DECOMPOSITION LAYER 1 of 3 (Epic → Task → Implementation Plan). An epic is a coherent slice of the feature
  design — typically one per service group or capability. Save as features/<KEY>/tasks/<epic-slug>/epic.md.
  Headings are flat; sections preceded by `<!-- Include if: ... -->` are kept only when the condition holds.
  Each section comment gives Capture / Avoid / Example.
-->

## Metadata
<!-- Capture: identity + the slice it owns + tracker key + status. Avoid: an epic that spans unrelated
     capabilities. Example: "Service group / capability: <resource> bulk operations." -->
| Field | Value |
|---|---|
| Epic title | <title> |
| Parent feature | `../../design/feature-design.md` (and `../../spec/feature-spec.md`) |
| Service group / capability | <the coherent slice this epic owns> |
| Tracker / Epic key | <key/URL, or "TBD — not projected to the tracker"> |
| Status | draft / ready / in-progress / done |
| created_by / approved_by / date | <provenance> |
| Generated from | `epic` @ SDLC template library `0.2.2` |

## Scope — the slice of the design this epic delivers
<!-- Capture: in one paragraph, the coherent capability this epic owns. Avoid: restating the whole feature.
     Example: "Everything for `<bulk operation>` in `<module>` — endpoint, service, events." -->
<scope>

## Mapped Design Sections
<!-- Capture: which Feature_Design sections this epic implements (design→epic traceability). Avoid: an epic with
     no mapped design. Example: "Functional decomposition: <OperationBlock> block → this epic." -->
| Feature design section | What this epic delivers from it |
|---|---|
| <e.g. Functional-Block Decomposition: block X> | <deliverable> |

## Summary of Changes (per service / module)
<!-- Capture: the high-level change per service/module touched. Avoid: file-level detail (that's the task/plan).
     Example: "`<module>/`: add `<operation>` endpoint + service method + `<DomainEvent>` event." -->
- **`<service / module>`:** <change summary>

<!-- Include if: this is a brownfield/incremental epic where a baseline already shipped -->
## Baseline vs This Epic
<!-- Capture: what already exists vs what this epic adds. Avoid: re-building shipped capability. Example:
     "single-item operation: shipped; bulk path: this epic." -->
| Capability | Already shipped (baseline) | Added by this epic |
|---|---|---|

## Child Tasks
<!-- Capture: the PR-sized tasks under this epic, each linked. Avoid: a task too big for one PR. Example:
     "T1 endpoint+service | yes | task-t1.md." -->
| Task | One-line | PR-sized? | Task doc | Tracker key |
|---|---|---|---|---|
| T1 | <summary> | yes | `task-t1.md` | <key/TBD> |

## Sequencing & Dependencies
<!-- Capture: execution order across tasks/sibling epics — what blocks what, what's parallel-safe. Avoid:
     hidden ordering that causes a broken intermediate state. Example: "T2 (events) blocked-by T1 (service)." -->
| Task / epic | Depends on | Parallel-safe with | Wave |
|---|---|---|---|

<!-- Include if: this epic has a specific ordered rollout across steps/repos -->
## Rollout Order
<!-- Capture: the ordered rollout steps. Avoid: enabling the flag before the code ships. Example: "1) ship code
     (flag OFF) 2) enable in integration 3) prod-enable." -->
1. <ordered step>

## Exit Criteria
<!-- Capture: the observable conditions that mark the epic done (distinct from per-task acceptance). Avoid:
     "all tasks done" with no verifiable outcome. Example: "[ ] bulk endpoint live behind flag in prod." -->
- [ ] <criterion>

## References
- Feature design: `../../design/feature-design.md` · Feature spec: `../../spec/feature-spec.md`
- Child tasks: `./task-*.md` · Implementation plans: `./implementation-plan-*.md`
