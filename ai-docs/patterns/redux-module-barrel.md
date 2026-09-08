<!-- ───────────────────────────────
  Template:     Pattern (example)
  Template-ID:  pattern
  Generates:    ai-docs/patterns/redux-module-barrel.md
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


# Pattern: Redux module barrel

> Navigation: [`AGENTS.md`](../../AGENTS.md) · [`SPEC_INDEX.md`](../SPEC_INDEX.md).

## When to use

**When to use:** exposing a legacy Redux capability package to widgets/containers.

## Correct

```js
// Shape used by packages/node_modules/@webex/redux-module-spaces/src/index.js
export * from './actions';
export {default, initialState} from './reducer';
```

## Incorrect

```js
// Consumers reach into internal files and bypass the package contract
import reducer from '@webex/redux-module-spaces/src/reducer';
```

**Why wrong:** deep imports couple consumers to internal layout and make action/reducer/export changes harder to version safely.

## Where it appears

- `packages/node_modules/@webex/redux-module-spaces/src/index.js`
- `packages/node_modules/@webex/redux-module-users/src/index.js`
- `packages/node_modules/@webex/redux-module-teams/src/index.js`
- `packages/node_modules/@webex/redux-module-conversation/src/index.js`

## Edge cases / exceptions

- Existing repository-internal deep imports are legacy exceptions; do not create new ones without a boundary rationale.
- Small modules such as features/search implement reducer/actions together in `index.js` but retain the same public concepts.
