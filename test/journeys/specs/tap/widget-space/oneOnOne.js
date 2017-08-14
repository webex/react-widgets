/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';

import {elements as basicElements, switchToMeet, switchToMessage} from '../../../lib/test-helpers/basic';
import {clearEventLog, getEventLog} from '../../../lib/events';
import {sendMessage, verifyMessageReceipt} from '../../../lib/test-helpers/messaging';
import {elements, call, answer, hangup, decline} from '../../../lib/test-helpers/meet';

describe(`Widget Space: One on One: TAP`, () => {
  const browserLocal = browser.select(`browserLocal`);
  const browserRemote = browser.select(`browserRemote`);
  let mccoy, spock;
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
    }));

  before(`create mccoy`, () => testUsers.create({count: 1, config: {displayName: `Bones Mccoy TAP`}})
    .then((users) => {
      [mccoy] = users;
    }));

  before(`pause to let test users establish`, () => browser.pause(5000));

  before(`inject token for spock`, () => {
    browserLocal.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName) => {
          window.ciscoSparkEvents.push(eventName);
        },
        toPersonEmail: localToUserEmail,
        initialActivity: `message`
      };
      window.openSpaceWidget(options);
    }, spock.token.access_token, mccoy.email);
    browserLocal.waitForExist(`[placeholder="Send a message to ${mccoy.displayName}"]`, 30000);
  });

  before(`open remote widget for mccoy`, () => {
    browserRemote.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName) => {
          window.ciscoSparkEvents.push(eventName);
        },
        toPersonEmail: localToUserEmail,
        initialActivity: `message`
      };
      window.openSpaceWidget(options);
    }, mccoy.token.access_token, spock.email);
    browserRemote.waitForExist(`[placeholder="Send a message to ${spock.displayName}"]`, 30000);
  });

  it(`loads the test page`, () => {
    const title = browserLocal.getTitle();
    assert.equal(title, `Widget Space Production Test`);
  });

  it(`loads the user's name`, () => {
    browserLocal.waitForVisible(`h1.ciscospark-title`);
    browserLocal.waitUntil(() => browserLocal.getText(`h1.ciscospark-title`) !== `Loading...`);
    assert.equal(browserLocal.getText(`h1.ciscospark-title`), mccoy.displayName);
  });

  describe(`Activity Menu`, () => {
    it(`has a menu button`, () => {
      assert.isTrue(browserLocal.isVisible(basicElements.menuButton));
    });

    it(`displays the menu when clicking the menu button`, () => {
      browserLocal.click(basicElements.menuButton);
      browserLocal.waitForVisible(basicElements.activityMenu);
    });

    it(`has an exit menu button`, () => {
      assert.isTrue(browserLocal.isVisible(basicElements.activityMenu));
      browserLocal.waitForVisible(basicElements.exitButton);
    });

    it(`closes the menu with the exit button`, () => {
      browserLocal.click(basicElements.exitButton);
      browserLocal.waitForVisible(basicElements.activityMenu, 1500, true);
    });

    it(`has a message button`, () => {
      browserLocal.click(basicElements.menuButton);
      browserLocal.element(basicElements.controlsContainer).element(basicElements.messageButton).waitForVisible();
    });

    it(`switches to message widget`, () => {
      browserLocal.element(basicElements.controlsContainer).element(basicElements.messageButton).click();
      assert.isTrue(browserLocal.isVisible(basicElements.messageWidget));
      assert.isFalse(browserLocal.isVisible(basicElements.meetWidget));
    });

    it(`has a meet button`, () => {
      browserLocal.click(basicElements.menuButton);
      browserLocal.element(basicElements.controlsContainer).element(basicElements.meetButton).waitForVisible();
    });

    it(`switches to meet widget`, () => {
      browserLocal.element(basicElements.controlsContainer).element(basicElements.meetButton).click();
      assert.isTrue(browserLocal.isVisible(basicElements.meetWidget));
      assert.isFalse(browserLocal.isVisible(basicElements.messageWidget));
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
      assert.include(events, `rooms:unread`, `has an unread message event`);
    });
  });

  describe(`meet widget`, () => {
    describe(`pre call experience`, () => {
      it(`has a call button`, () => {
        switchToMeet(browserLocal);
        browserLocal.element(elements.meetWidget).element(elements.callButton).waitForVisible();
      });
    });

    describe(`during call experience`, () => {
      it(`can hangup in call`, () => {
        clearEventLog(browserLocal);
        switchToMeet(browserLocal);
        call(browserLocal, browserRemote);
        answer(browserRemote);
        browserLocal.pause(5000);
        hangup(browserLocal);
        // Should switch back to message widget after hangup
        browserLocal.waitForVisible(elements.messageWidget);
        const events = getEventLog(browserLocal);
        assert.include(events, `calls:created`, `has a calls created event`);
        assert.include(events, `calls:connected`, `has a calls connected event`);
        assert.include(events, `calls:disconnected`, `has a calls disconnected event`);
        // Pausing to let locus session flush
        browserLocal.pause(10000);
      });

      it(`can decline an incoming call`, () => {
        switchToMeet(browserRemote);
        call(browserRemote, browserLocal);
        decline(browserLocal);
        browserRemote.element(elements.meetWidget).element(elements.callButton).waitForVisible();
      });
    });
  });

});
