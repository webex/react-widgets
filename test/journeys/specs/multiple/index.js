import {assert} from 'chai';

import waitForPromise from '../../lib/wait-for-promise';
import {
  setupGroupTestUsers,
  moveMouse
} from '../../lib/test-helpers';
import {
  switchToMessage,
  elements as spaceElements
} from '../../lib/test-helpers/space-widget/main';
import {sendMessage, verifyMessageReceipt} from '../../lib/test-helpers/space-widget/messaging';

import {
  displayAndReadIncomingMessage,
  displayIncomingMessage,
  elements as recentsElements
} from '../../lib/test-helpers/recents-widget';


describe('Multiple Widgets on a Single Page', () => {
  const browserLocal = browser.select('1');
  const browserRemote = browser.select('2');

  let docbrown, lorraine, marty;
  let conversation, oneOnOneConversation;

  before('initialize test users', () => {
    ({docbrown, lorraine, marty} = setupGroupTestUsers());
    marty.spark.internal.device.register();
    lorraine.spark.internal.device.register();

    browser.waitUntil(() => marty.spark.internal.device.userId && lorraine.spark.internal.device.userId,
      15000, 'failed to register marty and lorraine');
  });

  it('can create a group space', function createGroupSpace() {
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

  it('can create one on one space', function createOneOnOneSpace() {
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

  it('can load browsers and widgets', function loadBrowsers() {
    this.retries(3);

    browser
      .url('/multiple.html')
      .execute(() => {
        localStorage.clear();
      });

    browserLocal.execute((localAccessToken) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName) => {
          window.ciscoSparkEvents.push({widget: 'recents', eventName});
        }
      };
      window.openRecentsWidget(options);
    }, marty.token.access_token);

    browserLocal.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        spaceId,
        onEvent: (eventName) => {
          window.ciscoSparkEvents.push({widget: 'space', eventName});
        }
      };
      window.openSpaceWidget(options);
    }, marty.token.access_token, conversation.id);

    browserRemote.execute((localAccessToken) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName) => {
          window.ciscoSparkEvents.push({widget: 'recents', eventName});
        }
      };
      window.openRecentsWidget(options);
    }, docbrown.token.access_token);

    browserRemote.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        spaceId,
        onEvent: (eventName) => {
          window.ciscoSparkEvents.push({widget: 'space', eventName});
        }
      };
      window.openSpaceWidget(options);
    }, docbrown.token.access_token, conversation.id);

    browser.waitUntil(() =>
      browserRemote.isVisible(recentsElements.recentsWidget) &&
      browserRemote.isVisible(spaceElements.spaceWidget) &&
      browserLocal.isVisible(spaceElements.spaceWidget) &&
      browserLocal.isVisible(recentsElements.recentsWidget),
    15000, 'failed to load browsers and widgets');
  });

  describe('Recents Widget ', () => {
    it('can displays a new incoming message', () => {
      const lorraineText = 'Marty, will we ever see you again?';
      displayIncomingMessage(browserLocal, lorraine, conversation, lorraineText);
    });

    it('can remove unread indicator when read', () => {
      const lorraineText = 'You\'re safe and sound now!';
      displayAndReadIncomingMessage(browserLocal, lorraine, marty, conversation, lorraineText);
    });

    it('can display a call button on hover', () => {
      displayIncomingMessage(browserLocal, lorraine, oneOnOneConversation, 'Can you call me?', true);
      moveMouse(browserLocal, recentsElements.firstSpace);
      browser.waitUntil(() =>
        browserLocal.isVisible(`${recentsElements.callButton}`),
      1000, 'does not show call button');
    });
  });

  describe('Space Widget', () => {
    describe('Activity Menu', () => {
      it('has a menu button', () => {
        assert.isTrue(browserLocal.isVisible(spaceElements.menuButton));
      });

      it('displays the menu when clicking the menu button', () => {
        browserLocal.click(spaceElements.menuButton);
        browser.waitUntil(() =>
          browserLocal.isVisible(spaceElements.activityMenu),
        1000, 'activity menu is not visible after clicking to open');
      });

      it('has an exit menu button', () => {
        assert.isTrue(browserLocal.isVisible(spaceElements.activityMenu));
        browser.waitUntil(() =>
          browserLocal.isVisible(spaceElements.exitButton),
        1000, 'exit button is not visible after activity menu is open');
      });

      it('closes the menu with the exit button', () => {
        browserLocal.click(spaceElements.exitButton);
        browser.waitUntil(() =>
          !browserLocal.isVisible(spaceElements.activityMenu),
        1000, 'activity menu is still visible after close');
      });

      it('has a message button', () => {
        browserLocal.click(spaceElements.menuButton);
        browser.waitUntil(() =>
          browserLocal.isVisible(`${spaceElements.controlsContainer} ${spaceElements.messageButton}`),
        1000, 'message button is not visible in activity menu');
      });

      it('hides menu and switches to message widget', () => {
        switchToMessage(browserLocal);
        assert.isTrue(browserLocal.isVisible(spaceElements.messageWidget));
      });
    });

    describe('messaging', () => {
      it('sends and receives messages', () => {
        const local = {browser: browserLocal, user: marty, displayName: conversation.displayName};
        const remote = {browser: browserRemote, user: docbrown, displayName: conversation.displayName};
        const martyText = 'Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?';
        const docText = 'The way I see it, if you\'re gonna build a time machine into a car, why not do it with some style?';
        const lorraineText = 'Marty, will we ever see you again?';
        const martyText2 = 'I guarantee it.';
        sendMessage({
          senderBrowser: remote.browser,
          spaceName: local.displayName,
          message: martyText
        });
        verifyMessageReceipt({
          senderBrowser: browserLocal,
          receiverBrowser: browserRemote,
          message: martyText
        });

        sendMessage({
          senderBrowser: remote.browser,
          spaceName: local.displayName,
          message: docText
        });
        verifyMessageReceipt({
          senderBrowser: browserLocal,
          receiverBrowser: browserRemote,
          message: docText
        });

        // Send a message from a 'client'
        waitForPromise(lorraine.spark.internal.conversation.post(conversation, {
          displayName: lorraineText
        }));
        // Wait for both widgets to receive client message
        verifyMessageReceipt({
          senderBrowser: browserLocal,
          receiverBrowser: browserRemote,
          message: lorraineText
        });
        verifyMessageReceipt({
          senderBrowser: browserRemote,
          receiverBrowser: browserLocal,
          message: lorraineText
        });

        sendMessage({
          senderBrowser: local.browser,
          spaceName: remote.displayName,
          message: martyText2
        });
        verifyMessageReceipt({
          senderBrowser: browserRemote,
          receiverBrowser: browserLocal,
          message: martyText2
        });
      });
    });
  });
});
