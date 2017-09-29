/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';
import '@ciscospark/internal-plugin-conversation';

import waitForPromise from '../../../lib/wait-for-promise';
import {elements, switchToMessage} from '../../../lib/test-helpers/space-widget/main';
import {clearEventLog, getEventLog} from '../../../lib/events';
import {sendMessage, verifyMessageReceipt} from '../../../lib/test-helpers/space-widget/messaging';

describe(`Widget Space: Group Space: TAP`, () => {
  const browserLocal = browser.select(`browserLocal`);
  const browserRemote = browser.select(`browserRemote`);
  let docbrown, lorraine, marty;
  let conversation, local, remote;

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
    local = {browser: browserLocal, user: marty, displayName: conversation.displayName};
    local.browser.execute((localAccessToken, spaceId) => {
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
    local.browser.waitForVisible(spaceWidget);
  });

  before(`inject docbrown token`, () => {
    remote = {browser: browserRemote, user: docbrown, displayName: conversation.displayName};
    remote.browser.execute((localAccessToken, spaceId) => {
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
    remote.browser.waitForVisible(spaceWidget);
  });

  it(`loads the test page`, () => {
    const title = local.browser.getTitle();
    assert.equal(title, `Widget Space Production Test`);
  });

  describe(`Activity Menu`, () => {
    it(`has a menu button`, () => {
      assert.isTrue(local.browser.isVisible(elements.menuButton));
    });

    it(`displays the menu when clicking the menu button`, () => {
      local.browser.click(elements.menuButton);
      local.browser.waitForVisible(elements.activityMenu);
    });

    it(`has an exit menu button`, () => {
      assert.isTrue(local.browser.isVisible(elements.activityMenu));
      local.browser.waitForVisible(elements.exitButton);
    });

    it(`closes the menu with the exit button`, () => {
      local.browser.click(elements.exitButton);
      local.browser.waitForVisible(elements.activityMenu, 1500, true);
    });

    it(`has a message button`, () => {
      local.browser.click(elements.menuButton);
      local.browser.element(elements.controlsContainer).element(elements.messageButton).waitForVisible();
    });

    it(`switches to message widget`, () => {
      local.browser.element(elements.controlsContainer).element(elements.messageButton).click();
      assert.isTrue(local.browser.isVisible(elements.messageWidget));
    });

  });

  describe(`messaging`, () => {
    before(`widget switches to message`, () => {
      switchToMessage(local.browser);
      switchToMessage(remote.browser);
    });

    it(`sends and receives messages`, () => {
      const martyText = `Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?`;
      const docText = `The way I see it, if you're gonna build a time machine into a car, why not do it with some style?`;
      const lorraineText = `Marty, will we ever see you again?`;
      const martyText2 = `I guarantee it.`;
      sendMessage(local, remote, martyText);
      verifyMessageReceipt(remote, local, martyText);
      clearEventLog(local.browser);
      sendMessage(remote, local, docText);
      verifyMessageReceipt(local, remote, docText);
      const remoteSendEvents = getEventLog(browserLocal);
      assert.include(remoteSendEvents, `messages:created`, `has a message created event`);
      assert.include(remoteSendEvents, `rooms:unread`, `has an unread message event`);
      clearEventLog(local.browser);
      // Send a message from a 'client'
      waitForPromise(lorraine.spark.internal.conversation.post(conversation, {
        displayName: lorraineText
      }));
      // Wait for both widgets to receive client message
      verifyMessageReceipt(local, remote, lorraineText);
      verifyMessageReceipt(remote, local, lorraineText);
      const clientSendEvents = getEventLog(local.browser);
      assert.include(clientSendEvents, `messages:created`, `has a message created event`);
      assert.include(clientSendEvents, `rooms:unread`, `has an unread message event`);
      sendMessage(local, remote, martyText2);
      verifyMessageReceipt(remote, local, martyText2);
    });
  });

});
