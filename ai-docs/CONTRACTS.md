# Contracts Catalog — react-widgets

> Start with root [`AGENTS.md`](../AGENTS.md), route through [`SPEC_INDEX.md`](SPEC_INDEX.md), and use this as the root public-surface index. Exact declarations live at package entrypoints; `.sdd/manifest.json` carries the machine baseline.

> Read before adding or changing a package export, widget host API, event, or root command. This catalog summarizes entrypoints and links to source; it does not duplicate full prop/type declarations.

### Exported API & Types

| Contract ID | Owner module | Symbol / package surface | Signature | Stability / deprecation | Detail and definition |
|---|---|---|---|---|---|
| `rw.ui.activity-item` | shared-ui-components | `@webex/react-component-activity-item` | default React component | public semver surface | `packages/node_modules/@webex/react-component-activity-item/src/index.js` |
| `rw.ui.activity-item-base` | shared-ui-components | `@webex/react-component-activity-item-base` | default React component | public semver surface | `packages/node_modules/@webex/react-component-activity-item-base/src/index.js` |
| `rw.ui.activity-list` | shared-ui-components | `@webex/react-component-activity-list` | default component + item-type constants | public semver surface | `packages/node_modules/@webex/react-component-activity-list/src/index.js` |
| `rw.ui.activity-menu` | shared-ui-components | `@webex/react-component-activity-menu` | default React component | public semver surface | `packages/node_modules/@webex/react-component-activity-menu/src/index.js` |
| `rw.ui.activity-menu-header` | shared-ui-components | `@webex/react-component-activity-menu-header` | default React component | public semver surface | `packages/node_modules/@webex/react-component-activity-menu-header/src/index.js` |
| `rw.ui.activity-post` | shared-ui-components | `@webex/react-component-activity-post` | default React component | public semver surface | `packages/node_modules/@webex/react-component-activity-post/src/index.js` |
| `rw.ui.activity-post-action` | shared-ui-components | `@webex/react-component-activity-post-action` | default React component | public semver surface | `packages/node_modules/@webex/react-component-activity-post-action/src/index.js` |
| `rw.ui.activity-share-file` | shared-ui-components | `@webex/react-component-activity-share-file` | default React component | public semver surface | `packages/node_modules/@webex/react-component-activity-share-file/src/index.js` |
| `rw.ui.activity-share-files` | shared-ui-components | `@webex/react-component-activity-share-files` | connected default + named component | public semver surface | `packages/node_modules/@webex/react-component-activity-share-files/src/index.js` |
| `rw.ui.activity-share-thumbnail` | shared-ui-components | `@webex/react-component-activity-share-thumbnail` | default React component | public semver surface | `packages/node_modules/@webex/react-component-activity-share-thumbnail/src/index.js` |
| `rw.ui.activity-system-message` | shared-ui-components | `@webex/react-component-activity-system-message` | component + system-message verb constants | public semver surface | `packages/node_modules/@webex/react-component-activity-system-message/src/index.js` |
| `rw.ui.activity-text` | shared-ui-components | `@webex/react-component-activity-text` | default React component | public semver surface | `packages/node_modules/@webex/react-component-activity-text/src/index.js` |
| `rw.ui.adaptive-card` | shared-ui-components | `@webex/react-component-adaptive-card` | connected React component | public semver surface | `packages/node_modules/@webex/react-component-adaptive-card/src/index.js` |
| `rw.ui.add-file-button` | shared-ui-components | `@webex/react-component-add-file-button` | default React component | public semver surface | `packages/node_modules/@webex/react-component-add-file-button/src/index.js` |
| `rw.ui.audio` | shared-ui-components | `@webex/react-component-audio` | media-stream React component | public semver surface | `packages/node_modules/@webex/react-component-audio/src/index.js` |
| `rw.ui.avatar` | shared-ui-components | `@webex/react-component-avatar` | default React component | public semver surface | `packages/node_modules/@webex/react-component-avatar/src/index.js` |
| `rw.ui.badge` | shared-ui-components | `@webex/react-component-badge` | default React component | public semver surface | `packages/node_modules/@webex/react-component-badge/src/index.js` |
| `rw.ui.button` | shared-ui-components | `@webex/react-component-button` | default React component | public semver surface | `packages/node_modules/@webex/react-component-button/src/index.js` |
| `rw.ui.button-controls` | shared-ui-components | `@webex/react-component-button-controls` | default React component | public semver surface | `packages/node_modules/@webex/react-component-button-controls/src/index.js` |
| `rw.ui.call-data-activity` | shared-ui-components | `@webex/react-component-call-data-activity` | default call activity component | public semver surface | `packages/node_modules/@webex/react-component-call-data-activity/src/index.js` |
| `rw.ui.chip-base` | shared-ui-components | `@webex/react-component-chip-base` | default React component | public semver surface | `packages/node_modules/@webex/react-component-chip-base/src/index.js` |
| `rw.ui.chip-file` | shared-ui-components | `@webex/react-component-chip-file` | default React component | public semver surface | `packages/node_modules/@webex/react-component-chip-file/src/index.js` |
| `rw.ui.confirmation-modal` | shared-ui-components | `@webex/react-component-confirmation-modal` | default modal component | public semver surface | `packages/node_modules/@webex/react-component-confirmation-modal/src/index.js` |
| `rw.ui.cover` | shared-ui-components | `@webex/react-component-cover` | default React component | public semver surface | `packages/node_modules/@webex/react-component-cover/src/index.js` |
| `rw.ui.day-separator` | shared-ui-components | `@webex/react-component-day-separator` | default React component | public semver surface | `packages/node_modules/@webex/react-component-day-separator/src/index.js` |
| `rw.ui.error-display` | shared-ui-components | `@webex/react-component-error-display` | default error component | public semver surface | `packages/node_modules/@webex/react-component-error-display/src/index.js` |
| `rw.ui.file-share-display` | shared-ui-components | `@webex/react-component-file-share-display` | default React component | public semver surface | `packages/node_modules/@webex/react-component-file-share-display/src/index.js` |
| `rw.ui.file-staging-area` | shared-ui-components | `@webex/react-component-file-staging-area` | default React component | public semver surface | `packages/node_modules/@webex/react-component-file-staging-area/src/index.js` |
| `rw.ui.icon` | shared-ui-components | `@webex/react-component-icon` | default icon + `ICONS` catalog | public semver surface | `packages/node_modules/@webex/react-component-icon/src/index.js` |
| `rw.ui.incoming-call` | shared-ui-components | `@webex/react-component-incoming-call` | default call component | public semver surface | `packages/node_modules/@webex/react-component-incoming-call/src/index.js` |
| `rw.ui.join-call-button` | shared-ui-components | `@webex/react-component-join-call-button` | default React component | public semver surface | `packages/node_modules/@webex/react-component-join-call-button/src/index.js` |
| `rw.ui.list-separator` | shared-ui-components | `@webex/react-component-list-separator` | default React component | public semver surface | `packages/node_modules/@webex/react-component-list-separator/src/index.js` |
| `rw.ui.loading-screen` | shared-ui-components | `@webex/react-component-loading-screen` | default React component | public semver surface | `packages/node_modules/@webex/react-component-loading-screen/src/index.js` |
| `rw.ui.md-choiceset-input` | shared-ui-components | `@webex/react-component-md-choiceset-input` | adaptive-card input component | public semver surface | `packages/node_modules/@webex/react-component-md-choiceset-input/src/index.js` |
| `rw.ui.md-text-input` | shared-ui-components | `@webex/react-component-md-text-input` | adaptive-card input component | public semver surface | `packages/node_modules/@webex/react-component-md-text-input/src/index.js` |
| `rw.ui.md-toggle-input` | shared-ui-components | `@webex/react-component-md-toggle-input` | adaptive-card input component | public semver surface | `packages/node_modules/@webex/react-component-md-toggle-input/src/index.js` |
| `rw.ui.new-messages-separator` | shared-ui-components | `@webex/react-component-new-messages-separator` | default React component | public semver surface | `packages/node_modules/@webex/react-component-new-messages-separator/src/index.js` |
| `rw.ui.people-list` | shared-ui-components | `@webex/react-component-people-list` | default React component | public semver surface | `packages/node_modules/@webex/react-component-people-list/src/index.js` |
| `rw.ui.presence-avatar` | shared-ui-components | `@webex/react-component-presence-avatar` | default React component | public semver surface | `packages/node_modules/@webex/react-component-presence-avatar/src/index.js` |
| `rw.ui.ringtone` | shared-ui-components | `@webex/react-component-ringtone` | component + incoming/ringback constants | public semver surface | `packages/node_modules/@webex/react-component-ringtone/src/index.js` |
| `rw.ui.scroll-to-bottom` | shared-ui-components | `@webex/react-component-scroll-to-bottom-button` | default React component | public semver surface | `packages/node_modules/@webex/react-component-scroll-to-bottom-button/src/index.js` |
| `rw.ui.space-item` | shared-ui-components | `@webex/react-component-space-item` | default React component | public semver surface | `packages/node_modules/@webex/react-component-space-item/src/index.js` |
| `rw.ui.spaces-list` | shared-ui-components | `@webex/react-component-spaces-list` | default React component | public semver surface | `packages/node_modules/@webex/react-component-spaces-list/src/index.js` |
| `rw.ui.spark-fonts` | shared-ui-components | `@webex/react-component-spark-fonts` | font stylesheet side-effect entry | public semver surface | `packages/node_modules/@webex/react-component-spark-fonts/src/index.js` |
| `rw.ui.spark-logo` | shared-ui-components | `@webex/react-component-spark-logo` | default logo component | public semver surface | `packages/node_modules/@webex/react-component-spark-logo/src/index.js` |
| `rw.ui.spark-oauth` | shared-ui-components | `@webex/react-component-spark-oauth` | default OAuth UI component | public semver surface; legacy name | `packages/node_modules/@webex/react-component-spark-oauth/src/index.js` |
| `rw.ui.spinner` | shared-ui-components | `@webex/react-component-spinner` | default React component | public semver surface | `packages/node_modules/@webex/react-component-spinner/src/index.js` |
| `rw.ui.textarea` | shared-ui-components | `@webex/react-component-textarea` | default React component | public semver surface | `packages/node_modules/@webex/react-component-textarea/src/index.js` |
| `rw.ui.timer` | shared-ui-components | `@webex/react-component-timer` | default React component | public semver surface | `packages/node_modules/@webex/react-component-timer/src/index.js` |
| `rw.ui.title-bar` | shared-ui-components | `@webex/react-component-title-bar` | default React component | public semver surface | `packages/node_modules/@webex/react-component-title-bar/src/index.js` |
| `rw.ui.typing-avatar` | shared-ui-components | `@webex/react-component-typing-avatar` | default React component | public semver surface | `packages/node_modules/@webex/react-component-typing-avatar/src/index.js` |
| `rw.ui.typing-indicator` | shared-ui-components | `@webex/react-component-typing-indicator` | default React component | public semver surface | `packages/node_modules/@webex/react-component-typing-indicator/src/index.js` |
| `rw.ui.utils` | shared-ui-components | `@webex/react-component-utils` | named utility/constants barrel | public semver surface | `packages/node_modules/@webex/react-component-utils/src/index.js` |
| `rw.ui.video` | shared-ui-components | `@webex/react-component-video` | media-stream React component | public semver surface | `packages/node_modules/@webex/react-component-video/src/index.js` |
| `rw.container.activity-list` | containers-hooks | `@webex/react-container-activity-list` | connected default component | public semver surface | `packages/node_modules/@webex/react-container-activity-list/src/index.js` |
| `rw.container.file-downloader` | containers-hooks | `@webex/react-container-file-downloader` | default injecting HOC | public semver surface | `packages/node_modules/@webex/react-container-file-downloader/src/index.js` |
| `rw.container.message-composer` | containers-hooks | `@webex/react-container-message-composer` | component/actions/reducer barrel | public semver surface | `packages/node_modules/@webex/react-container-message-composer/src/index.js` |
| `rw.container.notifications` | containers-hooks | `@webex/react-container-notifications` | component/actions/reducer barrel | public semver surface | `packages/node_modules/@webex/react-container-notifications/src/index.js` |
| `rw.container.presence-avatar` | containers-hooks | `@webex/react-container-presence-avatar` | connected component + reducers | public semver surface | `packages/node_modules/@webex/react-container-presence-avatar/src/index.js` |
| `rw.container.read-receipts` | containers-hooks | `@webex/react-container-read-receipts` | named component + connected default | public semver surface | `packages/node_modules/@webex/react-container-read-receipts/src/index.js` |
| `rw.container.scrolling-activity` | containers-hooks | `@webex/react-container-scrolling-activity` | named component + wrapped default | public semver surface | `packages/node_modules/@webex/react-container-scrolling-activity/src/index.js` |
| `rw.hoc.conversation-mercury` | containers-hooks | `@webex/react-hoc-conversation-mercury` | default HOC factory | public semver surface | `packages/node_modules/@webex/react-hoc-conversation-mercury/src/index.js` |
| `rw.hoc.scrollable` | containers-hooks | `@webex/react-hoc-scrollable` | default HOC factory | public semver surface | `packages/node_modules/@webex/react-hoc-scrollable/src/index.js` |
| `rw.state.spark` | state-management | `@webex/react-redux-spark` | reducer/initial state + SDK injection HOC | public semver surface | `packages/node_modules/@webex/react-redux-spark/src/index.js` |
| `rw.state.spark-fixtures` | test-automation | `@webex/react-redux-spark-fixtures` | mock store/SDK fixtures | public test-helper surface | `packages/node_modules/@webex/react-redux-spark-fixtures/src/index.js` |
| `rw.state.spark-metrics` | state-management | `@webex/react-redux-spark-metrics` | reducer/events/metrics HOC | public semver surface | `packages/node_modules/@webex/react-redux-spark-metrics/src/index.js` |
| `rw.state.activities` | state-management | `@webex/redux-module-activities` | actions + reducer/initial state | public semver surface | `packages/node_modules/@webex/redux-module-activities/src/index.js` |
| `rw.state.activity` | state-management | `@webex/redux-module-activity` | actions, reducer, message helper | public semver surface | `packages/node_modules/@webex/redux-module-activity/src/index.js` |
| `rw.state.avatar` | state-management | `@webex/redux-module-avatar` | actions + reducer/initial state | public semver surface | `packages/node_modules/@webex/redux-module-avatar/src/index.js` |
| `rw.state.conversation` | state-management | `@webex/redux-module-conversation` | actions, utilities, reducer | public semver surface | `packages/node_modules/@webex/redux-module-conversation/src/index.js` |
| `rw.state.errors` | state-management | `@webex/redux-module-errors` | actions + reducer/initial state | public semver surface | `packages/node_modules/@webex/redux-module-errors/src/index.js` |
| `rw.state.features` | state-management | `@webex/redux-module-features` | reducer, constants, async feature getter | public semver surface | `packages/node_modules/@webex/redux-module-features/src/index.js` |
| `rw.state.flags` | state-management | `@webex/redux-module-flags` | actions + reducer/initial state | public semver surface | `packages/node_modules/@webex/redux-module-flags/src/index.js` |
| `rw.state.indicators` | state-management | `@webex/redux-module-indicators` | reducer, constants, typing actions | public semver surface | `packages/node_modules/@webex/redux-module-indicators/src/index.js` |
| `rw.state.media` | state-management | `@webex/redux-module-media` | actions, enhancer, reducer, call helpers | public semver surface | `packages/node_modules/@webex/redux-module-media/src/index.js` |
| `rw.state.meetings` | meetings | `@webex/redux-module-meetings` | meeting thunks, reducer, destination lookup | public semver surface | `packages/node_modules/@webex/redux-module-meetings/src/index.js` |
| `rw.state.mercury` | state-management | `@webex/redux-module-mercury` | reducer, enhancer, realtime actions | public semver surface | `packages/node_modules/@webex/redux-module-mercury/src/index.js` |
| `rw.state.presence` | state-management | `@webex/redux-module-presence` | reducer/actions + presence constants | public semver surface | `packages/node_modules/@webex/redux-module-presence/src/index.js` |
| `rw.state.search` | state-management | `@webex/redux-module-search` | reducer/constants + user search thunk | public semver surface | `packages/node_modules/@webex/redux-module-search/src/index.js` |
| `rw.state.share` | state-management | `@webex/redux-module-share` | reducer/constants + shared-file thunk | public semver surface | `packages/node_modules/@webex/redux-module-share/src/index.js` |
| `rw.state.spaces` | state-management | `@webex/redux-module-spaces` | actions + reducer/initial state | public semver surface | `packages/node_modules/@webex/redux-module-spaces/src/index.js` |
| `rw.state.teams` | state-management | `@webex/redux-module-teams` | actions + reducer/initial state | public semver surface | `packages/node_modules/@webex/redux-module-teams/src/index.js` |
| `rw.state.users` | state-management | `@webex/redux-module-users` | actions, reducer, records | public semver surface | `packages/node_modules/@webex/redux-module-users/src/index.js` |
| `rw.test.react-utils` | test-automation | `@webex/react-test-utils` | intl-aware render helpers | public test-helper surface | `packages/node_modules/@webex/react-test-utils/src/index.js` |
| `rw.runtime.sign-in` | widget-runtime-auth | `@webex/webex-sign-in-page` | named typed sign-in component | public semver surface | `packages/node_modules/@webex/webex-sign-in-page/src/index.ts` |
| `rw.runtime.base` | widget-runtime-auth | `@webex/webex-widget-base` | `constructWebexEnhancer`, default helper, selected HOCs | public semver surface; default-helper discrepancy documented | `packages/node_modules/@webex/webex-widget-base/src/index.js` |
| `rw.widget.call-history` | calling | `@webex/widget-call-history` | `CallHistoryItem`, `CallHistory`, `NoHistory`, item types | public semver surface | `packages/node_modules/@webex/widget-call-history/src/index.ts` |
| `rw.widget.files` | space-messaging | `@webex/widget-files` | default connected file widget | public semver surface | `packages/node_modules/@webex/widget-files/src/index.js` |
| `rw.widget.meet` | meetings | `@webex/widget-meet` | default widget + reducers + destination types | public semver surface | `packages/node_modules/@webex/widget-meet/src/index.js` |
| `rw.widget.meetings` | meetings | `@webex/widget-meetings` | default widget + reducers + destination types | public semver surface | `packages/node_modules/@webex/widget-meetings/src/index.js` |
| `rw.widget.message` | space-messaging | `@webex/widget-message` | default widget + reducers + destination types | public semver surface | `packages/node_modules/@webex/widget-message/src/index.js` |
| `rw.widget.number-pad` | calling | `@webex/widget-number-pad` | number pad, call buttons, contact/search/popover components | public semver surface | `packages/node_modules/@webex/widget-number-pad/src/index.ts` |
| `rw.widget.recents` | recents | `@webex/widget-recents` | default widget + reducers | public semver surface | `packages/node_modules/@webex/widget-recents/src/index.js` |
| `rw.widget.roster` | space-messaging | `@webex/widget-roster` | default connected roster widget + reducers | public semver surface | `packages/node_modules/@webex/widget-roster/src/index.js` |
| `rw.widget.space` | space-messaging | `@webex/widget-space` | default widget + events/reducers/destination types | public semver surface | `packages/node_modules/@webex/widget-space/src/index.js` |
| `rw.widget.speed-dial` | calling | `@webex/widget-speed-dial` | `SpeedDials`, `SpeedDialItem`, `SpeedDialForm`, `SpeedDialSearch`, `SpeedDialAddBanner`, and exported form/list types | public semver surface | `packages/node_modules/@webex/widget-speed-dial/src/index.ts` |
| `rw.widget.voice-mail` | calling | `@webex/widget-voice-mail` | voicemail item/playback/scrubbing components | public semver surface | `packages/node_modules/@webex/widget-voice-mail/src/index.ts` |

