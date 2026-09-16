<!-- ───────────────────────────────
  Template:     Contract (per-interface)
  Template-ID:  contract
  Generates:    features/<KEY>/design/contracts/<interface>.md
  Description:  One cross-service interface — definition, error catalog, backward-compat, delivery/ordering, versioning.
  Library ver:  0.2.2
  Last updated: 2026-06-30
─────────────────────────────── -->

# Contract — <interface name>

> Start here → repo root [`AGENTS.md`](../../../../AGENTS.md) (agent entry) · router [`SPEC_INDEX.md`](../../../../ai-docs/SPEC_INDEX.md). This contract belongs to the design [`feature-design.md`](../feature-design.md); the standing catalog is [`CONTRACTS.md`](../../../../ai-docs/CONTRACTS.md). (Links relative to this file.)
> Context-efficiency: link to canonical docs — don't duplicate them. Link the canonical schema/API source when one exists; only inline a compact schema when no machine-readable source exists yet.

<!--
  Per-interface contract — one file per cross-service interface a feature adds or changes. Holds the schema
  pointer or compact schema, error catalog, and backward-compat so producer and consumers agree exactly. Save under
  features/<KEY>/design/contracts/<interface>.md; reference it from the Feature Design interface table.
  Headings are flat; sections preceded by `<!-- Include if: ... -->` are kept only when the condition holds.
  Each section comment gives Capture / Avoid / Example. Fill from real code (file path).
-->

<!-- Ownership: this file owns the full schema/error/version contract for one interface changed by the
     feature. Feature Spec owns the product-level delta; CONTRACTS.md owns the stable as-built catalog. -->

## Metadata
<!-- Capture: the interface identity — kind, change type, producer, consumers. Avoid: omitting consumers (you
     can't assess breakage). Example: "Kind: network API; Change: new; Producer: <producer>; Consumers: <consumer>." -->
| Field | Value |
|---|---|
| Interface | <name> |
| Kind | network API / event / schema / RPC |
| Change type | new / modify / remove |
| Producer | `<service/module>` |
| Consumer(s) | `<service/module(s)>` |
| Canonical schema / API source | <OpenAPI/AsyncAPI `.yaml`, `.proto`, `.graphql`, JSON Schema, SDK API report, or none yet> |
| Feature | `../feature-design.md` |
| Generated from | `contract` @ SDLC template library `0.2.2` |

## Summary
<!-- Capture: one or two sentences — what the interface is for and what's changing. Avoid: a restatement of the
     name. Example: "<Operation> endpoint; new in this feature." -->
<summary>

## Definition
<!-- Capture: the exact surface by linking the canonical schema/API source. Inline only a compact schema when
     no machine-readable source exists yet. Avoid: prose where a schema is needed or duplicating a full
     OpenAPI/AsyncAPI/proto/SDK contract. Example: "openapi.yaml#/paths/~1resource/post" or a compact JSON
     request {ids: string[] (required)} -> {results: [...]}. -->
- **Canonical source:** <schema/API link, or "none yet">
- **Inline definition if no canonical source exists:** <compact request/response or message schema>

## Error / Failure Catalog
<!-- Capture: every error the interface can return/raise + the consumer's action. Avoid: an undocumented failure
     mode. Example: "PartialFailure (207) | some items not processed | inspect per-item status." -->
| Condition | Code / signal | Meaning | Consumer action |
|---|---|---|---|

## Backward Compatibility
<!-- Capture: whether compatible + the consumer transition path if not. Avoid: a breaking change with no transition plan.
     Example: "Compatible — additive; no consumer change needed." -->
- **Compatible?** <yes/no> — <reasoning>
- **Consumer transition / deprecation:** <coexistence plan; deprecation window; version bump>

<!-- Include if: the interface has ordering, delivery, or idempotency guarantees (events/messaging) -->
## Delivery & Ordering Guarantees
<!-- Capture: at-least-once/exactly-once, ordering, idempotency key, replay behavior. Avoid: leaving delivery
     semantics implicit. Example: "at-least-once; idempotency key = itemId+batchId; safe to replay." -->
- <delivery / ordering / idempotency>

<!-- Include if: the interface is versioned -->
## Versioning
<!-- Capture: the version scheme + how producer/consumers negotiate it. Avoid: changing a version with no
     negotiation path. Example: "URI version /v2; v1 supported for one release." -->
- <version scheme; negotiation>

## Validation
<!-- Capture: how conformance is checked (contract test / schema validation / consumer-driven contract) + where
     it runs. Avoid: shipping a contract with no test. Example: "consumer-driven contract test in CI." -->
- <test/scheme + where it runs in CI>

## References
- Feature design: `../feature-design.md` · Standing catalog: [`CONTRACTS.md`](../../../../ai-docs/CONTRACTS.md) · Owning module spec: <module spec path> · Baseline: `.sdd/manifest.json`
