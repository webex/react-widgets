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
  let docbrown, lorraine, marty;
  let conversation, local, remote, participants;

  before('load browsers', () => {
    browserLocal.url('/widget-demo/production/index.html?space&local');
    browserLocal.execute(() => {
      localStorage.clear();
    });
    browserRemote.url('/widget-demo/production/index.html?space&remote');
    browserRemote.execute(() => {
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
    local.browser.$(`[placeholder="Send a message to ${conversation.displayName}"]`).waitForExist({
      timeout: 30000
    });
  });

  before('inject docbrown token', () => {
    remote = {browser: browserRemote, user: docbrown, displayName: conversation.displayName};
    loginAndOpenWidget(remote.browser, docbrown.token.access_token, false, conversation.hydraId);
    remote.browser.$(`[placeholder="Send a message to ${conversation.displayName}"]`).waitForExist({
      timeout: 30000
    });
  });

  before('stick widgets to bottom of viewport', () => {
    local.browser.$(elements.stickyButton).waitForDisplayed();
    local.browser.$(elements.stickyButton).click();
    remote.browser.$(elements.stickyButton).waitForDisplayed();
    remote.browser.$(elements.stickyButton).click();
  });

  after('disconnect', () => Promise.all([
    disconnectDevices(participants),
    // Demos use cookies to save state, clear before moving on
    browserLocal.deleteCookies(),
    browserRemote.deleteCookies()
  ]));

  describe('Activity Section', () => {
    it('has a message button', () => {
      local.browser
        .$(elements.messageActivityButton)
        .waitForDisplayed();
    });

    it('switches to message widget', () => {
      local.browser.$(elements.messageActivityButton).click();
      // Activity menu animates the hide, wait for it to be gone
      local.browser.$(elements.activityMenu).waitForDisplayed({
        timeout: 1500,
        reverse: true
      });
      assert.isTrue(local.browser.$(elements.messageWidget).isDisplayed());
      assert.isFalse(local.browser.$(elements.meetWidget).isDisplayed());
    });

    it('has a meet button', () => {
      local.browser.$(elements.meetActivityButton).waitForDisplayed();
    });

    it('switches to meet widget', () => {
      local.browser.$(elements.meetActivityButton).click();
      // Activity menu animates the hide, wait for it to be gone
      local.browser.$(elements.activityMenu).waitForDisplayed({
        timeout: 1500,
        reverse: true
      });
      assert.isTrue(local.browser.$(elements.meetWidget).isDisplayed());
      assert.isFalse(local.browser.$(elements.messageWidget).isDisplayed());
    });
  });

  describe('messaging', () => {
    it('sends and receives messages', () => {
      const martyText = 'Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?';
      const docText = 'The way I see it, if you\'re gonna build a time machine into a car, why not do it with some style?';
      const lorraineText = 'Marty, will we ever see you again?';
      const martyText2 = 'I guarantee it.';

      switchToMessage(local.browser);
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
