# Per-module docs

Per-module docs for modules, packages, services, or components inside one repository. Each module that
warrants documentation gets one canonical spec:

## Use This Template

Use `module-spec.template.md` when a module needs an authoritative spec or a better Partial spec.
The generated file is what future engineering work reads before changing that module.

| Template | Generates | Purpose · when to use |
|---|---|---|
| `module-spec.template.md` | `<module-path>/ai-docs/<module-name>-spec.md` by default | Canonical module spec — orientation, requirements, data flow, sequence/class diagrams, use cases, business rules & invariants, concurrency, state machine, protocol/wire format, UI flow, data model, pitfalls, test approach, and coverage score metadata. Created per module during onboarding/backfill and read before modifying the module. |

- `<module-path>/ai-docs/<module-name>-spec.md` is the module documentation surface. State machine, protocol/wire format, UI
  flow, and data model details live as sections in that spec when they apply.
- `module-spec-quality.md` defines the completion check for generated module specs. It covers the
  universal sections, detailed design, data flow, sequence diagram(s), class/component relationships,
  use cases, pitfalls, error/failure paths, and module test strategy.
- Public-surface sections stay compact: summarize the endpoint/export/event, compatibility, and
  migration expectations, then link to the root `CONTRACTS.md` index row and the canonical schema or
  API detail source.
- Prefer `.yaml` for OpenAPI/AsyncAPI schemas unless the target repo already uses `.yml`; use `.proto`,
  `.graphql`, JSON Schema, or language-native SDK API outputs when those are the natural contract
  source.
- Module specs are **not** agent-entry files — the repository-level agent contract is `AGENTS.md`.

Conventions are described in `../../README.md`.
