<!-- ───────────────────────────────
  Template:     Rule (example)
  Template-ID:  rule
  Generates:    ai-docs/rules/clean-up-runtime-listeners.md
  Description:  One enforceable repo rule — the rule, its rationale, how to follow it, and how it's enforced.
  Library ver:  0.2.2
  Last updated: 2026-06-30
─────────────────────────────── -->

<!-- sdd-generated-metadata
doc_kind: rule
generated_from: rule
generator_plugin: sdd-bootstrap@0.4.3
generated_by: cursor-agent
approved_by: pending PR approval
updated_at: 2026-09-08
validation_status: pass
-->


# Rule: Clean up runtime listeners and mounted state

> Navigation: [`AGENTS.md`](../../AGENTS.md) · [`SPEC_INDEX.md`](../SPEC_INDEX.md).

## Rule

Every browser, SDK, media, timer, observer, or realtime listener introduced by a component/HOC must have a matching teardown path. Browser widget removal must unmount React and clear the UUID registry entry; do not assume it dispatches `REMOVE_WIDGET` or explicitly clears Redux state.

## Why

Widgets can be mounted and removed repeatedly inside a host page. Leaked listeners duplicate events, retain credentials/resource state, and produce stale UI or media behavior.

## How to follow

Follow cleanup examples in `packages/node_modules/@webex/webex-widget-base/src/enhancers/withBrowserGlobals.js`, `packages/node_modules/@webex/widget-voice-mail/src/hooks/useAudio.ts`, and `packages/node_modules/@webex/widget-number-pad/src/SearchContacts/CallSelectPopover.tsx`. Add a negative test proving callbacks stop after unmount/removal.

## Enforced by

Jest lifecycle tests and review checks C4/C5/K1; review only for integration leaks not observable in unit tests.
