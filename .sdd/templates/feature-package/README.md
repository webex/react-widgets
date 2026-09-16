# Feature-Package Templates

The per-change lifecycle templates — instantiated **per change** (a feature, a defect, or
module-spec work) during Capture → Discovery → Development. Capture includes intake and feature-spec
capture. Discovery includes discovery, design, test strategy, and decomposition. Development includes
implementation planning and code. One stage-agnostic set; stage generators fill the right sections at
the right stage.

> **Seeded into the target repo.** A repository setup process copies these templates unchanged into the
> target repo's `.sdd/templates/`. Later lifecycle generators instantiate them from the target repo, not
> from a generator-owned bundle.

## Generated Flow

When instantiated for a change, these templates produce artifacts in this order:

```text
Capture
  -> intake run record
  -> features/<KEY>/spec/feature-spec.md
Discovery
  -> features/<KEY>/design/feature-design.md
  -> features/<KEY>/design/contracts/*.md when needed
  -> features/<KEY>/test-strategy.md
  -> features/<KEY>/tasks/<epic>/epic.md
  -> features/<KEY>/tasks/<epic>/task-<n>.md
Development
  -> features/<KEY>/tasks/<epic>/implementation-plan-<n>.md plus required docs, code, and test changes
Module-spec work
  -> <module-path>/ai-docs/<module-name>-spec.md plus SPEC_INDEX.md routing
```

Use a generator or manual process that follows this artifact order to fill these templates. Edit this
folder only when changing the reusable shape of future feature artifacts.

**Altitude split:** the Feature Spec owns product intent (WHAT and WHY). The Feature Design owns the
technical solution. Contracts under `design/contracts/` own full interface schema. Tasks own PR-sized
implementation boundaries. Do not restate the same fact across layers; link to the owner.

Generated feature artifacts should keep the source-template heading order and fill retained sections
with concrete detail. Use `N/A` only with a reason, and use `[NEEDS HUMAN INPUT]` only while a required
answer is unresolved. For design sequence diagrams, first map operation groups to diagrams, then
include primary and failure/rollback/recovery paths for each operation group that needs a sequence view.

| Template | Generates | Purpose · when to use (stage) |
|---|---|---|
| `spec/feature-spec.template.md` | `feature-spec.md` | Product intent: WHAT+WHY, scope, acceptance, success/guardrail metrics, requirements state, contracts delta, change log. **Capture.** |
| `design/feature-design.template.md` | `feature-design.md` | The discovery design container — feature architecture (system context, decomposition, object model, alternatives, views, toggle), scale, service-impact, interfaces, rollout, coverage summary, sign-off. **Discovery / design.** |
| `design/contracts/_contract.template.md` | `contracts/<iface>.md` | One cross-service interface: full schema, error catalog, backward-compat, delivery/ordering, versioning. **Discovery / design**, per non-trivial interface. |
| `tasks/epic.template.md` | `epic.md` | A coherent slice of the design → child tasks, sequencing, exit criteria. **Discovery / decomposition.** |
| `tasks/task.template.md` | `task-<n>.md` | A PR-sized task with an explicit **ownership boundary**, acceptance + verifier-exit criteria, traceability, coverage. **Discovery / decomposition.** |
| `implementation/implementation-plan.template.md` | `implementation-plan-<n>.md` | Per-task dev plan: current context, approach, changes, rollback, anticipated PR split. **Development.** |
| `test-strategy/test-strategy.template.md` | `test-strategy.md` | Feature/system test plan (unit tests live in the module spec): use-cases→tests + contract/integration/E2E/scale/security/resiliency tiers. **Discovery.** |
| `intake/feature-intake.template.md` | `.generated/sdd/features/<KEY>/run-records/intake-questionnaire.md` | Code-grounded intake questions for a new feature; the generated file is a run record, not a canonical spec. **Capture / intake.** |
| `intake/bug-intake.template.md` | `.generated/sdd/features/<KEY>/run-records/intake-questionnaire.md` | Code-grounded intake questions for a defect or behavior correction; the generated file is a run record. **Capture / intake.** |
| `intake/module-spec-intake.template.md` | `.generated/sdd/features/<KEY>/run-records/intake-questionnaire.md` | Code-grounded intake questions for a new module or deeper module spec; the generated file is a run record that feeds `<module-path>/ai-docs/<module-name>-spec.md`. **Capture / intake.** |

## Per-feature instance layout

```
<repo>/features/<KEY>/            (or docs/specs/<KEY>/ — repo's choice, set in SPEC_INDEX)
  spec/feature-spec.md
  design/feature-design.md         (discovery design container)
  design/contracts/*.md            (one per cross-service interface, when they exist)
  tasks/<epic>/epic.md             (decomposition: a coherent slice of the design)
  tasks/<epic>/task-<n>.md         (decomposition: a PR-sized task)
  tasks/<epic>/implementation-plan-<n>.md  (implementation: per-task dev plan)
  test-strategy.md

<repo>/.generated/sdd/features/<KEY>/
  lifecycle-state.json             (machine-readable stage gates and source readiness)
  run-records/                     (stage Q&A/provenance; not canonical specs)
    intake-questionnaire.md
    capture-questionnaire.md
    discovery-questionnaire.md
    decomposition-decisions.md
    implementation-record.md
```

> The standard generated layout is `features/<KEY>/...`; template navigation links assume this layout.
> If a repository chooses another location, the generator must rewrite relative links during
> instantiation and record the location in `SPEC_INDEX.md`.

Current feature packages use stage-specific records under
`.generated/sdd/features/<KEY>/run-records/` plus `.generated/sdd/features/<KEY>/lifecycle-state.json`
so agents can load the minimum stage context without confusing provenance with canonical specs. Older
packages may still have `features/<KEY>/questionnaire.md` as a compatibility fallback.

The lifecycle chain: **Capture** (intake + Feature Spec) → **Discovery** (Feature Design + Test
Strategy + Epic/Task decomposition) → **Development** (Implementation Plan → code).

Conventions (metadata header · navigation pointer · context-efficiency · flat headings + `Include if:`
· Capture/Avoid/Example) are described in `../README.md`.
