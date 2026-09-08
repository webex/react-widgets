<!-- ───────────────────────────────
  Template:     Security Baseline
  Template-ID:  security
  Generates:    ai-docs/SECURITY.md
  Description:  Standing security posture — trust boundaries, authn/authz, secret handling, data classification.
  Library ver:  0.2.2
  Last updated: 2026-07-11
─────────────────────────────── -->

<!-- sdd-generated-metadata
doc_kind: standing-doc
generated_from: security
generator_plugin: sdd-bootstrap@0.4.3
generated_by: cursor-agent
approved_by: pending PR approval
updated_at: 2026-09-08
validation_status: not-run
-->


# Security Baseline — react-widgets

> Start with root [`AGENTS.md`](../AGENTS.md), [`SPEC_INDEX.md`](SPEC_INDEX.md), and [`ARCHITECTURE.md`](ARCHITECTURE.md). Read this before changing authentication, host input, SDK calls, rendered content, or deployment credentials.

## Trust Boundaries

| Boundary | Untrusted side | Trusted side | Enforced at the crossing |
|---|---|---|---|
| React widget props | embedding application | widget/runtime | PropTypes or TypeScript props; destination/setup validation; error UI for invalid state. |
| Browser/data API | DOM attributes, host callbacks, selected element | `webex-widget-base` | Element check, known widget registration, data attribute normalization, component contracts. |
| Credentials/SDK | host-supplied token, guest token, or SDK instance | SDK-backed widget state | Webex SDK auth/device setup; never treat presence of a string as authorization. |
| Realtime/network data | Webex services and Mercury events | Redux/modules/components | SDK processing, resource normalization, action/reducer boundaries, render encoding. |
| Adaptive Card/markdown/file content | message/file payloads | rendered browser UI/download | parsing helpers, supported-action checks, React rendering, file retrieval helpers. |
| CI/release environment | secret variables and external registries/cloud | build/publish/deploy scripts | CI secret injection; no credentials in tracked files or logs. |

## Authentication & Authorization Model

- **Authentication:** legacy widgets accept `accessToken`, `guestToken`, or an already authenticated SDK instance; SDK setup lives under `packages/node_modules/@webex/react-redux-spark/`.
- **Authorization:** Webex services/plugins enforce scopes and resource access. The widget repository selects SDK operations but does not implement a separate RBAC/ABAC layer.
- **Default posture:** without authenticated/registered SDK state, setup enhancers do not start resource loading or Mercury flows. Evidence: `packages/node_modules/@webex/widget-space/src/enhancers/setup.js`.

## Secret & Credential Handling

- Secrets come from the embedding host or CI/local environment, never source code.
- Runtime props inject access/guest tokens or SDK objects; `.env` supports local/test/build tooling and is ignored.
- Rotation policy is owned by the credential issuer/CI platform; this repository contains no rotation implementation.
- **Hard rule:** never commit or log tokens, client secrets, Sauce keys, npm tokens, Netlify tokens, AWS credentials, or private signing keys.

## Data Classification & Handling

| Data class | Examples | Storage rule | Logging rule | In transit |
|---|---|---|---|---|
| Credentials | access/guest tokens, client secret, service keys | host/CI memory only; no tracked files | never log | Webex/CI HTTPS mechanisms |
| User/conversation data | names, email addresses, IDs, messages, files, memberships | transient Redux/React/SDK state; remote service remains system of record | avoid payload logs; redact credentials and sensitive content | SDK-managed HTTPS/Mercury |
| Call/media data | call objects, media streams, voicemail audio | browser memory/media elements | do not serialize raw call/media objects | SDK/browser media transport |
| Build/release metadata | versions, hashes, signatures, artifact URLs | generated build/CDN manifests | safe unless paired with credentials | registry/CDN HTTPS |

## Input Validation & Output Encoding Posture

- Validate destination types/IDs, props, event payload assumptions, and adapter availability before SDK operations.
- Keep React rendering/escaping intact. Do not insert untrusted HTML except through the existing reviewed markdown/adaptive-card paths.
- Restrict file handling to SDK/file helper outputs; preserve filename/download and supported-card-action validation.

## Transport & Headers

- The library consumes Webex and deployment services over their SDK/HTTPS clients; it does not own an HTTP server or CORS policy.
- CDN hosts must preserve SRI usage and HTTPS URLs. Local demo/browser test servers are development-only and do not define production security headers.

## Session & Cookie Posture

- Production widget packages do not establish a server session or own authentication cookies.
- The private demo stores configuration, including an access token, through `react-cookie` in `packages/node_modules/@webex/widget-demo/src/components/demo-widget/index.js`; this is development-only behavior, not a secure production token-storage contract.
- Hosts must not copy demo cookie persistence into production integrations. Production credentials stay in the embedding application's approved credential lifecycle and should be supplied through an authenticated SDK instance when possible.

## Known Sensitive Areas & Accepted Risks

| Area | Risk | Mitigation / current posture | Owner |
|---|---|---|---|
| Data-attribute token configuration | Credentials can be visible in DOM/source | Prefer imported React/SDK-instance integration for sensitive hosts; never place real tokens in committed examples. | embedding application |
| Demo cookie persistence | The private demo persists its access token in a browser cookie without defining production cookie flags/rotation | Keep the demo private and development-only; clear cookies in automated journeys; never use this storage design in a production host. | widget runtime maintainers |
| Legacy browser global alias | Global mutable namespace can be modified by other scripts | Validate target element, register once with warning, and remove store entries on teardown. | widget runtime maintainers |
| Recents `basicMode` | REST loading removes end-to-end encryption behavior | Default is `false`; document and intentionally opt in. | Recents consumers |
| Legacy/default base helper discrepancy | README quick start and current implementation disagree | Treat current code as source of truth; prefer object-shaped `constructWebexEnhancer` until separately fixed and validated. | widget runtime maintainers |
| Client logging | SDK/event payloads may contain user data | Use SDK levels, omit raw call object from Recents event logs, and never log tokens. | module maintainers |

## Reporting & Review

- Authentication, rendered untrusted content, browser globals, file/media handling, dependencies, and release-secret changes require security-aware review plus static analysis and relevant tests.
- Report suspected vulnerabilities through the Webex developer support/security process; do not disclose credentials or exploit details in public issues.

---

Provenance: generated_by `codex-desktop`; approved_by `pending PR approval`; updated_at `2026-08-07`.
