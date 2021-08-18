import {assert} from 'chai';

import {elements as basicElements, switchToMeet, switchToMessage} from '../../../lib/test-helpers/space-widget/main';
import {clearEventLog, getEventLog} from '../../../lib/events';
import {sendMessage, verifyMessageReceipt} from '../../../lib/test-helpers/space-widget/messaging';
import {elements, declineIncomingCallTest, hangupDuringCallTest} from '../../../lib/test-helpers/space-widget/meet';
import loginAndOpenWidget from '../../../lib/test-helpers/tap/space';
import {setupOneOnOneUsers} from '../../../lib/test-users';

describe('Widget Space: One on One: TAP', () => {
  let local, localUser, remote, remoteUser;

  before('load browsers', () => {
    browser.url('/widget-demo/production/index.html?oneOnOne');
    browser.execute(() => {
      localStorage.clear();
    });
  });

  before('create test users', () => {
    [localUser, remoteUser] = setupOneOnOneUsers();
    local = {browser: browserLocal, user: localUser, displayName: localUser.displayName};
    remote = {browser: browserRemote, user: remoteUser, displayName: remoteUser.displayName};
  });

  before('inject token for local user', () => {
    loginAndOpenWidget(local.browser, local.user.token.access_token, true, remote.user.email);
    local.browser.$(`[placeholder="Send a message to ${remote.displayName}"]`).waitForExist({
      timeout: 30000
    });
  });

  before('open remote widget for remote user', () => {
    loginAndOpenWidget(remote.browser, remote.user.token.access_token, true, local.user.email);
    remote.browser.$(`[placeholder="Send a message to ${local.displayName}"]`).waitForExist({
      timeout: 30000
    });
  });

  before('stick widgets to bottom of viewport', () => {
    local.browser.$(basicElements.stickyButton).waitForDisplayed();
    local.browser.$(basicElements.stickyButton).click();
    remote.browser.$(basicElements.stickyButton).waitForDisplayed();
    remote.browser.$(basicElements.stickyButton).click();
  });

  // Demos use cookies to save state, clear before moving on
  after('delete cookies', () => browser.deleteCookies());

  describe('Tab Menu', () => {
    it('switches to message widget', () => {
      local.browser.$(basicElements.controlsContainer).$(basicElements.messageActivityButton).click();
      assert.isTrue(local.browser.$(basicElements.messageWidget).isDisplayed());
      assert.isFalse(local.browser.$(basicElements.meetWidget).isDisplayed());
    });

    it('has a meet button', () => {
      local.browser.$(basicElements.controlsContainer).$(basicElements.meetActivityButton).waitForDisplayed();
    });

    it('switches to meet widget', () => {
      local.browser.$(basicElements.controlsContainer).$(basicElements.meetActivityButton).click();
      assert.isTrue(local.browser.$(basicElements.meetWidget).isDisplayed());
      assert.isFalse(local.browser.$(basicElements.messageWidget).isDisplayed());
    });
  });

  describe('message widget', () => {
    it('sends a messages', () => {
      const message = 'Oh, I am sorry, Doctor. Were we having a good time?';

      switchToMessage(local.browser);
      sendMessage(local, remote, message);
      verifyMessageReceipt(remote, local, message);
    });

    it('receives a message', () => {
      const response = 'God, I liked him better before he died.';

      // Send a message back
      clearEventLog(local.browser);
      clearEventLog(remote.browser);
      sendMessage(remote, local, response);
      verifyMessageReceipt(local, remote, response);
      const events = getEventLog(local.browser);
      const eventCreated = events.find((event) => event.eventName === 'messages:created');
      const eventUnread = events.find((event) => event.eventName === 'rooms:unread');

      assert.isDefined(eventCreated, 'messages:created', 'has a message created event');
      assert.isDefined(eventUnread, 'rooms:unread', 'has an unread message event');
    });
  });

  describe.skip('meet widget', () => {
    describe('pre call experience', () => {
      it('has a call button', () => {
        switchToMeet(local.browser);
        local.browser.$(elements.meetWidget).$(elements.callButton).waitForDisplayed();
      });
    });

    describe('during call experience', () => {
      it('can hangup in call', () => {
        hangupDuringCallTest(local.browser, remote.browser);
      });

      it('can decline an incoming call', () => {
        declineIncomingCallTest(local.browser, remote.browser);
      });
    });
  });
});
