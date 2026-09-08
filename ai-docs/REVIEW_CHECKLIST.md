<!-- ───────────────────────────────
  Template:     Review-Check Catalog
  Template-ID:  review-checklist
  Generates:    ai-docs/REVIEW_CHECKLIST.md
  Description:  The review checks — 6 core + 4 coverage-conditional + 3 cross-cutting — selected by manifest coverage state.
  Library ver:  0.2.2
  Last updated: 2026-06-30
─────────────────────────────── -->

<!-- sdd-generated-metadata
doc_kind: standing-doc
generated_from: review-checklist
generator_plugin: sdd-bootstrap@0.4.3
generated_by: cursor-agent
approved_by: pending PR approval
updated_at: 2026-09-08
validation_status: not-run
-->


# Review-Check Catalog — react-widgets

> Start with root [`AGENTS.md`](../AGENTS.md), route through [`SPEC_INDEX.md`](SPEC_INDEX.md), and apply this catalog before merge.

Each finding records severity, check id, file path, impact, and a concrete fix. Any Blocking finding fails the gate.

## Core checks (always run)

| # | Check | What it verifies | Severity if it fails |
|---|---|---|---|
| C1 | Spec-currency + WHAT/WHY | Behavior/public-surface changes update SDD docs and every requirement states WHAT and WHY. | Blocking |
| C2 | Contract correctness | Package exports, props, widget/data/browser APIs, events, commands, and dependencies are complete and compatible. | Blocking |
| C3 | Code-vs-spec match | Signatures, event strings, state/flow, and architecture claims match source and tests. | Blocking |
| C4 | Test adequacy | Positive and negative unit coverage exists; relevant journey/accessibility coverage is run or its gap recorded. | Important |
| C5 | Error handling + input validation | Host/SDK inputs are validated and promise/event/UI failure paths are not swallowed. | Important |
| C6 | Security baseline | No secrets; credential, rendered-content, file/media, encrypted-mode, and release controls remain intact. | Blocking |

## Coverage-conditional checks

| # | Check | When it applies | What it verifies | Severity |
|---|---|---|---|---|
| K1 | Regression guard | Any Partial/Untracked module or MODIFIED/REMOVED guarantee | A characterization/targeted baseline protects unchanged behavior with positive and negative cases. | Blocking |
| K2 | Grounding | Partial/Untracked module | Claims cite real source/tests and uncovered surfaces remain explicit. | Important |
| K3 | Drift threshold | Any tracked module | Drift remains within the manifest state threshold. | Important |
| K4 | Coverage-state accuracy | Coverage state changes | Score, gaps, drift, promotion history, and waiver rules support the state. | Medium |

## Cross-cutting checks

| # | Check | What it verifies | Severity |
|---|---|---|---|
| X1 | Independent review | Validator runtime differs from generator runtime as `.sdd/manifest.json` requires. | Blocking |
| X2 | Observability | SDK/Redux/metrics/CI signals cover the change without sensitive logging. | Medium |
| X3 | Rollout safety | Package/CDN compatibility, SRI, default props/flags, and consumer transition/rollback are safe. | Important |

## How the set is selected

1. Run all six core checks.
2. Add coverage checks for every touched module; all bootstrap modules are currently Partial.
3. Add cross-cutting checks for public contracts, auth/security, async/realtime behavior, build/release, or higher-autonomy work.

## Output

- Produce a draft compliance matrix, severity-sorted findings, and Pass / Pass-with-warnings / Blocked verdict.
- Keep local validation drafts ignored and uncommitted; a human decides whether anything is posted externally.

---

Provenance: generated_by `codex-desktop`; approved_by `pending PR approval`; updated_at `2026-08-07`.