Internal-only package entrypoints (`private-react-component-*` and `widget-*-demo`) are indexed in their module specs but are not public npm contracts.

Capability-level aggregate IDs provide stable cross-references from module specs; the package/event rows above and below remain the exact symbol-level catalog.

| Contract ID | Owner module | Aggregate surface | Compatibility | Definition / exact members |
|---|---|---|---|---|
| `rw.ui.components` | shared-ui-components | 54 public `@webex/react-component-*` entrypoints | each entrypoint is a public semver surface | individual exact paths in the `rw.ui.*` rows above; representative: `packages/node_modules/@webex/react-component-activity-item/src/index.js`, `packages/node_modules/@webex/react-component-video/src/index.js` |
| `rw.state.modules` | state-management | public `@webex/redux-module-*` barrels | action/reducer/selector exports are public semver surfaces | individual exact paths in the `rw.state.*` rows above; representative: `packages/node_modules/@webex/redux-module-activity/src/index.js`, `packages/node_modules/@webex/redux-module-spaces/src/index.js` |
| `rw.state.sdk` | state-management | `@webex/react-redux-spark*` barrels | runtime and metrics exports are public; fixtures are test-oriented | `packages/node_modules/@webex/react-redux-spark/src/index.js`, `packages/node_modules/@webex/react-redux-spark-metrics/src/index.js`, `packages/node_modules/@webex/react-redux-spark-fixtures/src/index.js` |
| `rw.containers` | containers-hooks | seven public `@webex/react-container-*` entrypoints | each entrypoint is a public semver surface | individual exact paths in the `rw.container.*` rows above; representative: `packages/node_modules/@webex/react-container-activity-list/src/index.js`, `packages/node_modules/@webex/react-container-message-composer/src/index.js` |
| `rw.space.destinations` | space-messaging | `email`, `userId`, `spaceId`, `sip`, `pstn` where accepted | exact destination strings are stable | `packages/node_modules/@webex/widget-space/src/constants.js`, `packages/node_modules/@webex/widget-space/src/index.js` |
| `rw.space.events` | space-messaging | emitted Space/child events plus exported event constants | only events with an observed emitter are active host contracts | `packages/node_modules/@webex/widget-space/src/events.js`, `packages/node_modules/@webex/widget-meet/src/enhancers/withEventHandler.js` |
| `rw.recents.options` | recents | public PropTypes/defaults and data-API options | accepted option names are compatibility surfaces; `muteNotifications` is accepted but unused | `packages/node_modules/@webex/widget-recents/src/container.js` |
| `rw.recents.events` | recents | current Recents host event set | exact emitted strings are stable | `packages/node_modules/@webex/widget-recents/src/events.js`, `packages/node_modules/@webex/widget-recents/src/container.js`, `packages/node_modules/@webex/widget-recents/src/enhancers/listeners.js` |
| `rw.meet.events` | meetings | legacy Meet call event constants | `calls:created/connected/disconnected` are emitted; membership constants have no emitter in current source | `packages/node_modules/@webex/widget-meet/src/events.js`, `packages/node_modules/@webex/widget-meet/src/enhancers/withEventHandler.js` |

