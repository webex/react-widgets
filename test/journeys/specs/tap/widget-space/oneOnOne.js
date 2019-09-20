import {assert} from 'chai';

import {elements as basicElements, switchToMeet, switchToMessage} from '../../../lib/test-helpers/space-widget/main';
import {clearEventLog, getEventLog} from '../../../lib/events';
import {sendMessage, verifyMessageReceipt} from '../../../lib/test-helpers/space-widget/messaging';
import {elements, declineIncomingCallTest, hangupDuringCallTest} from '../../../lib/test-helpers/space-widget/meet';
import loginAndOpenWidget from '../../../lib/test-helpers/tap/space';
import {setupOneOnOneUsers} from '../../../lib/test-users';

describe('Widget Space: One on One: TAP', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  let local, localUser, remote, remoteUser;

  before('load browsers', () => {
    browser
      .url('/widget-demo/production/index.html?oneOnOne')
      .execute(() => {
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
    local.browser.waitForExist(`[placeholder="Send a message to ${remote.displayName}"]`, 30000);
  });

  before('open remote widget for remote user', () => {
    loginAndOpenWidget(remote.browser, remote.user.token.access_token, true, local.user.email);
    remote.browser.waitForExist(`[placeholder="Send a message to ${local.displayName}"]`, 30000);
  });

  before('stick widgets to bottom of viewport', () => {
    local.browser.waitForVisible(basicElements.stickyButton);
    local.browser.click(basicElements.stickyButton);
    remote.browser.waitForVisible(basicElements.stickyButton);
    remote.browser.click(basicElements.stickyButton);
  });

  // Demos use cookies to save state, clear before moving on
  after('delete cookies', () => browser.deleteCookie());

  describe('Activity Menu', () => {
    it('has a menu button', () => {
      assert.isTrue(local.browser.isVisible(basicElements.menuButton));
    });

    it('displays the menu when clicking the menu button', () => {
      local.browser.click(basicElements.menuButton);
      local.browser.waitForVisible(basicElements.activityMenu);
    });

    it('has an exit menu button', () => {
      assert.isTrue(local.browser.isVisible(basicElements.activityMenu));
      local.browser.waitForVisible(basicElements.exitButton);
    });

    it('closes the menu with the exit button', () => {
      local.browser.click(basicElements.exitButton);
      // Activity menu animates the hide, wait for it to be gone
      local.browser.waitForVisible(basicElements.activityMenu, 1500, true);
    });

    it('has a message button', () => {
      local.browser.click(basicElements.menuButton);
      local.browser
        .element(basicElements.controlsContainer)
        .element(basicElements.messageActivityButton)
        .waitForVisible();
    });

    it('switches to message widget', () => {
      local.browser.element(basicElements.controlsContainer).element(basicElements.messageActivityButton).click();
      // Activity menu animates the hide, wait for it to be gone
      local.browser.waitForVisible(basicElements.activityMenu, 1500, true);
      assert.isTrue(local.browser.isVisible(basicElements.messageWidget));
      assert.isFalse(local.browser.isVisible(basicElements.meetWidget));
    });

    it('has a meet button', () => {
      local.browser.click(basicElements.menuButton);
      local.browser.element(basicElements.controlsContainer).element(basicElements.meetActivityButton).waitForVisible();
    });

    it('switches to meet widget', () => {
      local.browser.element(basicElements.controlsContainer).element(basicElements.meetActivityButton).click();
      // Activity menu animates the hide, wait for it to be gone
      local.browser.waitForVisible(basicElements.activityMenu, 1500, true);
      assert.isTrue(local.browser.isVisible(basicElements.meetWidget));
      assert.isFalse(local.browser.isVisible(basicElements.messageWidget));
    });
  });

  describe('message widget', () => {
    it('sends and receives messages', () => {
      const message = 'Oh, I am sorry, Doctor. Were we having a good time?';
      const response = 'God, I liked him better before he died.';

      switchToMessage(local.browser);
      sendMessage(local, remote, message);
      verifyMessageReceipt(remote, local, message);
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

  describe('meet widget', () => {
    describe('pre call experience', () => {
      it('has a call button', () => {
        switchToMeet(local.browser);
        local.browser.element(elements.meetWidget).element(elements.callButton).waitForVisible();
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
