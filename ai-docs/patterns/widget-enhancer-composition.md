<!-- ───────────────────────────────
  Template:     Pattern (example)
  Template-ID:  pattern
  Generates:    ai-docs/patterns/widget-enhancer-composition.md
  Description:  A repo convention from real code — correct vs incorrect form, with where it appears.
  Library ver:  0.2.2
  Last updated: 2026-06-30
─────────────────────────────── -->

<!-- sdd-generated-metadata
doc_kind: pattern
generated_from: pattern
generator_plugin: sdd-bootstrap@0.4.3
generated_by: cursor-agent
approved_by: pending PR approval
updated_at: 2026-09-08
validation_status: not-run
-->


# Pattern: Widget enhancer composition

> Navigation: [`AGENTS.md`](../../AGENTS.md) · [`SPEC_INDEX.md`](../SPEC_INDEX.md).

## When to use

**When to use:** creating or maintaining a legacy Webex widget that needs the shared browser/data API, Redux, SDK/auth, current-user, teardown, intl, and version behavior.

## Correct

```js
// Shape used by packages/node_modules/@webex/widget-space/src/index.js
export default compose(
  constructWebexEnhancer({name: 'space', reducers}),
  withIntl({locale: 'en', messages})
)(ConnectedWidget);
```

## Incorrect

```js
// Directly mount a widget and create an unrelated SDK/store lifecycle
export default ConnectedWidget;
```

**Why wrong:** direct export skips host registration, standard teardown, SDK state, version metadata, data attributes, and shared store composition.

## Where it appears

- `packages/node_modules/@webex/widget-space/src/index.js`
- `packages/node_modules/@webex/widget-recents/src/index.js`
- `packages/node_modules/@webex/widget-meetings/src/index.js`
- `packages/node_modules/@webex/widget-message/src/index.js`

## Edge cases / exceptions

- Newer TypeScript calling widgets expose adapter-context React components and do not use the legacy enhancer stack.
- Private demo entrypoints may mount already-enhanced widgets rather than define a new public widget.
