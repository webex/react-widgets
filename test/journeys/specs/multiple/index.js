import {assert} from 'chai';

import {
  createTestUsers,
  sendMessage,
  createSpace
} from '../../lib/sdk';

import {
  displayAndReadIncomingMessage,
  displayIncomingMessage
} from '../../lib/helpers/recents-widget';

import MessageWidgetPage from '../../lib/widgetPages/space/messaging';
import RecentsWidgetPage from '../../lib/widgetPages/recents/main';


describe('Multiple Widgets on a Single Page', () => {
  const localMessageWidget = new MessageWidgetPage({aBrowser: browser.select('1')});
  const localRecentsWidget = new RecentsWidgetPage({aBrowser: browser.select('1')});
  const remoteMessageWidget = new MessageWidgetPage({aBrowser: browser.select('2')});
  const remoteRecentsWidget = new RecentsWidgetPage({aBrowser: browser.select('2')});

  const allWidgets = [
    localMessageWidget,
    localRecentsWidget,
    remoteMessageWidget,
    remoteRecentsWidget
  ];

  let docbrown, lorraine, marty;
  let groupSpace, oneOnOneSpace;

  before('initialize test users', () => {
    [docbrown, lorraine, marty] = createTestUsers(3);
    localMessageWidget.user = marty;
    localRecentsWidget.user = marty;
    remoteMessageWidget.user = docbrown;
    remoteRecentsWidget.user = docbrown;

    browser.call(() =>
      Promise.all([
        marty.spark.internal.device.register(),
        lorraine.spark.internal.device.register()
      ]));

    browser.waitUntil(() => marty.spark.internal.device.userId && lorraine.spark.internal.device.userId,
      15000, 'failed to register marty and lorraine');
  });

  describe('Setup', function setup() {
    it('can create a group space', function createGroupSpace() {
      this.retries(2);
      groupSpace = createSpace({
        sparkInstance: marty.spark,
        displayName: 'Test Group Space',
        participants: [marty, docbrown, lorraine]
      });

      assert.exists(groupSpace.id, 'failed to create group space');
    });

    it('can create one on one space', function createOneOnOneSpace() {
      this.retries(2);
      oneOnOneSpace = createSpace({
        sparkInstance: marty.spark,
        participants: [marty, lorraine]
      });

      assert.exists(oneOnOneSpace.id, 'failed to create one on one space');
    });

    it('loads browsers and widgets', () => {
      allWidgets.forEach((w) => w.open('./multiple.html'));
      localMessageWidget.loadWithGlobals({spaceId: groupSpace.id});
      localRecentsWidget.loadWidget();
      remoteMessageWidget.loadWithGlobals({spaceId: groupSpace.id});
      remoteRecentsWidget.loadWidget();

      browser.waitUntil(() =>
        localMessageWidget.hasMessageWidget &&
        localRecentsWidget.hasRecentsWidget &&
        remoteMessageWidget.hasMessageWidget &&
        remoteRecentsWidget.hasRecentsWidget,
      15000, 'failed to load browsers and widgets');
    });
  });

  describe('Main Tests', () => {
    beforeEach(function testName() {
      const {title} = `Multiple - ${this.currentTest.title}`;
      localMessageWidget.setPageTestName(title);
      remoteMessageWidget.setPageTestName(title);
    });

    describe('Recents Widget', () => {
      it('can displays a new incoming message', () => {
        displayIncomingMessage({
          page: localRecentsWidget,
          sender: lorraine,
          space: groupSpace,
          message: 'Marty, will we ever see you again?'
        });
      });

      it('can remove unread indicator when read', () => {
        displayAndReadIncomingMessage({
          page: localRecentsWidget,
          sender: lorraine,
          receiver: marty,
          space: groupSpace,
          message: 'You\'re safe and sound now!'
        });
      });

      it('can display a call button on hover', () => {
        displayIncomingMessage({
          page: localRecentsWidget,
          sender: lorraine,
          space: oneOnOneSpace,
          message: 'Can you call me?',
          isOneOnOne: true
        });

        localRecentsWidget.moveMouseToFirstSpace();

        browser.waitUntil(() =>
          localRecentsWidget.hasCallButton,
        1000, 'does not show call button');
      });
    });

    describe('Space Widget', () => {
      describe('Activity Menu', () => {
        it('has a menu button', () => {
          assert.isTrue(localMessageWidget.hasActivityMenuButton);
        });

        it('displays the menu when clicking the menu button', () => {
          localMessageWidget.openActivityMenu();
        });

        it('has an exit menu button', () => {
          localMessageWidget.openActivityMenu();
          browser.waitUntil(() =>
            localMessageWidget.hasExitButton,
          1000, 'exit button is not visible after activity menu is open');
        });

        it('closes the menu with the exit button', () => {
          localMessageWidget.openActivityMenu();
          localMessageWidget.closeActivityMenu();
        });

        it('has a message button and switchs to message widget', () => {
          localMessageWidget.switchToMessage();
          assert.isTrue(localMessageWidget.hasMessageWidget);
        });
      });

      describe('messaging', () => {
        it('sends and receives messages', () => {
          const martyText = 'Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?';
          const docText = 'The way I see it, if you\'re gonna build a time machine into a car, why not do it with some style?';
          const lorraineText = 'Marty, will we ever see you again?';
          const martyText2 = 'I guarantee it.';

          localMessageWidget.sendMessage(martyText);
          remoteMessageWidget.verifyMessageReceipt(martyText);

          remoteMessageWidget.sendMessage(docText);
          localMessageWidget.verifyMessageReceipt(docText);

          // Send a message from a 'client'
          sendMessage({
            sparkInstance: lorraine.spark,
            space: groupSpace,
            message: lorraineText
          });
          // Wait for both widgets to receive client message
          remoteMessageWidget.verifyMessageReceipt(lorraineText);
          localMessageWidget.verifyMessageReceipt(lorraineText);

          localMessageWidget.sendMessage(martyText2);
          remoteMessageWidget.verifyMessageReceipt(martyText2);
        });
      });
    });
  });

  after('disconnect', () => Promise.all([
    marty.spark.internal.mercury.disconnect(),
    lorraine.spark.internal.mercury.disconnect(),
    docbrown.spark.internal.mercury.disconnect()
  ]));
});
