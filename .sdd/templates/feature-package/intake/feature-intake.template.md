<!-- -------------------------------------------------
  Template:     Feature Intake
  Template-ID:  feature-intake
  Generates:    .generated/sdd/features/<KEY>/run-records/intake-questionnaire.md
  Description:  Code-grounded intake questions for a new feature.
  Library ver:  0.2.2
  Last updated: 2026-06-30
-------------------------------------------------- -->

# Feature Intake

> Start here -> repo root [`AGENTS.md`](../../../AGENTS.md) (agent entry) and router
> [`SPEC_INDEX.md`](../../../ai-docs/SPEC_INDEX.md). The intake's change-class output gates conditional
> sections of the Feature Spec. Links assume the standard `features/<KEY>/` layout.
> Context-efficiency: link to canonical docs; the filled record lands in
> `.generated/sdd/features/<KEY>/run-records/intake-questionnaire.md` and is provenance, not a canonical spec.

<!--
  Question content for a new feature. The caller owns the mechanics: build a prior from code, ask
  bounded questions, validate answers against evidence, branch/prune, and record decisions.
  Ask only about fact categories that apply to the change. Do not force API, event, schema, storage,
  UI, or dependency questions when evidence shows that category is not touched. Use file paths and
  generated references as evidence only; ask the developer about the repo impact in plain language.
-->

## Metadata

| Field | Value |
|---|---|
| Feature / ticket key | <KEY> |
| Intake type | feature |
| Generated from | `feature-intake` @ SDLC template library `0.2.2` |

## Questions

1. Module set: are these the modules this feature touches? `<list>` (yes/no) -- validated against code.
2. Documentation readiness: for each touched area, can agents rely on its existing module docs, should
   they cross-check code, or is code the only reliable source until docs are backfilled?
3. WHAT: one sentence in user language.
4. WHY: the problem or goal.
5. In scope / out of scope: confirm both; out of scope must be non-empty.
6. Acceptance signals: observable and testable outcomes.
7. Risk areas: does this touch security, a consumer-facing interface, performance, stored data,
   user-visible behavior, external services, events/messages, package release behavior, or only
   internal implementation? If none apply, say it is a routine internal change.

*Include if: the feature changes an exposed or consumed interface*
- What interface changes: API/export, endpoint, command, event/message, schema, file format, package
  surface, or external service dependency? If no exposed/consumed interface changes, mark this not
  applicable from evidence.

*Include if: the feature changes stored data*
- New or changed schema, table, migration, or stored data shape?

*Include if: the feature changes a user-visible flow*
- What user-visible flow changes? Is there a design reference?

*Include if: the feature changes a published package's public surface*
- What public API changes, and what is the semver impact?

*Include if: the feature touches a network/HTTP API*
- What endpoint or external dependency changes?

*Include if: the feature publishes or consumes events*
- What event/topic/consumer/producer contract changes?

## Output

The filled run record captures verified-from-code facts, verified developer facts, source-readiness,
unknowns, resolved conflicts, blocking conflicts, confidence, and resume state.
