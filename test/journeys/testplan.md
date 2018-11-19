# Test Plan

The Webex Teams Widgets have full integration (or "journey") tests performed to validate proper behavior.

The widgets are tested via [Webdriver.io](https://webdriver.io) using devices powered by [Sauce Labs](https://saucelabs.com).

Every code change pull request (PR) is tested and verified by [Circle CI](https://circleci.com) by running the smoke test suite on the supported browsers/operating systems. Before a PR is opened, it is the responsibility of the developer to run the full suite on the widget that has changes.

## Test Suites

- Smoke Test
- Space Widget
- Recents

### Smoke Test Suite

The smoke test suite verifies basic functionality of all widgets. This suite is used for both TAP (tests against production) tests and validated merge (run on circle ci or Jenkins) builds.

#### Widget Recents Smoke Tests

- group space
  - displays a new incoming message
  - removes unread indicator when read
  - events
    - messages:created
    - rooms:unread
    - rooms:read
    - rooms:selected
    - memberships:created
    - memberships:deleted
- one on one space
  - displays a new incoming message
  - removes unread indicator when read
  - displays a new one on one
- incoming call
  - displays a call in progress button
- accessibility
  - should have no accessibility violations

#### Widget Space Smoke Tests

- Activity Menu
  - has a menu button
  - displays the menu when clicking the menu button
  - has an exit menu button
  - closes the menu with the exit button
  - has a message button
  - has a meet button
  - has a files button
  - has a roster button
  - switches to message widget
  - switches to meet widget
  - switches to files widget
  - switches to roster widget
  - roster tests
    - has a close button
    - has the total count of participants
    - has the participants listed
    - closes the people roster widget
- message widget
  - sends and receives messages
- meet widget
  - has a call button
  - can hangup in call
- accessibility
  - should have no accessibility violations

#### Multiple Widgets Smoke Tests (Recents & Space on one page)

- recents widget functionality
  - displays a new incoming message
  - removes unread indicator when read
- space widget functionality
  - messaging
    - sends and receives messages
  - meet widget
    - can hangup in call

#### Demo Page Smoke Tests (Built from widget-demo)

- space widget functionality
  - Activity Menu
    - has a menu button
    - displays the menu when clicking the menu button
    - has an exit menu button
    - closes the menu with the exit button
  - messaging
    - sends and receives messages
  - External Control
    - can send a message
    - can change current activity
    - can start a call
- recents widget
  - opens and loads recents widget

### Space Widget Suite

The space widget suite tests the functionality of the space widget in a given space. It also verifies by instantiating the widget in two separate ways: via the data-api and via the global javascript method.

#### Space Widget Primary Functionality Tests

- Widget header has to group's name
- Activity Menu
  - has a menu button
  - displays the menu when clicking the menu button
  - has a message button
  - has a meet button
  - has a people button
  - has an exit menu button
  - closes the menu with the exit button
  - has a message button
  - switches to message widget
  - has a meet button
  - switches to meet widget
- roster tests
  - has a close button
  - has the total count of participants
  - has the participants listed
  - has search for participants
  - searches and adds person to space
  - closes the people roster widget
- accessibility
  - should have no accessibility violations

#### Space Widget Messaging Tests

- sends and receives messages
- receives proper events on messages
- message actions
  - message flags
    - should be able to flag a message
    - should be able to unflag a message
  - delete message
    - should be able to delete a message from self
    - should not be able to delete a message from others
- File Transfer Tests
  - sends message with png attachment
  - verifies png-sample is in files tab
- markdown messaging
  - sends message with bold text
  - sends message with italic text
  - sends message with a blockquote
  - sends message with numbered list
  - sends message with bulleted list
  - sends message with heading 1
  - sends message with heading 2
  - sends message with heading 3
  - sends message with horizontal line
  - sends message with link
  - sends message with inline code
  - sends message with codeblock

#### Space Widget Meet Tests

- pre call experience
  - has a call button
- during call experience
  - can hangup before answer
  - can decline an incoming call
  - can hangup in call
  - has proper call event data

#### Space Widget Guest Access Tests

- sends and receives messages
- receives proper events on messages
- can hangup in call
- can decline an incoming call

#### Space Widget Startup Settings Tests

- destination type: userId
  - opens widget
  - Widget header has to user's name
- spaceActivities setting
  - displays error message for disabled initial activity
  - disables the files and meet activities
- initial activity setting: meet
  - opens meet widget
- initial activity setting: message
  - opens message widget
- start call setting
  - starts call when set to true
- legacy destination settings
  - opens message widget using legacy toPersonEmail

#### Space Widget Data API Instantiation Tests

- Message Widget Tests
  - sends and receives messages
  - receives proper events on messages
- Meet Widget Tests
  - can decline an incoming call
  - can hangup in call
- Startup Settings
  - destination type: userId
    - opens widget
  - initial activity setting: meet
    - opens meet widget
  - initial activity setting: message
    - opens message widget
  - start call setting
    - starts call when set to true
  - opens using legacy toPersonEmail

### Recents Suite

The "recents" test suite opens a recents widget and does things via the sdk that should be reflected in the recents widget. The tests are performed by instantiating the widget in two separate ways: via the data-api and via the global javascript method.

- Data API
  - group space
    - displays a new incoming message
    - removes unread indicator when read
    - displays a call button on hover
  - one on one space
    - displays a new incoming message
    - removes unread indicator when read
    - displays a new one on one
    - displays a call button on hover
  - incoming call
    - displays a call in progress button
- Global Object
  - group space
    - displays a new incoming message
    - removes unread indicator when read
    - displays a call button on hover
  - events
    - messages:created - group space
    - messages:created - one on one space
    - rooms:unread
    - rooms:read
    - rooms:selected - group space
    - rooms:selected - one on one space
    - memberships:created
    - memberships:deleted
  - one on one space
    - displays a new incoming message
    - removes unread indicator when read
    - displays a new one on one
    - displays a call button on hover
  - incoming call
    - displays a call in progress button
  - accessibility
    - should have no accessibility violations