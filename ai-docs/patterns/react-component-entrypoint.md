<!-- ───────────────────────────────
  Template:     Pattern (example)
  Template-ID:  pattern
  Generates:    ai-docs/patterns/react-component-entrypoint.md
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


# Pattern: React component entrypoint

> Navigation: [`AGENTS.md`](../../AGENTS.md) · [`SPEC_INDEX.md`](../SPEC_INDEX.md).

## When to use

**When to use:** adding or maintaining a legacy JavaScript `react-component-*` package whose public entrypoint is the component itself.

## Correct

```js
// Shape used by packages/node_modules/@webex/react-component-avatar/src/index.js
const propTypes = {/* public props */};
const defaultProps = {/* optional defaults */};

function Component(props) {/* render */}

Component.propTypes = propTypes;
Component.defaultProps = defaultProps;
export default Component;
```

## Incorrect

```js
// An untyped anonymous default with hidden defaults
export default (props) => renderSomething(props);
```

**Why wrong:** consumers/tests lose the explicit prop/default contract and debugging display identity; adjacent packages cannot follow a consistent entrypoint shape.

## Where it appears

- `packages/node_modules/@webex/react-component-avatar/src/index.js`
- `packages/node_modules/@webex/react-component-button/src/index.js`
- `packages/node_modules/@webex/react-component-error-display/src/index.js`
- `packages/node_modules/@webex/react-component-textarea/src/index.js`

## Edge cases / exceptions

- TypeScript calling components use exported interfaces/types rather than PropTypes.
- Connected components may export a named unconnected implementation and a wrapped default.
