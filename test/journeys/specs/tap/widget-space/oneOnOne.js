/* eslint-disable max-nested-callbacks */
const execSync = require('child_process').execSync;
execSync('killall -9 sc');

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';

import {elements as basicElements, switchToMeet, switchToMessage} from '../../../lib/test-helpers/space-widget/main';
import {clearEventLog, getEventLog} from '../../../lib/events';
import {sendMessage, verifyMessageReceipt} from '../../../lib/test-helpers/space-widget/messaging';
import {elements, declineIncomingCallTest, hangupDuringCallTest} from '../../../lib/test-helpers/space-widget/meet';

describe(`Widget Space: One on One: TAP`, () => {
  const browserLocal = browser.select(`browserLocal`);
  const browserRemote = browser.select(`browserRemote`);
  let local, mccoy, remote, spock;
  process.env.CISCOSPARK_SCOPE = [
    `webexsquare:get_conversation`,
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
      .url(`/production/space.html?oneOnOne`)
      .execute(() => {
        localStorage.clear();
      });
  });

  before(`create spock`, () => testUsers.create({count: 1, config: {displayName: `Mr Spock TAP`}})
    .then((users) => {
      [spock] = users;
      local = {browser: browserLocal, user: spock, displayName: spock.displayName};
    }));

  before(`create mccoy`, () => testUsers.create({count: 1, config: {displayName: `Bones Mccoy TAP`}})
    .then((users) => {
      [mccoy] = users;
      remote = {browser: browserRemote, user: mccoy, displayName: mccoy.displayName};
    }));

  before(`pause to let test users establish`, () => browser.pause(5000));

  before(`inject token for spock`, () => {
    local.browser.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          // eslint-disable-next-line object-shorthand
          window.ciscoSparkEvents.push({eventName: eventName, detail: detail});
        },
        toPersonEmail: localToUserEmail,
        initialActivity: `message`
      };
      window.openSpaceWidget(options);
    }, spock.token.access_token, mccoy.email);
    local.browser.waitForExist(`[placeholder="Send a message to ${remote.displayName}"]`, 30000);
  });

  before(`open remote widget for mccoy`, () => {
    remote.browser.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          // eslint-disable-next-line object-shorthand
          window.ciscoSparkEvents.push({eventName: eventName, detail: detail});
        },
        toPersonEmail: localToUserEmail,
        initialActivity: `message`
      };
      window.openSpaceWidget(options);
    }, mccoy.token.access_token, spock.email);
    remote.browser.waitForExist(`[placeholder="Send a message to ${local.displayName}"]`, 30000);
  });

  it(`loads the test page`, () => {
    const title = browserLocal.getTitle();
    assert.equal(title, `Widget Space Production Test`);
  });

  it(`loads the user's name`, () => {
    local.browser.waitForVisible(`h1.ciscospark-title`);
    local.browser.waitUntil(() => local.browser.getText(`h1.ciscospark-title`) !== `Loading...`);
    assert.equal(local.browser.getText(`h1.ciscospark-title`), remote.displayName);
  });

  describe(`Activity Menu`, () => {
    it(`has a menu button`, () => {
      assert.isTrue(local.browser.isVisible(basicElements.menuButton));
    });

    it(`displays the menu when clicking the menu button`, () => {
      local.browser.click(basicElements.menuButton);
      local.browser.waitForVisible(basicElements.activityMenu);
    });

    it(`has an exit menu button`, () => {
      assert.isTrue(local.browser.isVisible(basicElements.activityMenu));
      local.browser.waitForVisible(basicElements.exitButton);
    });

    it(`closes the menu with the exit button`, () => {
      local.browser.click(basicElements.exitButton);
      local.browser.waitForVisible(basicElements.activityMenu, 1500, true);
    });

    it(`has a message button`, () => {
      local.browser.click(basicElements.menuButton);
      local.browser.element(basicElements.controlsContainer).element(basicElements.messageButton).waitForVisible();
    });

    it(`switches to message widget`, () => {
      local.browser.element(basicElements.controlsContainer).element(basicElements.messageButton).click();
      assert.isTrue(local.browser.isVisible(basicElements.messageWidget));
      assert.isFalse(local.browser.isVisible(basicElements.meetWidget));
    });

    it(`has a meet button`, () => {
      local.browser.click(basicElements.menuButton);
      local.browser.element(basicElements.controlsContainer).element(basicElements.meetButton).waitForVisible();
    });

    it(`switches to meet widget`, () => {
      local.browser.element(basicElements.controlsContainer).element(basicElements.meetButton).click();
      assert.isTrue(local.browser.isVisible(basicElements.meetWidget));
      assert.isFalse(local.browser.isVisible(basicElements.messageWidget));
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
      clearEventLog(remote.browser);
      sendMessage(remote, local, response);
      verifyMessageReceipt(local, remote, response);
      const events = getEventLog(local.browser);
      const eventCreated = events.find((event) => event.eventName === `messages:created`);
      const eventUnread = events.find((event) => event.eventName === `rooms:unread`);
      assert.isDefined(eventCreated, `messages:created`, `has a message created event`);
      assert.isDefined(eventUnread, `rooms:unread`, `has an unread message event`);
    });
  });

  describe(`meet widget`, () => {
    describe(`pre call experience`, () => {
      it(`has a call button`, () => {
        switchToMeet(local.browser);
        local.browser.element(elements.meetWidget).element(elements.callButton).waitForVisible();
      });
    });

    describe(`during call experience`, () => {
      it(`can hangup in call`, () => {
        hangupDuringCallTest(local.browser, remote.browser);
      });

      it(`can decline an incoming call`, () => {
        declineIncomingCallTest(local.browser, remote.browser);
      });
    });
  });

});
