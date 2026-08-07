<!-- ───────────────────────────────
  Template:     Rule (example)
  Template-ID:  rule
  Generates:    ai-docs/rules/preserve-public-entrypoints.md
  Description:  One enforceable repo rule — the rule, its rationale, how to follow it, and how it's enforced.
  Library ver:  0.2.1
  Last updated: 2026-06-30
─────────────────────────────── -->

# Rule: Preserve public entrypoints

> Navigation: [`AGENTS.md`](../../AGENTS.md) · [`SPEC_INDEX.md`](../SPEC_INDEX.md).

## Rule

Change a package `src/index.js|ts`, package `main`/`module`, widget name, data-toggle name, event string, or public prop/type only with an approved compatibility delta and synchronized contract documentation.

## Why

The repository publishes dozens of independently imported packages plus browser/CDN widgets. A seemingly local rename can break npm imports, host mounting, callbacks, or existing markup.

## How to follow

Use the exact source entrypoint and owning module spec; update `ai-docs/CONTRACTS.md`, `.sdd/manifest.json`, tests, changelog/migration guidance, and any generated artifact configuration in the same change.

## Enforced by

Review checks C1–C3, independent spec validation, Jest/journey tests where available, and release review. There is no single automated API-diff gate today.