### Browser and Data APIs

| Contract ID | Owner | Surface | Purpose | Compatibility | Defined at |
|---|---|---|---|---|---|
| `rw.host.widget.select` | widget-runtime-auth | `window.webex.widget(element)` | select or create a mounted browser widget object | stable; `window.ciscospark` compatibility alias remains | `packages/node_modules/@webex/webex-widget-base/src/enhancers/withBrowserGlobals.js` |
| `rw.host.widget.mount` | widget-runtime-auth | `widget.{name}Widget(options)` | render a registered widget into the selected element | widget names/options are public | `packages/node_modules/@webex/webex-widget-base/src/enhancers/withBrowserGlobals.js` |
| `rw.host.widget.remove` | widget-runtime-auth | `widget.remove(callback?) -> Promise<boolean>` | unmount React and clear widget registry | callback and promise forms remain supported | `packages/node_modules/@webex/webex-widget-base/src/enhancers/withBrowserGlobals.js` |
| `rw.host.data-api` | widget-runtime-auth | `[data-toggle^="webex-{name}"]` + `data-*` | auto-mount widgets at DOM ready | kebab-to-camel option mapping is public | `packages/node_modules/@webex/webex-widget-base/src/enhancers/withDataAPI.js` |
| `rw.host.version` | build-release-tooling | `widgetFn.{name}.version` and widget object `.version` | expose bundle version to hosts | preserved with release metadata | `packages/node_modules/@webex/webex-widget-base/src/enhancers/withBrowserGlobals.js` |

