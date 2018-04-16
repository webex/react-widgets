import {assert} from 'chai';

import {loginAndOpenWidget} from '../../../lib/helpers/tap/recents';

import {
  displayAndReadIncomingMessage,
  displayIncomingMessage,
  createSpaceAndPost
} from '../../../lib/helpers/recents-widget';

import {
  createTestUsers,
  createSpace,
  registerDevices
} from '../../../lib/sdk';
import RecentsWidgetPage from '../../../lib/widgetPages/recents/main';

describe('Widget Recents', () => {
  const recentsPage = new RecentsWidgetPage({aBrowser: browser.select('1')});
  let docbrown, lorraine, marty, groupSpace, oneOnOneSpace;

  before('intialize test users', () => {
    [docbrown, lorraine, marty] = createTestUsers(3);
    recentsPage.user = marty;

    registerDevices([docbrown, lorraine, marty]);

    browser.waitUntil(() =>
      marty.spark.internal.device.userId &&
      lorraine.spark.internal.device.userId,
    15000, 'failed to register user devices');
  });

  it('creates group space', function createGroupSpace() {
    this.retries(2);

    groupSpace = createSpace({
      sparkInstance: marty.spark,
      displayName: 'Test Widget Space',
      participants: [marty, docbrown, lorraine]
    });

    browser.waitUntil(() =>
      groupSpace && groupSpace.id,
    5000, 'failed to create group space');
  });

  it('creates one on one space', function createOneOnOneSpace() {
    this.retries(2);

    oneOnOneSpace = createSpace({
      sparkInstance: lorraine.spark,
      participants: [marty, lorraine]
    });

    browser.waitUntil(() => oneOnOneSpace && oneOnOneSpace.id,
      15000, 'failed to create one on one space');
  });

  it('loads browser and widget', () => {
    recentsPage.open('/widget-recents/production/demo/index.html');
    loginAndOpenWidget(recentsPage.browser, marty.token.access_token);
  });

  describe('group space', () => {
    it('displays a new incoming message', () => {
      displayIncomingMessage({
        page: recentsPage,
        sender: lorraine,
        space: groupSpace,
        message: 'Marty, will we ever see you again?'
      });
    });

    it('removes unread indicator when read', () => {
      displayAndReadIncomingMessage({
        page: recentsPage,
        sender: lorraine,
        receiver: marty,
        space: groupSpace,
        message: 'You\'re safe and sound now!'
      });
    });

    it('displays a call button on hover', () => {
      displayIncomingMessage({
        page: recentsPage,
        sender: lorraine,
        space: groupSpace,
        message: 'Can you call me?'
      });
      recentsPage.moveMouseToFirstSpace();
      browser.waitUntil(() =>
        recentsPage.hasCallButton,
      1500, 'does not show call button');
    });

    describe('events', () => {
      // https://github.com/ciscospark/react-ciscospark/blob/master/packages/node_modules/%40ciscospark/widget-recents/events.md
      it('messages:created', () => {
        recentsPage.clearEventLog();
        displayIncomingMessage({
          page: recentsPage,
          sender: lorraine,
          space: groupSpace,
          message: 'Don\'t be such a square'
        });
        assert.include(recentsPage.getEventNames(), 'messages:created', 'does not have event in log');
      });

      it('rooms:unread', () => {
        recentsPage.clearEventLog();
        displayIncomingMessage({
          page: recentsPage,
          sender: lorraine,
          space: groupSpace,
          message: 'Your Uncle Joey didn\'t make parole again.'
        });
        assert.include(recentsPage.getEventNames(), 'rooms:unread', 'does not have event in log');
      });

      it('rooms:read', () => {
        recentsPage.clearEventLog();
        displayAndReadIncomingMessage({
          page: recentsPage,
          sender: lorraine,
          receiver: marty,
          space: groupSpace,
          message: 'Your Uncle Joey didn\'t make parole again.'
        });
        assert.include(recentsPage.getEventNames(), 'rooms:read', 'does not have event in log');
      });

      it('rooms:selected', () => {
        recentsPage.clearEventLog();
        recentsPage.clickFirstSpace();
        assert.include(recentsPage.getEventNames(), 'rooms:selected', 'does not have event in log');
      });

      it('memberships:created', () => {
        recentsPage.clearEventLog();

        const message = 'Everybody who\'s anybody drinks.';
        const title = 'Test Group Space 2';
        createSpaceAndPost({
          page: recentsPage,
          sender: lorraine,
          participants: [marty, docbrown, lorraine],
          title,
          message
        });

        assert.include(recentsPage.getEventNames(), 'memberships:created', 'does not have event in log');
      });

      it('memberships:deleted', () => {
        // Create Room
        const title = 'Kick Marty Out';
        const message = 'Goodbye Marty.';
        const kickedConversation = createSpaceAndPost({
          page: recentsPage,
          sender: lorraine,
          participants: [marty, docbrown, lorraine],
          title,
          message
        });
        // Remove user from room
        recentsPage.clearEventLog();

        browser.call(() => lorraine.spark.internal.conversation.leave(kickedConversation, marty));
        browser.waitUntil(() =>
          recentsPage.firstSpaceTitleText !== title,
        5000, 'does not remove space from list');

        assert.include(recentsPage.getEventNames(), 'memberships:deleted', 'does not have event in log');
      });
    });
  });

  describe('one on one space', () => {
    it('displays a new incoming message', () => {
      displayIncomingMessage({
        page: recentsPage,
        sender: lorraine,
        space: oneOnOneSpace,
        message: 'Marty? Why are you so nervous?',
        isOneOnOne: true
      });
    });

    it('removes unread indicator when read', () => {
      displayAndReadIncomingMessage({
        page: recentsPage,
        sender: lorraine,
        receiver: marty,
        space: oneOnOneSpace,
        message: 'You\'re safe and sound now!'
      });
    });

    it('displays a new one on one', () => {
      createSpaceAndPost({
        page: recentsPage,
        sender: docbrown,
        participants: [marty, docbrown],
        message: 'Marty! We have to talk!',
        isOneOnOne: true
      });
    });

    it('displays a call button on hover', () => {
      displayIncomingMessage({
        page: recentsPage,
        sender: lorraine,
        space: oneOnOneSpace,
        message: 'Can you call me?',
        isOneOnOne: true
      });

      recentsPage.moveMouseToFirstSpace();
      browser.waitUntil(() =>
        recentsPage.hasCallButton,
      1500, 'does not show call button');
    });
  });
});
