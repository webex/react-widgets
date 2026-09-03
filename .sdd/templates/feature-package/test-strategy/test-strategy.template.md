<!-- ───────────────────────────────
  Template:     Test Strategy
  Template-ID:  test-strategy
  Generates:    features/<KEY>/test-strategy.md
  Description:  Per-feature/system test plan — use-cases→tests, contract/integration/E2E/scale/security/resiliency tiers.
  Library ver:  0.2.2
  Last updated: 2026-06-30
─────────────────────────────── -->

# Test Strategy — <feature title>

> Start here → repo root [`AGENTS.md`](../../AGENTS.md) (agent entry) · router [`SPEC_INDEX.md`](../../ai-docs/SPEC_INDEX.md) · system [`ARCHITECTURE.md`](../../ai-docs/ARCHITECTURE.md). This plan proves the spec [`feature-spec.md`](spec/feature-spec.md) + design [`feature-design.md`](design/feature-design.md). (Generated at `features/<KEY>/test-strategy.md`; links relative to that.)
> Context-efficiency: link to canonical docs — don't duplicate them; module-level unit tests live in the
> source-local module spec at `<module-path>/ai-docs/<module-name>-spec.md`.

<!--
  Per-feature/system test plan (module-level unit tests live in the source-local module spec). Headings are flat; sections
  preceded by `<!-- Include if: ... -->` are kept only when the condition holds. Each section comment gives
  Capture / Avoid / Example. Name the E2E framework from the repo's REAL test setup — never assume web/JS.
-->

## Metadata

| Field | Value |
|---|---|
| Feature / ticket key | <KEY> |
| Feature Spec | `spec/feature-spec.md` |
| Feature Design | `design/feature-design.md` |
| Generated from | `test-strategy` @ SDLC template library `0.2.2` |

## References
<!-- Capture: link the feature spec (acceptance, change class) + repo architecture. Avoid: a test plan with no
     link to what it's proving. -->
- Feature Spec: `spec/feature-spec.md` (acceptance criteria, change class)
- Repo architecture: `../../ai-docs/ARCHITECTURE.md`

## Test Config Variables
<!-- Capture: flag/config combinations that affect behavior under test. Avoid: testing only the default config.
     Example: "<featureFlag> = on/off; <dimension> = <value-a>/<value-b>." -->
| Variable | Possible values |
|---|---|

## Use Cases → Tests
<!-- Capture: every acceptance criterion → a test with a positive AND a negative case. Avoid: only the positive
     case (the negative is what catches regressions). Example: "process <limit> items (positive) | reject >limit (negative)." -->
| # | Use case / acceptance criterion | Positive case | Negative case (must NOT fire when it shouldn't) | Status |
|---|---|---|---|---|

<!-- Include if: the change affects cross-service contracts -->
## Contract Tests
<!-- Capture: the consumer/producer contract scenarios + CI stage. Avoid: shipping a contract change with no
     contract test. Example: "<operation> schema | <consumer> | <producer> | PR CI." -->
| Scenario / interface | Consumer | Producer | CI stage |
|---|---|---|---|

<!-- Include if: the change crosses service boundaries -->
## Integration Tests
<!-- Capture: cross-boundary scenarios + whether automated/in CI. Avoid: a manual-only integration check for a
     critical path. Example: "apply operation then verify event consumed downstream | automated | yes." -->
| Scenario | Suite | Automated | In CI |
|---|---|---|---|

<!-- Include if: the feature is user-visible / system-level -->
## System / E2E Tests
<!-- Capture: end-to-end scenarios + tags + CI stage. Avoid: E2E that duplicates unit coverage. Example:
     "user completes `<operation>` flow → target state reached | @smoke | nightly." -->
| Scenario | Suite | Tags | CI stage |
|---|---|---|---|

<!-- Include if: the change is perf-critical -->
## Scale / Load Tests
<!-- Capture: the load scenario + type + CI stage. Avoid: a perf claim with no load test. Example: "<limit>-item
     batch p99 < 5s | load | pre-release." -->
| Scenario | Type | CI stage |
|---|---|---|

<!-- Include if: the change touches a security surface -->
## Security Tests
<!-- Capture: the security test type + tracker. Avoid: skipping authz tests on a privileged op. Example:
     "<operation> authorization | SAST + manual authorization test | <tracker-key>." -->
| Service | Test type (pen-test / SAST / DAST) | Tracker |
|---|---|---|

<!-- Include if: the change affects availability / failure / recovery paths -->
## Resiliency Tests
<!-- Capture: the failure injected + expected behavior. Avoid: assuming dependencies never fail. Example:
     "event bus down mid-batch | partial results returned, retried on recovery." -->
| Failure injected | Expected behavior | Suite | In CI |
|---|---|---|---|

<!-- Include if: the feature warrants verification after deploy (smoke / synthetic / canary) -->
## Production / Post-Deploy Tests
<!-- Capture: the post-deploy check + signal + rollback trigger. Avoid: enabling for all users with no canary.
     Example: "canary 5% | error-rate signal | rollback if > 1%." -->
| Check | Signal it watches | Trigger (smoke / synthetic / canary) | Rollback if |
|---|---|---|---|

<!-- Include if: testing depends on another team/service/environment being ready -->
## QA Dependencies
<!-- Capture: each external dependency the testing needs + readiness. Avoid: discovering a missing test env
     late. Example: "staging bulk-data set | for load tests | not ready." -->
| Dependency (team / service / env / data) | Needed for | Ready? |
|---|---|---|

## E2E Framework & Location
<!--
  Capture: name the framework + where its tests live + tags + CI stage, read from the repo's REAL test setup.
  Avoid: defaulting to a web/JS framework when the repo isn't web. Example (service): "integration suite at
  src/test/integration/, tag @INTEGRATION, runs in the PR CI stage."
-->
- Framework: <name> · Test directory: `<path>` · Tag convention: <tags> · Runs in CI: <stage>

## Coverage Summary
<!-- Capture: per test type, the scenario count + automated/in-CI + status. Avoid: claiming coverage with no
     count. Example: "Integration | 4 | yes | yes | green." -->
| Test type | Scenarios | Automated | In CI | Status |
|---|---|---|---|---|

## Gaps / Risks
<!-- Capture: known testing gaps + impact + mitigation. Avoid: hiding a known gap. Example: "no load test for
     the eu region | risk: undetected regional latency | mitigation: add before GA." -->
| Gap | Impact | Mitigation |
|---|---|---|
