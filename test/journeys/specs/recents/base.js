import {assert} from 'chai';

import {runAxe} from '../../lib/axe';
import waitForPromise from '../../lib/wait-for-promise';
import {clearEventLog, getEventLog} from '../../lib/events';

import {setupGroupTestUsers, moveMouse} from '../../lib/test-helpers';
import {elements as meetElements, hangup} from '../../lib/test-helpers/space-widget/meet';
import {
  createSpaceAndPost,
  displayAndReadIncomingMessage,
  displayIncomingMessage,
  elements as recentsElements
} from '../../lib/test-helpers/recents-widget';

export default function baseRecentsTest({name, browserLocalSetup}) {
  describe(name, () => {
    const browserLocal = browser.select('1');
    const browserRemote = browser.select('2');

    let docbrown, lorraine, marty;
    let conversation, oneOnOneConversation;

    before('initialize test users', () => {
      ({docbrown, lorraine, marty} = setupGroupTestUsers());

      marty.spark.internal.device.register();
      lorraine.spark.internal.device.register();
      docbrown.spark.internal.device.register();

      browser.waitUntil(() =>
        marty.spark.internal.device.userId &&
        lorraine.spark.internal.device.userId &&
        docbrown.spark.internal.device.userId,
      15000, 'failed to register user devices');
    });

    it('creates group space', function createGroupSpace() {
      this.retries(2);

      marty.spark.internal.conversation.create({
        displayName: 'Test Group Space',
        participants: [marty, docbrown, lorraine]
      }).then((c) => {
        conversation = c;
        return conversation;
      });

      browser.waitUntil(() => conversation && conversation.id,
        15000, 'failed to create group space');
    });

    it('creates one on one space', function createOneOnOneSpace() {
      this.retries(2);

      lorraine.spark.internal.conversation.create({
        participants: [marty, lorraine]
      }).then((c) => {
        oneOnOneConversation = c;
        return oneOnOneConversation;
      });

      browser.waitUntil(() => oneOnOneConversation && oneOnOneConversation.id,
        15000, 'failed to create one on one space');
    });

    it('loads browser and widgets', function loadBrowsers() {
      this.retries(3);

      browserLocalSetup({aBrowser: browserLocal, accessToken: marty.token.access_token});

      browserRemote
        .url('/space.html?meetRecents')
        .execute(() => {
          localStorage.clear();
        });

      browserRemote.execute((localAccessToken, localToUserEmail) => {
        const options = {
          accessToken: localAccessToken,
          onEvent: (eventName, detail) => {
            window.ciscoSparkEvents.push({eventName, detail});
          },
          toPersonEmail: localToUserEmail,
          initialActivity: 'meet'
        };
        window.openSpaceWidget(options);
      }, lorraine.token.access_token, marty.email);

      browser.waitUntil(() =>
        browserLocal.isVisible(recentsElements.recentsWidget) &&
        browserRemote.isVisible(meetElements.meetWidget),
      10000, 'failed to load browsers and widgets');
    });


    describe('group space', () => {
      it('displays a new incoming message', () => {
        const lorraineText = 'Marty, will we ever see you again?';
        displayIncomingMessage(browserLocal, lorraine, conversation, lorraineText);
      });

      it('removes unread indicator when read', () => {
        const lorraineText = 'You\'re safe and sound now!';
        displayAndReadIncomingMessage(browserLocal, lorraine, marty, conversation, lorraineText);
      });

      it('displays a call button on hover', () => {
        displayIncomingMessage(browserLocal, lorraine, conversation, 'Can you call me?');
        moveMouse(browserLocal, recentsElements.firstSpace);
        browser.waitUntil(() =>
          browserLocal.element(recentsElements.callButton).isVisible(),
        1500,
        'does not show call button');
      });

      describe('events', () => {
        // https://github.com/ciscospark/react-ciscospark/blob/master/packages/node_modules/%40ciscospark/widget-recents/events.md
        it('messages:created', () => {
          clearEventLog(browserLocal);
          const lorraineText = 'Don\'t be such a square';
          displayIncomingMessage(browserLocal, lorraine, conversation, lorraineText);
          assert.include(getEventLog(browserLocal), 'messages:created', 'does not have event in log');
        });

        it('rooms:unread', () => {
          clearEventLog(browserLocal);
          const lorraineText = 'Your Uncle Joey didn\'t make parole again.';
          displayIncomingMessage(browserLocal, lorraine, conversation, lorraineText);
          assert.include(getEventLog(browserLocal), 'rooms:unread', 'does not have event in log');
        });

        it('rooms:read', () => {
          clearEventLog(browserLocal);
          const lorraineText = 'Your Uncle Joey didn\'t make parole again.';
          displayAndReadIncomingMessage(browserLocal, lorraine, marty, conversation, lorraineText);
          assert.include(getEventLog(browserLocal), 'rooms:read', 'does not have event in log');
        });

        it('rooms:selected', () => {
          clearEventLog(browserLocal);
          browserLocal.element(recentsElements.firstSpace).click();
          assert.include(getEventLog(browserLocal), 'rooms:selected', 'does not have event in log');
        });

        it('memberships:created', () => {
          const roomTitle = 'Test Group Space 2';
          const firstPost = 'Everybody who\'s anybody drinks.';
          clearEventLog(browserLocal);
          createSpaceAndPost(browserLocal, lorraine, [marty, docbrown, lorraine], roomTitle, firstPost);
          assert.include(getEventLog(browserLocal), 'memberships:created', 'does not have event in log');
        });

        it('memberships:deleted', () => {
          // Create Room
          const roomTitle = 'Kick Marty Out';
          const firstPost = 'Goodbye Marty.';
          const kickedConversation = createSpaceAndPost(
            browserLocal,
            lorraine,
            [marty, docbrown, lorraine],
            roomTitle,
            firstPost
          );
          // Remove user from room
          clearEventLog(browserLocal);
          waitForPromise(lorraine.spark.internal.conversation.leave(kickedConversation, marty));
          browser.waitUntil(() =>
            browserLocal.element(`${recentsElements.firstSpace} ${recentsElements.title}`).getText() !== roomTitle,
          5000,
          'does not remove space from list');
          assert.include(getEventLog(browserLocal), 'memberships:deleted', 'does not have event in log');
        });
      });
    });

    describe('one on one space', () => {
      it('displays a new incoming message', () => {
        const lorraineText = 'Marty? Why are you so nervous?';
        displayIncomingMessage(browserLocal, lorraine, oneOnOneConversation, lorraineText, true);
      });

      it('removes unread indicator when read', () => {
        const lorraineText = 'You\'re safe and sound now!';
        displayAndReadIncomingMessage(browserLocal, lorraine, marty, oneOnOneConversation, lorraineText);
      });

      it('displays a new one on one', () => {
        const docText = 'Marty! We have to talk!';
        createSpaceAndPost(browserLocal, docbrown, [marty, docbrown], undefined, docText, true);
      });

      it('displays a call button on hover', () => {
        displayIncomingMessage(browserLocal, lorraine, oneOnOneConversation, 'Can you call me?', true);
        moveMouse(browserLocal, recentsElements.firstSpace);
        browser.waitUntil(() =>
          browserLocal.element(recentsElements.callButton).isVisible(),
        1500,
        'does not show call button');
      });
    });

    describe('incoming call', () => {
      it('should display incoming call screen', () => {
        browserRemote.waitForVisible(`${meetElements.meetWidget} ${meetElements.callButton}`);
        browserRemote.click(meetElements.callButton);
        browser.waitUntil(
          () => browserLocal.isVisible(recentsElements.answerButton),
          15000, 'does not show call answer button'
        );
        hangup(browserRemote);
      });
    });

    describe('accessibility', () => {
      it('should have no accessibility violations', () =>
        runAxe(browserLocal, 'ciscospark-widget')
          .then((results) => {
            assert.equal(results.violations.length, 0, 'has accessibilty violations');
          }));
    });
  });
}