### Events

| Contract ID | Owner module | Event | Direction | Payload detail | Delivery guarantees | Compatibility | Defined at |
|---|---|---|---|---|---|---|---|
| `rw.event.messages-created` | Space, Recents | `messages:created` | publish | message/actor/room/person/file fields | synchronous callback + DOM/ampersand dispatch after internal handling | string stable; additive payload changes only | `packages/node_modules/@webex/widget-space/src/events.js`, `packages/node_modules/@webex/widget-recents/src/events.js` |
| `rw.event.rooms-unread` | Space, Recents | `rooms:unread` | publish | room/space summary | emitted from realtime activity handling; not for current user's own message where implemented | string stable | `packages/node_modules/@webex/widget-space/src/events.js`, `packages/node_modules/@webex/widget-recents/src/events.js` |
| `rw.event.rooms-read` | Space, Recents | `rooms:read` | publish | room/space summary | emitted after read-state transition | string stable | `packages/node_modules/@webex/widget-space/src/events.js`, `packages/node_modules/@webex/widget-recents/src/events.js` |
| `rw.event.rooms-selected` | Recents | `rooms:selected` | publish | room summary; optional `action: call` | user-driven | string/action stable | `packages/node_modules/@webex/widget-recents/src/events.js` |
| `rw.event.calls-created` | Space, Recents | `calls:created` | publish | call plus available room ID | SDK/realtime driven | string stable | `packages/node_modules/@webex/widget-space/src/events.js`, `packages/node_modules/@webex/widget-recents/src/events.js`, `packages/node_modules/@webex/widget-meet/src/enhancers/withEventHandler.js` |
| `rw.event.calls-connected` | Space | `calls:connected` | publish | call lifecycle data | SDK event driven | string stable | `packages/node_modules/@webex/widget-space/src/events.js` |
| `rw.event.calls-disconnected` | Space | `calls:disconnected` | publish | call lifecycle data | SDK event driven | string stable | `packages/node_modules/@webex/widget-space/src/events.js` |
| `rw.event.activity-changed` | Space | `activity:changed` | publish | selected activity | user/external-control driven | string stable | `packages/node_modules/@webex/widget-space/src/events.js` |
| `rw.event.memberships-created` | Recents | `memberships:created` | publish | membership/actor/room/person data | Mercury driven | string stable | `packages/node_modules/@webex/widget-recents/src/events.js` |
| `rw.event.memberships-deleted` | Recents | `memberships:deleted` | publish | membership/actor/room/person data | Mercury driven | string stable | `packages/node_modules/@webex/widget-recents/src/events.js` |
| `rw.event.add-clicked` | Recents | `add:clicked` | publish | empty object | user-driven; option-gated | string stable | `packages/node_modules/@webex/widget-recents/src/events.js` |
| `rw.event.profile-clicked` | Recents | `profile:clicked` | publish | current-user profile/avatar data | user-driven; option-gated | string stable | `packages/node_modules/@webex/widget-recents/src/events.js` |
| `rw.event.signout-clicked` | Recents | `user_signout:clicked` | publish | empty object | user-driven; option-gated | string stable | `packages/node_modules/@webex/widget-recents/src/events.js` |

