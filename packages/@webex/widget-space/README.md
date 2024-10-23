# Webex Space Widget _(@webex/widget-space)_

> The Webex Space Widget allows developers to easily incorporate Cisco Webex (formerly Cisco Spark) activities into an application.

## Table of Contents

- [Background](#background)
- [Install](#install)
  - [CDN](#cdn)
  - [Build from Source](#build-from-source)
  - [NPM *beta*](#npm)
    - [Usage with the Webex SDK](#usage-with-webex-sdk)
- [Usage](#usage)
  - [Quick Start](#quick-start)
  - [Configuration](#configuration)
  - [HTML](#html)
    - [Browser](#browser)
    - [Browser Globals](#browser-globals)
    - [Data API](#data-api)
  - [Events](#events)
  - [Answering Incoming Calls and Meetings](#incoming)
- [Browser Support](#browser-support)

## Background

This widget handles coordination between your application and the Webex APIs, and provides components of the Webex space experience without having to build all of the front end UI yourself.

Our widget is built using [React](https://github.com/facebook/react), [Redux](https://github.com/reactjs/redux), and the [Webex JavaScript SDK](https://github.com/webex/webex-js-sdk).

This widget supports:

- 1 on 1 and group space messaging
- 1 on 1 and group space video calling
- Space Roster list and @mentions
- Dialing by email address or SIP address
- Inline Markdown
- Sharing of files and documents
- Previewing and downloading of files and documents
- Flagging messages for follow up

## Install

Depending on how comfortable you are with these frameworks, there are are a number of ways you can "install" our code.

### Webex for Developers

If you haven't already, go to [Cisco Webex for Developers](https://developer.webex.com) and sign up for an account. Once you've created an account you can get your developer access token [here](https://developer.webex.com/docs/api/getting-started#accounts-and-authentication).

When you want to eventually create an integration and have your own users take advantage of the widget, you'll need to create an integration with the `spark:all` scope.

Head over to the Webex for Developers Documentation for more information about how to setup OAuth for your app: <https://developer.webex.com/docs/integrations>

### CDN

Using our CDN requires the least amount of work to get started. Add the following into your HTML file:

```html
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://code.s4d.io/widget-space/production/main.css">

<!-- Latest compiled and minified JavaScript -->
<script src="https://code.s4d.io/widget-space/production/bundle.js"></script>
```

For the latest builds that are pulled from the head of the master branch:

```html
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://code.s4d.io/widget-space/latest/main.css">

<!-- Latest compiled and minified JavaScript -->
<script src="https://code.s4d.io/widget-space/latest/bundle.js"></script>
```

### Build from Source

1. Follow these instructions to checkout and build the `react-widgets` repo <https://github.com/webex/react-widgets/blob/master/README.md>

1. To build the Space Widget, run the following from the root directory:

  ```sh
  npm run build:package widget-space
  ```

### NPM

To use the space widget within an existing React appliction, a developer can install the component directly from npm.

1. Install the module via NPM

  ```bash
  npm install --save @webex/widget-space
  ```

2. Add the following import statements

  ```js
  import SpaceWidget, {destinationTypes} from '@webex/widget-space';
  // Sass import required to style widgets
  import '@webex/widget-space/src/momentum.scss';
  ```

3. Declare and define the `WidgetSpace` properties

  ```js
    const spaceWidgetProps = {
      accessToken: 'XXXXXXXXXXXXXX',  // Required
      destinationType: destinationTypes.USERID,
      destinationId: 'YOUR_DESTINATION_USERID',
      activities: {
        files: false,
        meet: true,
        message: false,
        people: true
      },
      initialActivity: 'meet'
    }
  ```

  All of the React configurable properties are listed in the ["Configuration"](#Configuration) section.

  The `destinationTypes` object consists of the following values:
  
  ```javascript
  destinationTypes.EMAIL
  destinationTypes.USERID
  destinationTypes.SPACEID
  destinationTypes.SIP
  destinationTypes.PSTN
  ```

4. Finally, render the widget

  ```js
    <SpaceWidget {...spaceWidgetProps} />
  ```

#### Usage with Webex SDK

If you are developing an application that makes use of our [Webex SDK](https://developer.webex.com/docs/sdks/browser) in addition to the widgets, some additional configuration is needed.

In order for the Webex Space Widget to function in a project that is already using the Webex SDK via npm, the versions of the SDK must match specifically.

Any "@webex" packages that are added to your project manually need to match the versions in the widgets' [package.json](https://github.com/webex/react-widgets/blob/master/package.json) file.

## Usage

### Quick Start

If you would just like to get running immediately, follow these instructions to get a webpack-dev-server running with the widget.

1. Create a `.env` file in the root of the React project with the following lines, replacing the Xs with the appropriate value:

    ```txt
    WEBEX_ACCESS_TOKEN=XXXXXXXXXXXXXXX
    SPACE_ID=XXXXXXXXXXXXXXX
    TO_PERSON_EMAIL=XXXXX@XXXXXXXXX
    ```
1. From the root directory run: `npm run serve:package widget-space`

### Configuration

When loading the widgets there are some configuration options you can provide:

**Authentication methods:**

| Name | Data API  | Description |
|:--|:-------|---|
| `accessToken` | `data-access-token` | Access token for the user account initiating the messaging session. <br>For testing purposes you can use a developer access token from <https://developer.webex.com>. |
| `guestToken` | `data-guest-token` | Guest Access token for the user account initiating the messaging session. <br>A guest issuer application is required to generate a guest token. <https://developer.webex.com/docs/guest-issuer>.|
| `sdkInstance` | N/A: global only feature | A [Webex SDK](https://developer.webex.com/docs/sdks/browser) instance that has already been created and authenticated.|

**Widget destination:**

| Name | Data API | Description |
|:--|:-------|---|
| `destinationId` | `data-destination-id` | Space ID/email/user id of the space you want to open. |
| `destinationType` | `data-destination-type` | Type of space destination, one of: `email`, `userId`, `spaceId`, `sip` |

**Optional configurations:**

| Name | Data API | Description |
|:--|:-------|---|
| `composerActions` | N/A: global only feature | (default: `composerActions: {attachFiles: true}`). When present and a property is set to false, that action button will be disabled in the message composer.
| `initialActivity` | `data-initial-activity` | (default: `message`) Activity view to open with the widget. Available options: <ul><li>`message`: Message view</li><li>`meet`: Meet view </li></ul>|
| `startCall` | `data-start-call` | (default: `false`) When present, widget will start in Meet view and initiate a call with the toPerson immediately. |
| `logLevel` | `data-log-level` | (default: `silent`) When present, widget will log debug information to console. This can be set to: `error`, `warn`, `debug`, `info`, `trace`, or `silent` |
| `secondaryActivitiesFullWidth` | N/A: global only feature | (default: `false`) When true, the widget's secondary activities will cover the entire main widget area. When false, only a portion of the widget will be covered.
| `spaceActivities` | N/A: global only feature | (default: `spaceActivities: {files: true, meet: true, message: true, people: true}`). When present and a property is set to false, that activity will be disabled in the activities menu. Disabling the initial activity will result in an error.
| `showSubmitButton` | N/A: global only feature | (default: `false`). When property is set to true, a submit button will be available in the message composer.
| `sendMessageOnReturnKey` | N/A: global only feature | (default: `true`). When property is set to false, the return key will not send a message when typing in the composer. This is useful if you want to allow users to insert blank lines in their messages. Setting both `sendMessageOnReturnKey` and `showSubmitButton` to `false` will result in an error.

### External Control

The space widget allows for developers to control actions and behaviors via properties. These properties, when set, will make the widget perform certain actions, like switching to different activities.

**Note:** these actions are triggered by the properties changing from empty to populated. This means to perform a second action, the property will need to be set back to empty before changing.

| Name | Description |
|:--|---|
| `setCurrentActivity` | Sets the user's current activity in the widget. Possible cases are `meet` or `message`. |

### HTML

The easiest way to get the Webex Space Widget into your web site is to add the built resources and attach data attributes to your a container.

If you're using our CDN, skip to the next section.

- Copy the resources in the `dist` directory to own project.
- Add a `<script />` tag to your page to include the `bundle.js`
- Add a `<link />` tag to include `main.css`

#### Browser

[Create an Express web application](./create-space-widget-with-server.md) to serve the Space Widget. **This is the preferred method to enable [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).**

If you're loading an HTML file directly in the browser, use Firefox or start Chrome with the *--allow-file-access-from-files* flag. **This is *not* preferred because it introduces a [security risk](https://stackoverflow.com/a/29408269/154065).**

```bash
open -a "Google Chrome" --args --allow-file-access-from-files
```

#### Browser Globals

If you need additional behaviors or need to do additional work before the widget loads, it may be useful for to programmatically instatiate the widget after the intial page loads.

```html
<div id="my-webexteams-widget" />
<script>
  var widgetEl = document.getElementById('my-webexteams-widget');
  // Init a new widget
  webex.widget(widgetEl).spaceWidget({
    accessToken: 'AN_ACCESS_TOKEN',
    destinationType: 'spaceId',
    destinationId: 'XXXXXXXXXXXXXXX'
  });
</script>
```

> `my-webexteams-widget` is an arbitrary id to illustrate one way to select the DOM element.
> But please ensure that the `widgetEl` that you pass to `webex.widget()` is a DOM element.

You can also attach to an existing widget. Currently this gives you access to [events](#events). Other functionality will be added in future releases.

``` js
var widgetEl = document.getElementById('webexteams-widget-id');
var widgetObject = webex.widget(widgetEl);
```

##### Widget Teardown

When a widget needs to be removed from the page you will want to call the `.remove()` method. This will close any network connections active and remove the widget from the DOM. You can also pass a callback as a parameter to the `.remove()` method. The method also returns a Promise that is thenable.

The returned value, `removed`, is `true` if a matching widget has been removed, and is `false` no widget was found.

``` js
// Basic remove
webex.widget(widgetEl).remove();

// With callback
webex.widget(widgetEl).remove(function(removed) {
  if (removed) {
    console.log('removed!');
  }
});

// With Promise
webex.widget(widgetEl).remove().then(function(removed) {
  if (removed) {
    console.log('removed!');
  }
});
```

> **NOTE**: If you are also using the Webex JS SDK on the same page, please be sure to load that before you load the widget scripts.

#### Data API

If you would like to embed with the widget without any additional behaviors into your page, use this data api. The `div` containing our `data-toggle` attribute must exist on the page before our JavaScript bundle loads.

Create a container where you would like to embed the widget and use the [configuration options](#configuration) to load the widget. Be sure to include `data-toggle="webex-space"`.

  ```html
  <div
    class="webexteams-widget"
    data-toggle="webex-space"
    data-access-token="AN_ACCESS_TOKEN"
    data-destination-id="XXXXXXXXXXXXXXX"
    data-destination-type="spaceId"
    />
  ```

### Events

The Space widget exposes a few events for hooking into widget functionality.
You can directly add DOM event listener like this:

``` html
<div
  class="webexteams-widget"
  data-toggle="webex-space"
  data-access-token="AN_ACCESS_TOKEN"
  data-destination-id="XXXXXXXXXXXXXXX"
  data-destination-type="spaceId"
  />
<script>
  document.getElementById('webexteams-widget').addEventListener('EVENT_NAME', function(event) {
    // Handle the event here
    console.log(event.detail);
  });
</script>
```

If you are using *browser globals*, you can provide a callback parameter that will fire whenever any event occurs. You can filter the actions using the name provided like this:

``` js
var widgetEl = document.getElementById('my-webexteams-widget');
// Init a new widget
webex.widget(widgetEl).spaceWidget({
  accessToken: 'AN_ACCESS_TOKEN',
  destinationId: 'XXXXXXXXXXXXXXX',
  destinationType: 'spaceId',
  onEvent: callback
});

function callback(name, detail) {
  if (name === 'messages:created') {
    // Perform an action if a new message has been created
  }
}
```

Or you can use the [`ampersand-events`](https://github.com/AmpersandJS/ampersand-events) API to listen to events like this:

``` js
var widgetEl = document.getElementById('webexteams-widget');
webex.widget(widgetEl).on('messages:created', function(e) {
  console.log(e.detail);
});
```

All available events are outlined in our [events guide](./events.md).

### Answering Incoming Calls and Meetings <a id="incoming"></a>

In order to answer an incoming call you may do the following depending on what information
is available when answering the call:

- if it is a space meeting, the `spaceId`

  ```js
    webex.widget(widgetEl).spaceWidget({
      accessToken: 'AN_ACCESS_TOKEN',
      destinationType: 'spaceId',
      destiationId: 'SPACE_ID'
  });
  ```

- a `call` object provided by the `calls:created` event from the [`recents widget`](../widget-recents/events.md#callscreated) (use this for incoming pstn and sip calls):

  ```js
    webex.widget(widgetEl).spaceWidget({
      accessToken: 'AN_ACCESS_TOKEN',
      call: callObject
    });
  ```

## Browser Support

This widget has been tested on the following browsers for messaging and meeting:

- Current release of Chrome
- Current release of Firefox

## More Examples

[Webex Spark Widgets Samples](https://github.com/CiscoDevNet/widget-samples)

## Contribute

Please see [CONTRIBUTING.md](../../../../CONTRIBUTING.md) for more details.

## License

&copy; 2016-2018 Cisco and/or its affiliates. All Rights Reserved.