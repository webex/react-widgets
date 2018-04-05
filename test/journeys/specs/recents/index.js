import {assert} from 'chai';

import runAxe from '../../lib/axe';

import {
  createTestUsers,
  registerDevices,
  createSpace
} from '../../lib/sdk';

import {
  displayAndReadIncomingMessage,
  displayIncomingMessage,
  createSpaceAndPost
} from '../../lib/helpers/recents-widget';

import MeetWidgetPage from '../../lib/widgetPages/space/meet';
import RecentsWidgetPage from '../../lib/widgetPages/recents/main';

export default function recentsTests(type) {
  describe(`Widget Recents (${type})`, () => {
    const localPage = new RecentsWidgetPage({aBrowser: browser.select('1')});
    const remotePage = new MeetWidgetPage({aBrowser: browser.select('2')});

    let docbrown, lorraine, marty;
    let groupSpace, oneOnOneSpace;

    before('initialize test users', () => {
      const users = createTestUsers(3);
      [docbrown, lorraine, marty] = users;

      localPage.user = marty;
      remotePage.user = lorraine;

      registerDevices(users);

      browser.waitUntil(() =>
        marty.spark.internal.device.userId &&
        lorraine.spark.internal.device.userId &&
        docbrown.spark.internal.device.userId,
      15000, 'failed to register user devices');
    });

    it('creates group space', function createGroupSpace() {
      this.retries(2);

      groupSpace = createSpace({
        sparkInstance: marty.spark,
        displayName: 'Test Group Space',
        participants: [marty, docbrown, lorraine]
      });

      browser.waitUntil(() => groupSpace && groupSpace.id,
        15000, 'failed to create group space');
    });

    it('creates one on one space', function createOneOnOneSpace() {
      this.retries(2);

      oneOnOneSpace = createSpace({
        sparkInstance: marty.spark,
        participants: [marty, lorraine]
      });

      browser.waitUntil(() => oneOnOneSpace && oneOnOneSpace.id,
        15000, 'failed to create one on one space');
    });

    it('loads browser and widgets', function loadBrowsers() {
      this.retries(3);
      localPage.open('/recents.html');
      remotePage.open('/space.html');

      localPage.loadWithGlobals();

      remotePage.loadWithGlobals({
        toPersonEmail: marty.email,
        initialActivity: 'meet'
      });

      browser.waitUntil(() =>
        localPage.hasRecentsWidget &&
        remotePage.hasMeetWidget,
      10000, 'failed to load browsers and widgets');
    });


    describe('group space', () => {
      it('displays a new incoming message', () => {
        displayIncomingMessage({
          page: localPage,
          sender: lorraine,
          space: groupSpace,
          message: 'Marty, will we ever see you again?'
        });
      });

      it('removes unread indicator when read', () => {
        displayAndReadIncomingMessage({
          page: localPage,
          sender: lorraine,
          receiver: marty,
          space: groupSpace,
          message: 'You\'re safe and sound now!'
        });
      });

      it('displays a call button on hover', () => {
        displayIncomingMessage({
          page: localPage,
          sender: lorraine,
          space: groupSpace,
          message: 'Can you call me?'
        });
        localPage.moveMouseToFirstSpace();
        browser.waitUntil(() =>
          localPage.hasCallButton,
        1500, 'does not show call button');
      });

      describe('events', () => {
        // https://github.com/ciscospark/react-ciscospark/blob/master/packages/node_modules/%40ciscospark/widget-recents/events.md
        it('messages:created', () => {
          localPage.clearEventLog();
          displayIncomingMessage({
            page: localPage,
            sender: lorraine,
            space: groupSpace,
            message: 'Don\'t be such a square'
          });
          assert.include(localPage.getEventNames(), 'messages:created', 'does not have event in log');
        });

        it('rooms:unread', () => {
          localPage.clearEventLog();
          displayIncomingMessage({
            page: localPage,
            sender: lorraine,
            space: groupSpace,
            message: 'Your Uncle Joey didn\'t make parole again.'
          });
          assert.include(localPage.getEventNames(), 'rooms:unread', 'does not have event in log');
        });

        it('rooms:read', () => {
          localPage.clearEventLog();
          displayAndReadIncomingMessage({
            page: localPage,
            sender: lorraine,
            receiver: marty,
            space: groupSpace,
            message: 'Your Uncle Joey didn\'t make parole again.'
          });
          assert.include(localPage.getEventNames(), 'rooms:read', 'does not have event in log');
        });

        it('rooms:selected', () => {
          localPage.clearEventLog();
          localPage.clickFirstSpace();
          assert.include(localPage.getEventNames(), 'rooms:selected', 'does not have event in log');
        });

        it('memberships:created', () => {
          localPage.clearEventLog();

          const message = 'Everybody who\'s anybody drinks.';
          const title = 'Test Group Space 2';
          createSpaceAndPost({
            page: localPage,
            sender: lorraine,
            participants: [marty, docbrown, lorraine],
            title,
            message
          });

          assert.include(localPage.getEventNames(), 'memberships:created', 'does not have event in log');
        });

        it('memberships:deleted', () => {
          // Create Room
          const title = 'Kick Marty Out';
          const message = 'Goodbye Marty.';
          const kickedConversation = createSpaceAndPost({
            page: localPage,
            sender: lorraine,
            participants: [marty, docbrown, lorraine],
            title,
            message
          });
          // Remove user from room
          localPage.clearEventLog();

          browser.call(() => lorraine.spark.internal.conversation.leave(kickedConversation, marty));
          browser.waitUntil(() =>
            localPage.firstSpaceTitleText !== title,
          5000, 'does not remove space from list');

          assert.include(localPage.getEventNames(), 'memberships:deleted', 'does not have event in log');
        });
      });
    });

    describe('one on one space', () => {
      it('displays a new incoming message', () => {
        displayIncomingMessage({
          page: localPage,
          sender: lorraine,
          space: oneOnOneSpace,
          message: 'Marty? Why are you so nervous?',
          isOneOnOne: true
        });
      });

      it('removes unread indicator when read', () => {
        displayAndReadIncomingMessage({
          page: localPage,
          sender: lorraine,
          receiver: marty,
          space: oneOnOneSpace,
          message: 'You\'re safe and sound now!'
        });
      });

      it('displays a new one on one', () => {
        createSpaceAndPost({
          page: localPage,
          sender: docbrown,
          participants: [marty, docbrown],
          message: 'Marty! We have to talk!',
          isOneOnOne: true
        });
      });

      it('displays a call button on hover', () => {
        displayIncomingMessage({
          page: localPage,
          sender: lorraine,
          space: oneOnOneSpace,
          message: 'Can you call me?',
          isOneOnOne: true
        });

        localPage.moveMouseToFirstSpace();
        browser.waitUntil(() =>
          localPage.hasCallButton,
        1500, 'does not show call button');
      });
    });

    describe('incoming call', () => {
      it('displays incoming call answer button', () => {
        remotePage.placeCall();
        browser.waitUntil(() =>
          localPage.hasAnswerButton,
        15000, 'does not show call answer button');
        remotePage.hangupCall();
      });
    });

    describe('accessibility', () => {
      it('should have no accessibility violations', () =>
        runAxe(localPage.browser, 'ciscospark-widget')
          .then((results) => {
            assert.equal(results.violations.length, 0, 'has accessibilty violations');
          }));
    });
  });
}

['dataApi', 'global'].forEach((type) => recentsTests(type));
