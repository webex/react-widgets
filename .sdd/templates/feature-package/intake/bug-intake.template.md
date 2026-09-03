<!-- -------------------------------------------------
  Template:     Bug Intake
  Template-ID:  bug-intake
  Generates:    .generated/sdd/features/<KEY>/run-records/intake-questionnaire.md
  Description:  Code-grounded intake questions for a defect or behavior correction.
  Library ver:  0.2.2
  Last updated: 2026-06-30
-------------------------------------------------- -->

# Bug Intake

> Start here -> repo root [`AGENTS.md`](../../../AGENTS.md) (agent entry) and router
> [`SPEC_INDEX.md`](../../../ai-docs/SPEC_INDEX.md). Links assume the standard `features/<KEY>/` layout.
> Context-efficiency: link to canonical docs; the filled record lands in
> `.generated/sdd/features/<KEY>/run-records/intake-questionnaire.md` and is provenance, not a canonical spec.

<!--
  Capture current behavior, expected behavior, and invariants before a fix is designed. Every answer
  should be validated against code, tests, logs, tickets, or an explicitly recorded human decision.
-->

## Metadata

| Field | Value |
|---|---|
| Feature / ticket key | <KEY> |
| Intake type | defect / behavior correction |
| Generated from | `bug-intake` @ SDLC template library `0.2.2` |

## Questions

1. Affected module(s)? Validate against code and existing routing docs.
2. Current behavior: what actually happens, with a specific repro when possible.
3. Expected behavior: what should happen instead.
4. What must NOT change: at least one invariant the fix must preserve.
5. Severity: SEV-1 / SEV-2 / SEV-3 / SEV-4, with one-line justification.
6. Change class: routine / security / contract-affecting / perf-critical / persistence / ui.
7. Characterization baseline: what existing test, log, or fixture pins current behavior?

## Output

The filled run record captures verified facts, unresolved conflicts, must-not-change invariants,
change class, and any required characterization baseline.
