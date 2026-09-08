<!-- -------------------------------------------------
  Template:     Module Spec Intake
  Template-ID:  module-spec-intake
  Generates:    .generated/sdd/features/<KEY>/run-records/intake-questionnaire.md
  Description:  Code-grounded intake questions for a new module or a deeper module spec.
  Library ver:  0.2.2
  Last updated: 2026-06-30
-------------------------------------------------- -->

# Module Spec Intake

> Start here -> repo root [`AGENTS.md`](../../../AGENTS.md) (agent entry) and router
> [`SPEC_INDEX.md`](../../../ai-docs/SPEC_INDEX.md). Links assume the standard `features/<KEY>/` layout.
> Context-efficiency: link to canonical docs; the filled record lands in
> `.generated/sdd/features/<KEY>/run-records/intake-questionnaire.md` and is provenance, not a canonical spec.

<!--
  Capture the module boundary, any exposed/consumed surfaces that actually apply, dependencies, and
  which conditional sections belong in `<module-path>/ai-docs/<module-name>-spec.md`. Do not invent API/contract questions for
  modules that have no API, event, command, UI, schema, file, package, or external system boundary.
-->

## Metadata

| Field | Value |
|---|---|
| Feature / ticket key | <KEY> |
| Intake type | module-spec |
| Generated from | `module-spec-intake` @ SDLC template library `0.2.2` |

## Questions

1. Module name and one-line responsibility.
2. Topology fit: where does this module sit in the repository?
3. Exposed surface: if this module is consumed by other code, users, jobs, or systems, what does it
   expose: API/export, endpoint, command, event/message, UI flow, schema, file format, package
   surface, or external service behavior? If none exists, mark it not applicable from evidence.
4. Dependencies: what other modules, services, stores, contracts, or runtime resources does it rely on?
5. Primary operations: what are the main operations or flows this module supports?
6. Failure and recovery: what errors, timeout paths, retries, rejected operations, or recovery signals
   can callers or maintainers observe?
7. Internal structure: what are the main classes/components/functions and how do they collaborate?
8. Data movement: what inputs enter the module, what transformations happen, and what outputs/events
   leave it?
9. Use cases: what actor or caller flows should future agents understand before changing this module?
10. Tests and gaps: which tests prove current behavior, and where are positive/negative or edge-case
   tests missing?
11. Source material: are there existing overview, architecture, HLD, LLD, API, or test notes that
   should be used as source material for the canonical module spec?
12. Which deeper sections apply from evidence or developer confirmation?
   - [ ] state machine
   - [ ] protocol / wire format
   - [ ] UI flow
   - [ ] data model
   - [ ] concurrency / reactive flow
   - [ ] caller-visible error handling
   - [ ] module-specific conventions
   - [ ] export stability
   - [ ] host integration

## Output

The filled run record captures the selected module boundary, public surface, dependencies, primary
operations, failure/recovery paths, internal relationships, data movement, use cases, tests/gaps,
source material, and section choices. `ai-docs/SPEC_INDEX.md` routes to the canonical module spec;
module-specific detail stays inside `<module-path>/ai-docs/<module-name>-spec.md` by default.
