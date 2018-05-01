import {assert} from 'chai';

import {
  createTestUsers,
  createSpace,
  sendMessage,
  registerDevices
} from '../../../lib/sdk';
import {loginAndOpenWidget} from '../../../lib/helpers/tap/space';
import MessageWidgetPage from '../../../lib/widgetPages/space/messaging';
import MeetWidgetPage from '../../../lib/widgetPages/space/meet';

describe('Widget Space: Group Space - TAP', () => {
  const localMeetPage = new MeetWidgetPage({aBrowser: browser.select('1')});
  const localMessagePage = new MessageWidgetPage({aBrowser: browser.select('1')});
  const remoteMeetPage = new MeetWidgetPage({aBrowser: browser.select('2')});
  const remoteMessagePage = new MessageWidgetPage({aBrowser: browser.select('2')});

  let docbrown, lorraine, marty, space;

  before('load browsers', () => {
    localMeetPage.open('/widget-space/production/demo/index.html');
    remoteMeetPage.open('/widget-space/production/demo/index.html');
  });

  before('initialize test users', function intializeUsers() {
    [docbrown, lorraine, marty] = createTestUsers(3);
    localMeetPage.user = marty;
    localMessagePage.user = marty;
    remoteMeetPage.user = docbrown;
    remoteMessagePage.user = docbrown;

    registerDevices([marty, lorraine]);

    assert.exists(docbrown.spark, 'failed to create docbrown test user');
    assert.exists(lorraine.spark, 'failed to create lorraine test user');
    assert.exists(marty.spark, 'failed to create marty test user');
  });

  it('create group space', () => {
    space = createSpace({
      displayName: 'Test Widget Space',
      sparkInstance: marty.spark,
      participants: [marty, docbrown, lorraine]
    });

    browser.waitUntil(() =>
      space && space.id,
    15000, 'failed to create conversation');
  });

  it('inject marty token', () => {
    loginAndOpenWidget(localMeetPage.browser, marty.token.access_token, false, space.id);
    localMeetPage.browser.waitForExist(`[placeholder="Send a message to ${space.displayName}"]`, 30000);
  });

  it('inject docbrown token', () => {
    loginAndOpenWidget(remoteMeetPage.browser, docbrown.token.access_token, false, space.id);
    remoteMeetPage.browser.waitForExist(`[placeholder="Send a message to ${space.displayName}"]`, 30000);
  });

  describe('Activity Menu', () => {
    it('has a menu button', () => {
      assert.isTrue(localMessagePage.hasActivityMenuButton);
    });

    it('displays the menu when clicking the menu button', () => {
      localMessagePage.openActivityMenu();
    });

    it('has an exit menu button', () => {
      browser.waitUntil(() =>
        localMessagePage.hasExitButton,
      5000, 'exit button not visible after opening activity menu');
    });

    it('closes the menu with the exit button', () => {
      localMessagePage.closeActivityMenu();
    });

    it('switches to message widget', () => {
      localMessagePage.switchToMessage();
    });

    it('switches to meet widget', () => {
      localMessagePage.switchToMeet();
    });
  });

  describe('messaging', () => {
    it('sends and receives messages', () => {
      localMessagePage.switchToMessage();
      remoteMessagePage.switchToMessage();

      const martyText = 'Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?';
      localMessagePage.sendMessage(martyText);
      remoteMessagePage.verifyMessageReceipt(martyText);
      localMessagePage.clearEventLog();

      const docText = 'The way I see it, if you\'re gonna build a time machine into a car, why not do it with some style?';
      remoteMessagePage.sendMessage(docText);
      localMessagePage.verifyMessageReceipt(docText);
      const remoteSendEvents = localMessagePage.getEventLog();

      assert.isTrue(remoteSendEvents.some((event) =>
        event.eventName === 'messages:created'), 'event was not seen');
      assert.isTrue(remoteSendEvents.some((event) =>
        event.eventName === 'rooms:unread'), 'event was not seen');
      localMessagePage.clearEventLog();
      // Send a message from a 'client'

      const lorraineText = 'Marty, will we ever see you again?';
      const martyText2 = 'I guarantee it.';

      sendMessage({
        sparkInstance: lorraine.spark,
        space,
        message: lorraineText
      });
      // Wait for both widgets to receive client message
      localMessagePage.verifyMessageReceipt(lorraineText);
      remoteMessagePage.verifyMessageReceipt(lorraineText);
      const clientSendEvents = localMessagePage.getEventLog();
      assert.isTrue(clientSendEvents.some((event) =>
        event.eventName === 'messages:created'), 'event was not seen');
      assert.isTrue(clientSendEvents.some((event) =>
        event.eventName === 'rooms:unread'), 'event was not seen');
      localMessagePage.sendMessage(martyText2);
      remoteMessagePage.verifyMessageReceipt(martyText2);
    });
  });
});
