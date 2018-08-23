import {assert} from 'chai';

import '@ciscospark/internal-plugin-conversation';
import '@ciscospark/plugin-logger';
import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';

import waitForPromise from '../../../lib/wait-for-promise';
import {elements, switchToMessage} from '../../../lib/test-helpers/space-widget/main';
import {clearEventLog, getEventLog} from '../../../lib/events';
import {sendMessage, verifyMessageReceipt} from '../../../lib/test-helpers/space-widget/messaging';
import {loginAndOpenWidget} from '../../../lib/test-helpers/tap/space';

describe('Widget Space: Group Space: TAP', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  let docbrown, lorraine, marty;
  let conversation, local, remote;

  before('load browsers', () => {
    browserLocal
      .url('/widget-space/production/demo/index.html?space&local')
      .execute(() => {
        localStorage.clear();
      });
    browserRemote
      .url('/widget-space/production/demo/index.html?space&remote')
      .execute(() => {
        localStorage.clear();
      });
  });

  before('create marty', () => testUsers.create({count: 1, config: {displayName: 'Marty McFly'}})
    .then((users) => {
      [marty] = users;
      marty.spark = new CiscoSpark({
        credentials: {
          authorization: marty.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return marty.spark.internal.mercury.connect();
    }));

  before('create docbrown', () => testUsers.create({count: 1, config: {displayName: 'Emmett Brown'}})
    .then((users) => {
      [docbrown] = users;
      docbrown.spark = new CiscoSpark({
        credentials: {
          authorization: docbrown.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
    }));

  before('create lorraine', () => testUsers.create({count: 1, config: {displayName: 'Lorraine Baines'}})
    .then((users) => {
      [lorraine] = users;
      lorraine.spark = new CiscoSpark({
        credentials: {
          authorization: lorraine.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return lorraine.spark.internal.mercury.connect();
    }));

  before('pause to let test users establish', () => browser.pause(5000));

  after('disconnect', () => Promise.all([
    marty.spark.internal.mercury.disconnect(),
    lorraine.spark.internal.mercury.disconnect(),
    // Demos use cookies to save state, clear before moving on
    browserLocal.deleteCookie(),
    browserRemote.deleteCookie()
  ]));

  before('create space', () => marty.spark.internal.conversation.create({
    displayName: 'Test Widget Space',
    participants: [marty, docbrown, lorraine]
  }).then((c) => {
    conversation = c;
    return conversation;
  }));

  before('inject marty token', () => {
    local = {browser: browserLocal, user: marty, displayName: conversation.displayName};
    loginAndOpenWidget(local.browser, marty.token.access_token, false, conversation.id);
    local.browser.waitForExist(`[placeholder="Send a message to ${conversation.displayName}"]`, 30000);
  });

  before('inject docbrown token', () => {
    remote = {browser: browserRemote, user: docbrown, displayName: conversation.displayName};
    loginAndOpenWidget(remote.browser, docbrown.token.access_token, false, conversation.id);
    remote.browser.waitForExist(`[placeholder="Send a message to ${conversation.displayName}"]`, 30000);
  });

  describe('Activity Menu', () => {
    it('has a menu button', () => {
      assert.isTrue(local.browser.isVisible(elements.menuButton));
    });

    it('displays the menu when clicking the menu button', () => {
      local.browser.click(elements.menuButton);
      local.browser.waitForVisible(elements.activityMenu);
    });

    it('has an exit menu button', () => {
      assert.isTrue(local.browser.isVisible(elements.activityMenu));
      local.browser.waitForVisible(elements.exitButton);
    });

    it('closes the menu with the exit button', () => {
      local.browser.click(elements.exitButton);
      local.browser.waitForVisible(elements.activityMenu, 1500, true);
    });

    it('has a message button', () => {
      local.browser.click(elements.menuButton);
      local.browser.element(elements.controlsContainer).element(elements.messageButton).waitForVisible();
    });

    it('switches to message widget', () => {
      local.browser.element(elements.controlsContainer).element(elements.messageButton).click();
      assert.isTrue(local.browser.isVisible(elements.messageWidget));
    });
  });

  describe('messaging', () => {
    before('widget switches to message', () => {
      switchToMessage(local.browser);
      switchToMessage(remote.browser);
    });

    it('sends and receives messages', () => {
      const martyText = 'Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?';
      const docText = 'The way I see it, if you\'re gonna build a time machine into a car, why not do it with some style?';
      const lorraineText = 'Marty, will we ever see you again?';
      const martyText2 = 'I guarantee it.';
      sendMessage(local, remote, martyText);
      verifyMessageReceipt(remote, local, martyText);
      clearEventLog(local.browser);
      sendMessage(remote, local, docText);
      verifyMessageReceipt(local, remote, docText);
      const remoteSendEvents = getEventLog(browserLocal);
      assert.isTrue(remoteSendEvents.some((event) => event.eventName === 'messages:created'), 'event was not seen');
      assert.isTrue(remoteSendEvents.some((event) => event.eventName === 'rooms:unread'), 'event was not seen');
      clearEventLog(local.browser);
      // Send a message from a 'client'
      waitForPromise(lorraine.spark.internal.conversation.post(conversation, {
        displayName: lorraineText
      }));
      // Wait for both widgets to receive client message
      verifyMessageReceipt(local, remote, lorraineText);
      verifyMessageReceipt(remote, local, lorraineText);
      const clientSendEvents = getEventLog(local.browser);
      assert.isTrue(clientSendEvents.some((event) => event.eventName === 'messages:created'), 'event was not seen');
      assert.isTrue(clientSendEvents.some((event) => event.eventName === 'rooms:unread'), 'event was not seen');
      sendMessage(local, remote, martyText2);
      verifyMessageReceipt(remote, local, martyText2);
    });
  });
});
