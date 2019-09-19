import {assert} from 'chai';

import '@webex/internal-plugin-conversation';
import '@webex/plugin-logger';

import waitForPromise from '../../../lib/wait-for-promise';
import {elements, switchToMessage} from '../../../lib/test-helpers/space-widget/main';
import {clearEventLog, getEventLog} from '../../../lib/events';
import {sendMessage, verifyMessageReceipt} from '../../../lib/test-helpers/space-widget/messaging';
import loginAndOpenWidget from '../../../lib/test-helpers/tap/space';
import {createSpace, disconnectDevices, registerDevices, setupGroupTestUsers} from '../../../lib/test-users';

describe('Widget Space: Group Space: TAP', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  let docbrown, lorraine, marty;
  let conversation, local, remote, participants;

  before('load browsers', () => {
    browserLocal
      .url('/widget-demo/production/index.html?space&local')
      .execute(() => {
        localStorage.clear();
      });
    browserRemote
      .url('/widget-demo/production/index.html?space&remote')
      .execute(() => {
        localStorage.clear();
      });
  });

  before('create test users and spaces', () => {
    participants = setupGroupTestUsers();

    [docbrown, lorraine, marty] = participants;
    assert.lengthOf(participants, 3, 'Test users were not created');
    registerDevices(participants);
    conversation = createSpace({sparkInstance: marty.spark, participants, displayName: 'Test Widget Space'});
  });

  before('inject marty token', () => {
    local = {browser: browserLocal, user: marty, displayName: conversation.displayName};
    loginAndOpenWidget(local.browser, marty.token.access_token, false, conversation.hydraId);
    local.browser.waitForExist(`[placeholder="Send a message to ${conversation.displayName}"]`, 30000);
  });

  before('inject docbrown token', () => {
    remote = {browser: browserRemote, user: docbrown, displayName: conversation.displayName};
    loginAndOpenWidget(remote.browser, docbrown.token.access_token, false, conversation.hydraId);
    remote.browser.waitForExist(`[placeholder="Send a message to ${conversation.displayName}"]`, 30000);
  });

  after('disconnect', () => Promise.all([
    disconnectDevices(participants),
    // Demos use cookies to save state, clear before moving on
    browserLocal.deleteCookie(),
    browserRemote.deleteCookie()
  ]));

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
