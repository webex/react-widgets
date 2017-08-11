/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';
import '@ciscospark/internal-plugin-conversation';

import waitForPromise from '../../../lib/wait-for-promise';
import {switchToMessage} from '../../../lib/test-helpers/menu';
import {clearEventLog, getEventLog} from '../../../lib/events';
import {sendMessage, verifyMessageReceipt} from '../../../lib/test-helpers/messaging';

describe(`Widget Space: Group Space: TAP`, () => {
  const browserLocal = browser.select(`browserLocal`);
  const browserRemote = browser.select(`browserRemote`);
  let docbrown, lorraine, marty;
  let conversation;

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
      .url(`/production/space.html?space`)
      .execute(() => {
        localStorage.clear();
      });
  });

  before(`create marty`, () => testUsers.create({count: 1, config: {displayName: `Marty McFly`}})
    .then((users) => {
      [marty] = users;
      marty.spark = new CiscoSpark({
        credentials: {
          authorization: marty.token
        }
      });
      return marty.spark.internal.mercury.connect();
    }));

  before(`create docbrown`, () => testUsers.create({count: 1, config: {displayName: `Emmett Brown`}})
    .then((users) => {
      [docbrown] = users;
      docbrown.spark = new CiscoSpark({
        credentials: {
          authorization: docbrown.token
        }
      });
    }));

  before(`create lorraine`, () => testUsers.create({count: 1, config: {displayName: `Lorraine Baines`}})
    .then((users) => {
      [lorraine] = users;
      lorraine.spark = new CiscoSpark({
        credentials: {
          authorization: lorraine.token
        }
      });
      return lorraine.spark.internal.mercury.connect();
    }));

  before(`pause to let test users establish`, () => browser.pause(5000));

  after(`disconnect`, () => Promise.all([
    marty.spark.internal.mercury.disconnect(),
    lorraine.spark.internal.mercury.disconnect()
  ]));

  before(`create space`, () => marty.spark.internal.conversation.create({
    displayName: `Test Widget Space`,
    participants: [marty, docbrown, lorraine]
  }).then((c) => {
    conversation = c;
    return conversation;
  }));

  before(`inject marty token`, () => {
    browserLocal.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName) => {
          window.ciscoSparkEvents.push(eventName);
        },
        spaceId
      };
      window.openSpaceWidget(options);
    }, marty.token.access_token, conversation.id);
    const spaceWidget = `.ciscospark-space-widget`;
    browserLocal.waitForVisible(spaceWidget);
  });

  before(`inject docbrown token`, () => {
    browserRemote.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName) => {
          window.ciscoSparkEvents.push(eventName);
        },
        spaceId
      };
      window.openSpaceWidget(options);
    }, docbrown.token.access_token, conversation.id);
    const spaceWidget = `.ciscospark-space-widget`;
    browserRemote.waitForVisible(spaceWidget);
  });

  it(`loads the test page`, () => {
    const title = browserLocal.getTitle();
    assert.equal(title, `Widget Space Production Test`);
  });

  describe(`Activity Menu`, () => {
    const menuButton = `button[aria-label="Main Menu"]`;
    const exitButton = `.ciscospark-activity-menu-exit button`;
    const messageButton = `button[aria-label="Message"]`;
    const activityMenu = `.ciscospark-activity-menu`;
    const controlsContainer = `.ciscospark-controls-container`;
    const messageWidget = `.ciscospark-message-wrapper`;

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
    });

  });

  describe(`messaging`, () => {
    before(`widget switches to message`, () => {
      switchToMessage(browserLocal);
      switchToMessage(browserRemote);
    });

    it(`sends and receives messages`, () => {
      const martyText = `Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?`;
      const docText = `The way I see it, if you're gonna build a time machine into a car, why not do it with some style?`;
      const lorraineText = `Marty, will we ever see you again?`;
      const martyText2 = `I guarantee it.`;
      sendMessage(browserLocal, conversation, martyText);
      verifyMessageReceipt(browserRemote, conversation, martyText);
      clearEventLog(browserLocal);
      sendMessage(browserRemote, conversation, docText);
      verifyMessageReceipt(browserLocal, conversation, docText);
      const remoteSendEvents = getEventLog(browserLocal);
      assert.include(remoteSendEvents, `messages:created`, `has a message created event`);
      assert.include(remoteSendEvents, `rooms:unread`, `has an unread message event`);
      clearEventLog(browserLocal);
      // Send a message from a 'client'
      waitForPromise(lorraine.spark.internal.conversation.post(conversation, {
        displayName: lorraineText
      }));
      // Wait for both widgets to receive client message
      verifyMessageReceipt(browserLocal, conversation, lorraineText);
      verifyMessageReceipt(browserRemote, conversation, lorraineText);
      const clientSendEvents = getEventLog(browserLocal);
      assert.include(clientSendEvents, `messages:created`, `has a message created event`);
      assert.include(clientSendEvents, `rooms:unread`, `has an unread message event`);
      sendMessage(browserLocal, conversation, martyText2);
      verifyMessageReceipt(browserRemote, conversation, martyText2);
    });
  });

});
