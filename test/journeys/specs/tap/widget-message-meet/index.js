/* eslint-disable max-nested-callbacks */
import {assert} from 'chai';
import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/plugin-phone';
import {switchToMeet, switchToMessage} from '../../../lib/test-helpers/menu';
import {clearEventLog, getEventLog} from '../../../lib/events';
import {sendMessage, verifyMessageReceipt} from '../../../lib/test-helpers/messaging';
import {elements} from '../../../lib/test-helpers/meet';

describe(`Widget Message Meet TAP`, () => {
  const browserLocal = browser.select(`browserLocal`);
  const browserRemote = browser.select(`browserRemote`);
  let mccoy, spock;
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
    }));

  before(`create mccoy`, () => testUsers.create({count: 1, config: {displayName: `Mccoy TAP`}})
    .then((users) => {
      [mccoy] = users;
    }));

  before(`pause to let test users establish`, () => browser.pause(7500));

  before(`open local widget spock`, () => {
    browserLocal.execute((localAccessToken, localToUserEmail) => {
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
    browserLocal.waitForVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`, 30000);
  });

  before(`open remote widget mccoy`, () => {
    browserRemote.execute((localAccessToken, localToUserEmail) => {
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
    browserRemote.waitForVisible(`[placeholder="Send a message to ${spock.displayName}"]`, 30000);
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
      browserLocal.click(menuButton);
      browserLocal.waitForVisible(activityMenu);
    });

    it(`has an exit menu button`, () => {
      assert.isTrue(browserLocal.isVisible(activityMenu));
      browserLocal.waitForVisible(exitButton);
    });

    it(`closes the menu with the exit button`, () => {
      browserLocal.click(exitButton);
      browserLocal.waitForVisible(activityMenu, 1500, true);
    });

    it(`has a message button`, () => {
      browserLocal.click(menuButton);
      browserLocal.element(controlsContainer).element(messageButton).waitForVisible();
    });

    it(`switches to message widget`, () => {
      browserLocal.element(controlsContainer).element(messageButton).click();
      assert.isTrue(browserLocal.isVisible(messageWidget));
      assert.isFalse(browserLocal.isVisible(meetWidget));
    });

    it(`has a meet button`, () => {
      browserLocal.click(menuButton);
      browserLocal.element(controlsContainer).element(meetButton).waitForVisible();
    });

    it(`switches to meet widget`, () => {
      browserLocal.element(controlsContainer).element(meetButton).click();
      assert.isTrue(browserLocal.isVisible(meetWidget));
      assert.isFalse(browserLocal.isVisible(messageWidget));
    });

  });

  describe(`message widget`, () => {
    it(`sends and receives messages`, () => {
      const message = `Oh, I am sorry, Doctor. Were we having a good time?`;
      const response = `God, I liked him better before he died.`;
      switchToMessage(browserLocal);
      sendMessage(browserLocal, mccoy, message);
      verifyMessageReceipt(browserRemote, spock, message);
      // Send a message back
      clearEventLog(browserLocal);
      sendMessage(browserRemote, spock, response);
      verifyMessageReceipt(browserLocal, mccoy, response);
      const events = getEventLog(browserLocal);
      assert.include(events, `messages:created`, `has a message created event`);
      assert.include(events, `messages:unread`, `has an unread message event`);
    });
  });

  describe(`meet widget`, () => {
    const meetWidget = `.ciscospark-meet-component-wrapper`;
    it(`can answer and hangup in call`, () => {
      switchToMeet(browserLocal);
      browserLocal.element(meetWidget).element(elements.callButton).waitForVisible();
      browserLocal.element(meetWidget).element(elements.callButton).click();
      browserRemote.waitForVisible(elements.answerButton);
      browserRemote.element(meetWidget).element(elements.answerButton).click();
      browserRemote.waitForVisible(elements.remoteVideo);
      // Let call elapse 5 seconds before hanging up
      browserLocal.pause(5000);
      browserLocal.moveToObject(meetWidget);
      browserLocal.waitForVisible(elements.callControls);
      browserLocal.moveToObject(elements.hangupButton);
      browserLocal.element(meetWidget).element(elements.hangupButton).click();
      // Pausing to let locus session flush
      browserLocal.pause(5000);

    });

    it(`can decline an incoming call`, () => {
      switchToMeet(browserRemote);
      browserRemote.element(meetWidget).element(elements.callButton).waitForVisible();
      browserRemote.element(meetWidget).element(elements.callButton).click();
      browserLocal.waitForVisible(elements.declineButton);
      browserLocal.element(meetWidget).element(elements.declineButton).click();
      browserLocal.element(meetWidget).element(elements.callButton).waitForVisible();
      browserRemote.element(meetWidget).element(elements.callButton).waitForVisible();
    });
  });
});
