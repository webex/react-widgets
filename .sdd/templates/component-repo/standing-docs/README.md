# Repository-Level Templates

Standing docs generated for the component repository. `AGENTS.md` stays at the repository root for
tool auto-discovery; other standing docs default under root `ai-docs/`. These are written during onboarding and
maintained over time. They let an agent or human find the entry point, router, rules, contracts, and
domain language without guessing. `SPEC_INDEX.md` lives at `ai-docs/SPEC_INDEX.md` by default.

## Generated Order

The practical load order is:

```text
AGENTS.md
  -> ai-docs/SPEC_INDEX.md
  -> ai-docs/ARCHITECTURE.md
  -> module specs and focused standing docs as needed
```

Edit these templates only when the repo-level standing-doc shape changes. For module behavior, use
`../module-docs/`.

When generated, each standing doc should instantiate its source template in order. Keep universal
headings, apply Include-if sections from the repo profile, and fill retained sections with concrete
repo-grounded detail. Do not replace a standing doc with a short summary because the details feel
large; route detailed module behavior to source-local module specs and exact contract/schema sources.

| Template | Generates | Purpose · when to use |
|---|---|---|
| `AGENTS.template.md` | `AGENTS.md` | The agent entry contract — first file read. Commands, critical rules, boundaries, routing. Keep < ~200 lines. |
| `ARCHITECTURE.template.md` | `ai-docs/ARCHITECTURE.md` | System architecture: components + interactions + topology/ownership/caching/observability/infra (Include-if). |
| `SPEC_INDEX.template.md` | `ai-docs/SPEC_INDEX.md` | The router: which docs to load per task and the canonical module registry. Loaded second. |
| `GLOSSARY.template.md` | `ai-docs/GLOSSARY.md` | Ubiquitous language: term → definition → authoritative code location. |
| `SECURITY.template.md` | `ai-docs/SECURITY.md` | Standing security posture: trust boundaries, authn/authz, secret handling, data classification. |
| `CONTRACTS.template.md` | `ai-docs/CONTRACTS.md` | Root index of as-built public-surface contracts; detailed contracts live near owning modules or native schema sources. |
| `DATA_MODEL.template.md` | `ai-docs/DATA_MODEL.md` | Entities, system-of-record ownership, relationships, migration discipline (if the repo owns data). |
| `GETTING_STARTED.template.md` | `ai-docs/GETTING_STARTED.md` | Clone/build/run loop, config/secrets, multi-repo workspace layout. |
| `RULES.template.md` | `ai-docs/RULES.md` | Enforceable do/don't beyond AGENTS: coverage map, autonomy, naming, logging, errors, testing, drift, secrets. |
| `REVIEW_CHECKLIST.template.md` | `ai-docs/REVIEW_CHECKLIST.md` | The 6-core + 4-coverage + 3-cross-cutting review-check catalog (Review & Merge). |
| `SERVICE_STATE.template.md` | `ai-docs/SERVICE_STATE.md` | Living as-built registry — read first to avoid duplicating/breaking a surface. |
| `TEST_INDEX.template.md` | `ai-docs/TEST_INDEX.md` | Repo-wide test surface: tiers, commands by role, directories, frameworks, coverage gate — routes to where cases live (module specs + feature test strategy); does not duplicate them. |

## Contract Schema Convention

Use `CONTRACTS.md` as the repo-wide index of public surfaces. Keep exact interface schemas in the
repo's native contract format and link to them from the index and module specs.

- Prefer `.yaml` for OpenAPI and AsyncAPI files unless the target repo already standardizes on `.yml`.
- Use `.proto` for gRPC, `.graphql` for GraphQL, and JSON Schema for standalone payload schemas.
- Use language-native SDK API surfaces for SDKs, such as exported declarations, generated API reports,
  or the package entry point, instead of inventing a custom YAML contract.
- Do not paste full schemas into module specs. Module specs summarize the surface, compatibility, and
  migration rules; schema/detail files define the exact contract.

**Topology note:** in a multi-repo workspace, a workspace-level entry file may span repositories, with
this component repo's `AGENTS.md` layering beneath it.

Conventions (metadata header · navigation pointer · context-efficiency · flat headings + `Include if:`
· Capture/Avoid/Example) are described in `../../README.md`.
