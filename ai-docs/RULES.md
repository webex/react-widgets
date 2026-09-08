<!-- ───────────────────────────────
  Template:     RULES
  Template-ID:  rules
  Generates:    ai-docs/RULES.md
  Description:  Enforceable do/don't beyond AGENTS — coverage, autonomy, naming, logging, errors, testing, security, drift, secrets.
  Library ver:  0.2.2
  Last updated: 2026-06-30
─────────────────────────────── -->

<!-- sdd-generated-metadata
doc_kind: standing-doc
generated_from: rules
generator_plugin: sdd-bootstrap@0.4.3
generated_by: cursor-agent
approved_by: pending PR approval
updated_at: 2026-09-08
validation_status: pass
-->


# Rules — react-widgets

> Start with root [`AGENTS.md`](../AGENTS.md), route through [`SPEC_INDEX.md`](SPEC_INDEX.md), and use detailed rules under `rules/` only when relevant.

## Coverage Map (which docs/specs to trust)

| Module | Manifest coverage state | What it means here |
|---|---|---|
| Space and messaging | Partial | High first-pass coverage; independent spec-validator Pass at `e4722152`; code cross-checking and the history promotion gate still apply. |
| Recents | Partial | High first-pass coverage; verify event names/payloads against current constants and listeners. |
| Meetings | Partial | High first-pass coverage; verify SDK lifecycle behavior and known unimplemented lifecycle branches in code. |
| Calling widgets | Partial | High first-pass coverage; verify typed adapter/component contracts and sparse tests. |
| Shared UI components | Partial | Package entrypoints are indexed; cross-check component props and adjacent tests. |
| Redux and state management | Partial | Actions/reducers are indexed; cross-check each thunk and state record before behavior changes. |
| Containers and HOCs | Partial | Entrypoints and flows are documented; cross-check wrapped-component contracts. |
| Widget runtime/auth/demos | Partial | Host/auth contracts are detailed; resolve the default-helper discrepancy before relying on that shortcut. |
| Build and release tooling | Partial | Commands and artifact flow are documented; validate CI/deployment changes against current scripts. |
| Test automation | Partial | Suites and intent are reconciled; verify environment-dependent journeys in their target environment. |

## Autonomy & Ask-First

- **May proceed:** docs-only corrections, tests for already documented behavior, and internal refactors that preserve exported contracts after an approved plan.
- **Ask first / plan + confirm:** package exports, component props, events, data/browser globals, SDK auth, state shape, destination behavior, build/publish/deploy flow, or test-policy changes.
- **Never without explicit human approval:** push, publish, deploy, delete/overwrite protected docs, rotate credentials, or intentionally break a consumer contract.

## Naming

- Published packages use the `@webex/` namespace and kebab-case package directories; legacy `@ciscospark/` names are compatibility references only.
- React component exports use PascalCase; HOCs/hooks use `withX`, `injectX`, or `useX`; Redux action constants are upper snake case with a module prefix in their string values.
- Public widget event strings use `{resource}:{event}` lowercase names such as `messages:created`; never rename a string while only changing its constant identifier.

## Logging

- Use the supplied SDK logger for product diagnostics and existing Redux logging only in non-production stores.
- Never log credentials, private message/file content, or raw call/media objects. Preserve the Recents call-object omission when enriching event logs.
- Logging rules are review-enforced; ESLint prevents stray patterns only where configured.

## Error Handling

- Async Redux/SDK operations must reject or dispatch explicit error/status actions; UI boundaries render `ErrorDisplay` or typed error states.
- Do not swallow promise failures. Where legacy code currently logs-and-continues (for example optional flags), preserve that behavior unless a spec change approves stricter propagation.
- Calling adapters/hooks must handle missing adapter functions and promise failures without leaving loading/playing/form state stuck.

## Imports / Dependencies

- Follow ESLint `import/order`: builtin, external, internal, parent, sibling, index with blank lines between groups.
- Widgets may depend on base/runtime, containers, Redux modules, and components; reusable components must not acquire widget-specific state ownership without an approved boundary change.
- Add or upgrade dependencies only at root `package.json`; verify package output externalization and Webex SDK version-family compatibility.

## Testing

