<!-- ───────────────────────────────
  Template:     ADR (example)
  Template-ID:  adr
  Generates:    ai-docs/adr/0002-reconcile-existing-documentation.md
  Description:  Standing architecture decision record — context, decision, alternatives rejected, consequences.
  Library ver:  0.2.1
  Last updated: 2026-06-30
─────────────────────────────── -->

# ADR-0002 — Reconcile existing documentation without replacement

> Navigation: [`AGENTS.md`](../../AGENTS.md) · [`SPEC_INDEX.md`](../SPEC_INDEX.md) · [`ARCHITECTURE.md`](../ARCHITECTURE.md).

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-22 |
| Deciders | repository owner |
| Supersedes / Superseded by | none |
| Generated from | `adr` @ SDLC template library `0.2.1` |

## Context

The root README, package READMEs, widget event guides, and journey test plan contain install, compatibility, event, and test intent, but some statements predate current packages/constants. Replacing or deleting them would discard review history; treating all of them as current would propagate drift.

## Decision

Preserve protected source documents unchanged. Reorganize supported meaning into canonical SDD sections, use current source/tests to resolve conflicts, and keep unit-level disposition in ignored source-fidelity inventories. Canonical specs do not embed full-file snapshots.

## Alternatives Considered

| Alternative | Pros | Cons | Why rejected |
|---|---|---|---|
| Keep sources separate only | No migration effort | Agents still lack a canonical, code-checked route | Does not meet root-level SDD goal |
| Move/delete old docs | One apparent source | Loses history and breaks existing links | Violates the explicit preservation requirement |
| Copy old docs verbatim into `ai-docs/` | Fast | Reproduces stale statements and wrong section shape | Fails source-fidelity and conformance rules |

## Consequences

- **Positive:** reviewed source intent remains available while canonical docs describe current behavior.
- **Negative / cost:** future edits to protected source material require another fidelity/reconciliation pass.
- **Agents must:** never overwrite protected sources as a shortcut; resolve contradictions explicitly and cite stable code/test paths.

## Revisit When

- A human owner explicitly retires a protected document and approves its link/consumer migration.
