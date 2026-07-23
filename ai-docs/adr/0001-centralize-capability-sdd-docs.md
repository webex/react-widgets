# ADR-0001 — Centralize capability-grouped SDD documentation

> Navigation: [`AGENTS.md`](../../AGENTS.md) · [`SPEC_INDEX.md`](../SPEC_INDEX.md) · [`ARCHITECTURE.md`](../ARCHITECTURE.md).

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-22 |
| Deciders | repository owner |
| Supersedes / Superseded by | none |
| Generated from | `adr` @ SDLC template library `0.2.1` |

## Context

The repository contains 103 package roots under one Git/build boundary. There was no canonical `ai-docs/` tree, and package-by-package documentation would fragment behaviors that span widgets, components, containers, reducers, SDK adapters, tooling, and tests. Evidence: `package.json`, `packages/node_modules/@webex/`, `scripts/`, `test/journeys/`.

## Decision

Keep one root `AGENTS.md`, centralized standing docs under `ai-docs/`, and ten capability-grouped canonical specs under `ai-docs/modules/`. `.sdd/manifest.json` is the machine router and `ai-docs/SPEC_INDEX.md` is its human mirror.

## Alternatives Considered

| Alternative | Pros | Cons | Why rejected |
|---|---|---|---|
| One spec per package | Precise source locality | More than 100 specs; cross-package widget flows become fragmented and costly to load/update | Does not match the approved maintenance capabilities |
| Source-local capability docs | Docs near source | Capability groups span many sibling package roots; no single honest source directory owns each group | Central routing is clearer for this package forest |
| Standing docs only | Small initial footprint | Omits module flows, requirements, errors, tests, and public-surface detail | Fails rigorous SDD and coverage goals |

## Consequences

- **Positive:** future agents can load one capability spec plus focused standing docs; cross-package contracts have one owner.
- **Negative / cost:** module specs must maintain package lists and cannot rely on directory locality for discovery.
- **Agents must:** update the capability spec, indexes/contracts, and manifest together when package ownership or public behavior changes.

## Revisit When

- The repository splits into independent Git/build/release units, or a capability grows large enough to require an approved module-map change.