`packages/node_modules/@webex/widget-space/src/events.js` declares `calls:memberships:*` constants, and `packages/node_modules/@webex/widget-meet/src/events.js` declares unprefixed `memberships:*` constants. No publisher for those membership constants was found in current Space/Meet/Message source, so they are definition-only compatibility evidence and are excluded from the active event table.

Legacy event guides also describe notification and mention events that are not present in the current Space/Recents event constant sets. They remain protected historical sources, not current contracts.

### Commands & Flags

| Contract ID | Owner | Command | Args / flags | Exit behavior | Compatibility | Defined at |
|---|---|---|---|---|---|---|
| `rw.cmd.install` | build-release-tooling | `npm install --legacy-peer-deps` | lockfile and legacy-peer resolution | nonzero on install error | CI dependency-install surface | `.circleci/config.yml` |
| `rw.cmd.build` | build-release-tooling | `npm run build {target}` | yargs target and command-specific args | nonzero on build error | root script surface | `package.json`, `scripts/build/index.js` |
| `rw.cmd.build-all` | build-release-tooling | `npm run build:all` | none | nonzero if a package build fails | root script surface | `package.json` |
| `rw.cmd.build-package` | build-release-tooling | `npm run build:package {name}` | package name | nonzero on unknown/build failure | root script surface | `package.json`, `scripts/build/commands/dist.js` |
| `rw.cmd.build-widgets` | build-release-tooling | `npm run build:widgets` | none | nonzero on widget build failure | root script surface | `scripts/build/commands/widgets.js` |
| `rw.cmd.build-journey` | build-release-tooling | `npm run build journey {path}` | target output path | nonzero on copy/build failure | browser-test artifact surface | `scripts/build/commands/journey.js` |
| `rw.cmd.serve` | build-release-tooling | `npm run serve {target}` | demo/package/samples target | nonzero on config/server failure | root script surface | `scripts/start/index.js` |
| `rw.cmd.start` | build-release-tooling | `npm start` | none | serves widget demo | root script surface | `package.json` |
| `rw.cmd.jest` | test-automation | `npm run jest [-- Jest args]` | Jest selectors/options | Jest exit code | root test surface | `package.json`, `jest.config.json` |
| `rw.cmd.static-analysis` | test-automation | `npm run static-analysis` | none | ESLint exit code | required gate | `package.json`, `.eslintrc.js` |
| `rw.cmd.journeys` | test-automation | `npm run test:automation[:smoke|:space|:recents]` | environment selects browser/Sauce | WebdriverIO exit code | environment-dependent | `package.json`, `wdio.conf.js` |
| `rw.cmd.tap` | test-automation | `npm run test:tap`, `npm run test:integration` | environment/target selection | WebdriverIO exit code | production/integration validation surface | `package.json`, `wdio.conf.js` |
| `rw.cmd.publish` | build-release-tooling | `npm run publish:components` | CI/registry environment | nonzero on build/publish failure | protected release operation | `package.json`, `scripts/utils/publish.js` |
| `rw.cmd.release` | build-release-tooling | `npm run release` | standard-version args | nonzero on version/changelog failure | Conventional Commits | `package.json` |

