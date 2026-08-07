<!-- ───────────────────────────────
  Template:     Getting Started
  Template-ID:  getting-started
  Generates:    ai-docs/GETTING_STARTED.md
  Description:  Clone/build/run loop, config/secrets, and multi-repo workspace layout.
  Library ver:  0.2.1
  Last updated: 2026-06-30
─────────────────────────────── -->

# Getting Started — react-widgets

> Start with root [`AGENTS.md`](../AGENTS.md), route through [`SPEC_INDEX.md`](SPEC_INDEX.md), and use this page for the local build/test loop.

## Prerequisites

- Node.js 22 LTS (`nvm use` reads `lts/jod` from `.nvmrc`) and npm; CI currently uses Node 22.22 with npm 10.
- Git and network access to npm. Webex integration credentials are required only for authenticated demos/journeys; Sauce credentials are required only for remote browser runs.

## Clone & Install

```bash
git clone https://github.com/webex/react-widgets.git
cd react-widgets
nvm use
npm install --legacy-peer-deps
```

`npm install --legacy-peer-deps` matches `.circleci/config.yml`; `CONTRIBUTING.md` also documents root `npm install`.

## Build / Run / Test

| Task | Command |
|---|---|
| Build all packages | `npm run build:all` |
| Run local Space + Recents demo | `npm start` |
| Unit tests | `npm run jest` |
| Static analysis | `npm run static-analysis` |
| Combined static analysis + Jest | `npm test` |
| Build one package bundle | `npm run build:package {package-name}` |
| Serve one package | `npm run serve:package {package-name}` |
| Browser smoke journeys | `npm run test:automation:smoke` |

## First-Run Verification

- `npm run static-analysis` must complete with no ESLint errors.
- `npm run jest` must pass the Jest suites rooted under `packages/node_modules/`.
- `npm start` should serve the widget demo at `http://localhost:8000`; authenticated widget behavior additionally requires valid Webex configuration.

## Configuration & Secrets

- Start from `.env.default` only as a key/reference list. Local `.env` may provide Webex client/token/destination values and Sauce or deployment credentials.
- Never commit populated `WEBEX_ACCESS_TOKEN`, `WEBEX_CLIENT_SECRET`, `SAUCE_ACCESS_KEY`, `NETLIFY_ACCESS_TOKEN`, npm tokens, AWS credentials, or private signing material.
- The Webex SDK/test helpers consume service URLs from environment configuration; use team-approved integration/test environments.

## Dev Environment

- `npm start` runs `npm run serve demo widget-demo` through the Babel/yargs start tooling.
- `npm run serve:package {name}` uses `scripts/webpack/webpack.dev.babel.js` and webpack-dev-server.
- Journey runs can start a local static server through `wdio.conf.js`; `SAUCE=true` switches to Sauce Labs and Sauce Connect.

## Where to Go Next

- Agent rules: `../AGENTS.md`; system shape: `ARCHITECTURE.md`; module routing: `SPEC_INDEX.md`.
- Build details: `modules/build-release-tooling-spec.md`; test setup: `modules/test-automation-spec.md`; conventions: `patterns/` and `rules/`.

---

Provenance: generated_by `codex-desktop`; approved_by `pending PR approval`; updated_at `2026-08-07`.
