<!-- ───────────────────────────────
  Template:     Test Index
  Template-ID:  test-index
  Generates:    ai-docs/TEST_INDEX.md
  Description:  Repo-wide test surface — tiers, commands (by role), directories, frameworks, and coverage gate — routing to where cases live.
  Library ver:  0.2.2
  Last updated: 2026-07-22
─────────────────────────────── -->

<!-- sdd-generated-metadata
doc_kind: standing-doc
generated_from: test-index
generator_plugin: sdd-bootstrap@0.4.3
generated_by: cursor-agent
approved_by: pending PR approval
updated_at: 2026-09-08
validation_status: pass
-->


# Test Index — react-widgets

> Start here → root [`AGENTS.md`](../AGENTS.md) (agent entry) · router [`SPEC_INDEX.md`](SPEC_INDEX.md) · system [`ARCHITECTURE.md`](ARCHITECTURE.md). This doc is the repo-wide map of the test surface.
> Context-efficiency: this is an INDEX, not a case list. It links to where cases live — it does not duplicate them.

## Test Surface

| Tier | Command (role) | Test directory | Framework | External deps |
|---|---|---|---|---|
| Unit | `npm run jest` | `packages/node_modules/**` (Jest remap to package `src/`) | Jest 24 | none |
| Lint / static analysis | `npm run static-analysis` | repository source | ESLint | none |
| Browser smoke | `npm run test:automation:smoke` | `test/journeys/specs/smoke/` | WebdriverIO 7 | built widget assets; local Selenium or Sauce |
| Space journeys | `npm run test:automation:space` | `test/journeys/specs/space/` | WebdriverIO 7 | Webex test users; media permissions |
| Recents journeys | `npm run test:automation:recents` | `test/journeys/specs/recents/` | WebdriverIO 7 | Webex test users; Mercury |
| TAP / integration | `npm run test:tap`, `npm run test:integration` | `test/journeys/` | WebdriverIO 7 | Sauce Labs / production-like env when `SAUCE=true` or `INTEGRATION=true` |

## Where the Cases Live

- **Unit test cases** → each module's spec, **Test-Case Strategy (module)** section (see [`SPEC_INDEX.md`](SPEC_INDEX.md) module registry).
- **Journey / smoke / TAP / accessibility cases** → [`modules/test-automation-spec.md`](modules/test-automation-spec.md) plus the protected source `test/journeys/testplan.md` (reconciled, not rewritten).
- **Per-feature system cases** → no `features/<KEY>/test-strategy.md` artifacts exist in this bootstrap; add them when a feature delta is specified.

## Coverage / Quality Gate

- Minimum: ESLint must pass (`npm run static-analysis`) · Measures: lint + Jest as `npm test` / husky pre-push · Applies to: whole repository source · Enforced in: CircleCI and local pre-push.
- Jest coverage reports may be generated locally but are not an enforced numeric gate in this brownfield repo.
- Browser journeys are environment-dependent and are not required for docs-only changes.

## QA Dependencies & Environments

- Journey suites need built static assets, Webex integration credentials, and sometimes Sauce Connect (`SAUCE=true`).
- Unit tests remap `@webex/*` to package `src/` and do not require a live SDK.
- Manual/QA cases are not tracked in a separate QA project; journey intent lives in `test/journeys/testplan.md`.

## Where to Go Next

- Agent entry: [`AGENTS.md`](../AGENTS.md) · System shape: [`ARCHITECTURE.md`](ARCHITECTURE.md) · Routing: [`SPEC_INDEX.md`](SPEC_INDEX.md)
- Machine source of truth: `.sdd/manifest.json` (`commands`).
- Detailed journey topology: [`modules/test-automation-spec.md`](modules/test-automation-spec.md)

---

Provenance: generated_by `codex-desktop`; approved_by `pending PR approval`; updated_at `2026-09-03`.
