/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/plugin-phone';

import {switchToMeet, switchToMessage} from '../../../lib/test-helpers/space-widget/main';
import {clearEventLog, getEventLog} from '../../../lib/events';
import {sendMessage, verifyMessageReceipt} from '../../../lib/test-helpers/space-widget/messaging';
// import {elements} from '../../../lib/test-helpers/space-widget/meet';

describe(`Widget Message Meet TAP`, () => {
  const browserLocal = browser.select(`browserLocal`);
  const browserRemote = browser.select(`browserRemote`);
  let local, mccoy, remote, spock;
  process.env.CISCOSPARK_SCOPE = [
    `webexsquare:get_conversation`,
    `Identity:SCIM`,
    `spark:people_read`,
    `spark:rooms_read`,
    `spark:rooms_write`,
    `spark:memberships_read`,
    `spark:memberships_write`,
    `spark:messages_read`,
    `spark:messages_write`,
    `spark:teams_read`,
    `spark:teams_write`,
    `spark:team_memberships_read`,
    `spark:team_memberships_write`,
    `spark:kms`
  ].join(` `);

  before(`load browsers`, () => {
    browser
      .url(`/production/message-meet.html`)
      .execute(() => {
        localStorage.clear();
      });
  });

  before(`create spock`, () => testUsers.create({count: 1, config: {displayName: `Spock TAP`}})
    .then((users) => {
      [spock] = users;
      local = {browser: browserLocal, user: spock, displayName: spock.displayName};
    }));

  before(`create mccoy`, () => testUsers.create({count: 1, config: {displayName: `Mccoy TAP`}})
    .then((users) => {
      [mccoy] = users;
      remote = {browser: browserRemote, user: mccoy, displayName: mccoy.displayName};

    }));

  before(`pause to let test users establish`, () => browser.pause(7500));

  before(`open local widget spock`, () => {
    local.browser.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName) => {
          window.ciscoSparkEvents.push(eventName);
        },
        toPersonEmail: localToUserEmail,
        initialActivity: `message`
      };
      window.openWidgetMessageMeet(options);
    }, spock.token.access_token, mccoy.email);
    local.browser.waitForVisible(`[placeholder="Send a message to ${remote.displayName}"]`, 30000);
  });

  before(`open remote widget mccoy`, () => {
    remote.browser.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName) => {
          window.ciscoSparkEvents.push(eventName);
        },
        toPersonEmail: localToUserEmail,
        initialActivity: `message`
      };
      window.openWidgetMessageMeet(options);
    }, mccoy.token.access_token, spock.email);
    remote.browser.waitForVisible(`[placeholder="Send a message to ${local.displayName}"]`, 30000);
  });

  describe(`Activity Menu`, () => {
    const menuButton = `button[aria-label="Main Menu"]`;
    const exitButton = `.ciscospark-activity-menu-exit button`;
    const messageButton = `button[aria-label="Message"]`;
    const meetButton = `button[aria-label="Call"]`;
    const activityMenu = `.ciscospark-activity-menu`;
    const controlsContainer = `.ciscospark-controls-container`;
    const messageWidget = `.ciscospark-message-component-wrapper`;
    const meetWidget = `.ciscospark-meet-component-wrapper`;
    it(`has a menu button`, () => {
      assert.isTrue(browserLocal.isVisible(menuButton));
    });

    it(`displays the menu when clicking the menu button`, () => {
      local.browser.click(menuButton);
      local.browser.waitForVisible(activityMenu);
    });

    it(`has an exit menu button`, () => {
      assert.isTrue(local.browser.isVisible(activityMenu));
      local.browser.waitForVisible(exitButton);
    });

    it(`closes the menu with the exit button`, () => {
      local.browser.click(exitButton);
      local.browser.waitForVisible(activityMenu, 1500, true);
    });

    it(`has a message button`, () => {
      local.browser.click(menuButton);
      local.browser.element(controlsContainer).element(messageButton).waitForVisible();
    });

    it(`switches to message widget`, () => {
      local.browser.element(controlsContainer).element(messageButton).click();
      assert.isTrue(local.browser.isVisible(messageWidget));
      assert.isFalse(local.browser.isVisible(meetWidget));
    });

    it(`has a meet button`, () => {
      local.browser.click(menuButton);
      local.browser.element(controlsContainer).element(meetButton).waitForVisible();
    });

    it(`switches to meet widget`, () => {
      local.browser.element(controlsContainer).element(meetButton).click();
      assert.isTrue(local.browser.isVisible(meetWidget));
      assert.isFalse(local.browser.isVisible(messageWidget));
    });

  });

  describe(`message widget`, () => {
    it(`sends and receives messages`, () => {
      const message = `Oh, I am sorry, Doctor. Were we having a good time?`;
      const response = `God, I liked him better before he died.`;
      switchToMessage(local.browser);
      sendMessage(local, remote, message);
      verifyMessageReceipt(remote, local, message);
      // Send a message back
      clearEventLog(local.browser);
      sendMessage(remote, local, response);
      verifyMessageReceipt(local, remote, response);
      const events = getEventLog(local.browser);
      assert.include(events, `messages:created`, `has a message created event`);
      assert.include(events, `messages:unread`, `has an unread message event`);
    });
  });

  describe(`meet widget`, () => {
    const meetWidget = `.ciscospark-meet-component-wrapper`;
    const messageWidget = `.ciscospark-message-component-wrapper`;
    const callButton = `button[aria-label="Call"]`;
    const answerButton = `button[aria-label="Answer"]`;
    const declineButton = `button[aria-label="Decline"]`;
    const hangupButton = `button[aria-label="Hangup"]`;
    const callControls = `.call-controls`;
    const remoteVideo = `.remote-video video`;
    it(`can answer and hangup in call`, () => {
      clearEventLog(browserLocal);
      switchToMeet(browserLocal);
      browserLocal.element(meetWidget).element(callButton).waitForVisible();
      browserLocal.element(meetWidget).element(callButton).click();
      browserRemote.waitForVisible(answerButton);
      browserRemote.element(meetWidget).element(answerButton).click();
      browserRemote.waitForVisible(remoteVideo);
      // Let call elapse 5 seconds before hanging up
      browserLocal.pause(5000);
      browserLocal.moveToObject(meetWidget);
      browserLocal.waitForVisible(callControls);
      browserLocal.moveToObject(hangupButton);
      browserLocal.element(meetWidget).element(hangupButton).click();
      // Should switch back to message widget after hangup
      browserLocal.waitForVisible(messageWidget);
    });

    it(`can decline an incoming call`, () => {
      switchToMeet(remote.browser);
      remote.browser.element(meetWidget).element(callButton).waitForVisible();
      remote.browser.element(meetWidget).element(callButton).click();
      local.browser.waitForVisible(declineButton);
      local.browser.element(meetWidget).element(declineButton).click();
      local.browser.element(meetWidget).element(callButton).waitForVisible();
      remote.browser.element(meetWidget).element(callButton).waitForVisible();
    });
  });
});