## Requires — what this repo depends on

| Dependency | What is consumed | Detail | Availability assumption | Fallback | Version floor |
|---|---|---|---|---|---|
| React/ReactDOM | component/rendering contract | `package.json` | host/build provides compatible runtime | none | `^16.8.4` |
| Webex SDK plugin family | auth, rooms, people, conversations, Mercury, meetings, teams, search, flags, metrics | `package.json` | network and valid credentials available for live behavior | loading/error UI; supplied SDK instance supported | `^2.60.4` family |
| Momentum UI / Webex Components | visual and calling component primitives | `package.json` | package resolution and compatible styles | none | pinned root versions |
| Browser DOM/media APIs | mount/events/audio/video/notifications/storage | module source | supported browser and permissions | error/disabled states; test fakes | browser matrix in `babel.config.js` |
| npm/AWS/CDN/CI/Sauce | artifact distribution and verification | `.circleci/config.yml`, `wdio.conf.js` | authenticated CI environment | local unit/static tests only; never claim remote validation | configured CI tool versions |

## Compatibility & Deprecation Policy

- **Breaking-change rule:** removing/renaming a package export, required prop, event string/payload guarantee, browser/data API, root command, or artifact path requires an approved spec delta, consumer migration note, and compatible major/versioned rollout.
- **Deprecation:** prefer additive optional props/exports; retain `@ciscospark/*` notices and browser alias while supported, and mark replacements before removal.

## Detailed Interface Docs

- Exact package declarations live in each `packages/node_modules/@webex/{package}/src/index.js|ts` and adjacent PropTypes/TypeScript files.
- Detailed behavior, state, flow, failure modes, and tests live in `ai-docs/modules/*-spec.md`.
- Current event construction lives in Space/Recents `src/events.js`; protected event guides are reconciled source material, not a substitute for current constants.

## Maintenance

- Add/change/remove a public surface only with synchronized updates to this catalog, the owning module spec, `.sdd/manifest.json`, and native entrypoint/type/event sources.
- Keep deprecated names in `GLOSSARY.md` and current runtime state in `SERVICE_STATE.md`.

---

Provenance: generated_by `codex-desktop`; approved_by `repository owner`; updated_at `2026-07-22`.