- Add positive and negative unit coverage near changed package source; Jest discovers `*.test.js` under `packages/node_modules/`.
- Changes to Space/Recents host behavior, auth, calls, files, roster, accessibility, or startup options identify and run the appropriate journey suite.
- Required local gates are `npm run static-analysis` and `npm run jest`; environment-dependent WebdriverIO gaps must be reported, not silently treated as passing.

## Security

- Treat props, data attributes, SDK/realtime payloads, file/card content, and environment variables as boundary inputs.
- Never hardcode or log secrets. Preserve encrypted default flows and SRI generation; see `SECURITY.md`.

## Spec-Currency & Drift Thresholds

- Update the owning module spec, `CONTRACTS.md`/`SERVICE_STATE.md` when applicable, `SPEC_INDEX.md`, and `.sdd/manifest.json` in the same behavior-changing change.
- Drift thresholds: Specced ≤5%, Partial ≤15%, Untracked ≤25%. Promotion additionally follows `.sdd/coverage-policy.defaults.yaml`.

## Secrets Policy

- Secrets are injected by the host, `.env`, or CI secret stores. `.env` is ignored; `.env.default` contains names/default service URLs only.
- Never commit tokens, keys, client secrets, deployment credentials, private signing keys, or populated test-user data.

## Concurrency & Async

- Promise thunks and SDK event listeners must keep loading/connecting flags consistent on success and failure.
- Register realtime/media/browser listeners once and remove them on teardown; do not duplicate host events during React lifecycle updates.
- Preserve event ordering assumptions: store normalized state before consumers render or host callbacks observe the corresponding transition.

## Strict-Compliance Mode

- CI, release, SDD validation, and automated changes stop on the first Blocking contract, security, source-fidelity, conformance, or code/spec finding.
- Independent validator findings remain local drafts until a human approves publication.

## Enforcement Metadata

| Rule area | Source evidence | Severity | Owner | Verification |
|---|---|---|---|---|
| Public naming and entrypoints | `packages/node_modules/@webex/widget-space/src/index.js`, `packages/node_modules/@webex/widget-speed-dial/src/index.ts`, `packages/node_modules/@webex/widget-space/src/events.js`, `package.json` | Blocking for incompatible public changes | owning package maintainers | contract review, static analysis, relevant package tests |
| Logging and credential handling | `packages/node_modules/@webex/webex-widget-base/src/enhancers/withInitialState.js`, `packages/node_modules/@webex/widget-recents/src/events.js`, `.eslintrc.js` | Blocking for secret exposure; Important otherwise | runtime and capability maintainers | security review and static analysis |
| Async error handling | `packages/node_modules/@webex/redux-module-spaces/src/actions.js`, `packages/node_modules/@webex/widget-meetings/src/handlers/index.js` | Important; Blocking when a public operation falsely reports success | owning state/widget maintainers | positive/negative Jest coverage and relevant journeys |
| Dependency boundaries | `.eslintrc.js`, `package.json`, `scripts/utils/package.js` | Important | repository/tooling maintainers | ESLint, build-target verification, compatibility review |
| Testing and accessibility | `jest.config.json`, `wdio.conf.js`, `test/journeys/testplan.md` | Blocking for required gate failure | repository and owning module maintainers | `npm run static-analysis`, `npm run jest`, focused journey/axe suite |
| Secrets and release operations | `.gitignore`, `.circleci/config.yml`, `scripts/build/commands/sri.js` | Blocking | security and release maintainers | secret scan/review, CI release gates, no local publish/deploy verification |
| Concurrency and cleanup | `packages/node_modules/@webex/webex-widget-base/src/enhancers/withBrowserGlobals.js`, `packages/node_modules/@webex/widget-voice-mail/src/hooks/useAudio.ts`, `packages/node_modules/@webex/widget-space/src/container.js` | Important; Blocking for credential/resource leakage | owning runtime/module maintainers | lifecycle tests, listener audit, repeated mount/unmount characterization |
| Spec currency and strict compliance | `.sdd/manifest.json`, `ai-docs/REVIEW_CHECKLIST.md` | Blocking when configured thresholds or validation gates fail | repository maintainers | drift check, conformance, coverage review, independent validator |

## Maintenance

- Add a rule only when code/history shows a recurring repository constraint; defer formatting/import mechanics to ESLint.
- Cross-reference examples in `patterns/` and fuller rules in `rules/`.

---

Provenance: generated_by `codex-desktop`; approved_by `pending PR approval`; updated_at `2026-08-07`.
