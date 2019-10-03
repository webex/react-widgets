# react-widgets

[![CircleCI](https://img.shields.io/circleci/project/github/webex/react-widgets/master.svg)](https://circleci.com/gh/webex/react-widgets)
[![license](https://img.shields.io/github/license/webex/react-widgets.svg)](https://github.com/webex/react-widgets/blob/master/LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

> Webex Widgets for React

The Webex Widgets for React library allows developers to easily incorporate Webex functionality into an application.

## Table of Contents

- [Background](#background)
- [Widgets](#widgets)
- [Usage](#usage)
- [Install](#install)
  - [Serve from Source](#serve-from-source)
- [Version](#version)
- [Development](#development)
- [Coding Style](#coding-style)
- [Code Verification](#code-verification)
- [Contributing](#contributing)
- [License](#license)

## Background

This library allows React developers to quickly and easily create a Webex experience within their apps. Here we provide basic components (e.g. buttons, text fields, icons) that reflect the styles and aesthetics of Webex Teams, along with more complex, complete widgets, such as the Webex Space Widget.

The basic components are just presentational React <https://github.com/facebook/react> components, while our widgets leverage Redux <https://github.com/reactjs/redux> and the Webex Javascript SDK <https://github.com/webex/webex-js-sdk>.

## Widgets

While many of our components are purely presentational, some have extended functionality that provide a piece of the full Webex experience. These fully self contained elements are called `Widgets` and are available here:

- [Space Widget](./packages/node_modules/@ciscospark/widget-space)
- [Recents Widget](./packages/node_modules/@ciscospark/widget-recents)

## Usage

A functional demo of both Space and Recents widgets can be loaded by
simply running:

```sh
$ npm start
```

## Install

### Serve From Source

1. Clone this repo using a git client (e.g. `git clone https://github.com/webex/react-widgets.git`)
1. Run `npm install` from the root of the repo. You will want to run this every time you pull down any new updates.
1. From the root of the repo, run the following to serve the widgets demo:
    ```sh
    npm start
    ```
1. The widget demo will be running on http://localhost:8000

## Version

When a widget is bundled and loaded via script tag, the version number is available in the following ways:

- A comment at the top of each bundled file
- Programmatic access after a widget has been registered: `window.ciscospark.widgetFn.{widgetName}.version` (e.g. `window.ciscospark.widgetFn.spaceWidget.version`)
- Access after a widget has been instantiated: `window.ciscospark.widget({widgetEl}).version` (e.g. `window.ciscospark.widget(document.getElementById('myWidget')).version`)

## Development

- `stylelint` currently ignores all `node_modules` directories, and will not lint our packages. Discussion: <https://github.com/stylelint/stylelint/issues/2236>

## Coding Style

We follow our [Webex Web Styleguide](https://github.com/webex/web-styleguide) when developing any web based libraries and tools. Please check it out and do your best to follow our norms when contributing to this codebase.

## Code Verification

As a best practice, we provide a [Sub-resource Integrity (SRI)](https://www.w3.org/TR/SRI/) hash for all of our CDN hosted distributable files. A manifest listing all of the files with associated `integrity` hashes can be found for the latest build, where `{NAME}` is the name of the widget at `https://code.s4d.io/widget-{NAME}/production/manifest.json`.

> **Manifest Example**
>
> ``` json
> {
>   "version": "0.1.215",
>   "files": [
>      {
>        "name": "bundle.js",
>        "url": "https://code.s4d.io/widget-space/archives/0.1.120/bundle.js",
>        "signature": "kfVRBKftbb3OQ4VmYOqstb9V0abqXJzY1L0Ww/zsbiF+bGaDkgiLWqztTCh43uMsUtzEgpF0M29pr67gSlZLSOq6iUgBg9zGhiVoVqlxEUGqxdOXkeDLRTOr16KkBtAObBidWauyNOvA+6FAC71UP2yFTXIadV7z1W7tIwt+wOfGqqaBwzMCuXl1bS4Va5Fj+s2SLsRfuDrSG0gPbG499bl0v6QkWKvkYPjW4v/BffyJNFJsu2rubkPXSCEk5yU4UpOJqsQPJ+sx4s9QFgMtWbNZ+cqnBuPFPBrr5E31lOS3eJwR9Jx139ZTpcBxP19qM6zV9ategsil7w1dIN1HVbU6H/byLHTLjf39kCOsNJk6yo+B9FiD2By8wSDi4ykD6MJEH7OqOxsb49/FsgALSmJB1iIexU4xQWE3HhupEtlvv+YCQtUE0IBMVEmjauhLzJ0gBemOvzo7eMeWEsrTSSMtePS+wp9UT7uvmz7l/UIBeIuhT87YKAt0AHgE3C0pE/JOh3JofshVZ++mC1A+bjSl/+Y41mU8BclWYnGfXDwkYevzi5SxklS77eD1J/4Q+DXUkDNAR9DQe/UHZ8nrnW+GlUATwHaqhW4883p/j9zGuGEzcEQeUDHBMl23c0z3hUIXfYfhn7dExyHzTzMZQaKFD5Dl7+CgmL5V6FHY3Iw=",
>        "integrity": "sha384-3bMDdbkrYdS5m4SA7/gzkh7/G9ppEV0BVyPs2TZqbny/z9aPaw4D3DHS1+Wg9phW"
>     }
>   ]
> }
> ```

To find the SRI hash for a specific build of the widgets, you can use the following URL, replacing {VERSION} with the specific version you are looking for: `https://code.s4d.io/widget-space/archives/{VERSION}/manifest.json`.

Additionally, for those who want an additional layer of verification, a `signature` has been provided that is signed by a private key. You can use our [public key](./public-key.pem) to verify this signature. Here is example of the verification process using the nodeJS built-in `cryto` library:

``` js
const crypto = require('crypto');
function verifySignature({
  data,
  signature,
  publicKey
}) {
  // Verify that we signed correctly using public key
  const verify = crypto.createVerify('RSA-SHA384');
  verify.write(data);
  verify.end();

  // True if signature is verified
  return verify.verify(publicKey, signature, 'base64');
}
```

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for details.

## License

&copy; 2017 Cisco Systems, Inc. and/or its affiliates. All Rights Reserved.

See [LICENSE](LICENSE) for details.
