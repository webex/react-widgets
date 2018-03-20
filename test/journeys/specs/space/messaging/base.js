import {assert} from 'chai';

import waitForPromise from '../../../lib/wait-for-promise';
import {
  messageTests,
  sendMessage,
  verifyMessageReceipt
} from '../../../lib/test-helpers/space-widget/messaging';
import allMessagingTests from '../../../lib/constructors/messaging';
import {setupGroupTestUsers} from '../../../lib/test-helpers';
import {runAxe} from '../../../lib/axe';


export default function groupMessageTests({name, browserSetup}) {
  describe(`Widget Space: Group - Messaging (${name})`, () => {
    const browserLocal = browser.select('browserLocal');
    const browserRemote = browser.select('browserRemote');
    let docbrown, lorraine, marty;
    let conversation;

    before('initialize test users', function intializeUsers() {
      ({marty, docbrown, lorraine} = setupGroupTestUsers());

      marty.spark.internal.device.register();
      lorraine.spark.internal.device.register();

      browser.waitUntil(() =>
        marty.spark.internal.device.userId &&
        lorraine.spark.internal.device.userId,
      15000, 'failed to register user devices');
    });

    it('creates group space', function createOneOnOneSpace() {
      this.retries(2);

      marty.spark.internal.conversation.create({
        displayName: 'Test Widget Space',
        participants: [marty, docbrown, lorraine]
      }).then((c) => {
        conversation = c;
        return conversation;
      });

      browser.waitUntil(() => conversation && conversation.id,
        15000, 'failed to create one on one space');
    });

    it('loads browsers and widgets', function loadBrowsers() {
      this.retries(3);

      browserSetup({
        aBrowser: browserLocal,
        accessToken: marty.token.access_token,
        spaceId: conversation.id,
        initialActivity: 'message'
      });

      browserSetup({
        aBrowser: browserRemote,
        accessToken: docbrown.token.access_token,
        spaceId: conversation.id,
        initialActivity: 'message'
      });

      browser.waitUntil(() =>
        browserRemote.isVisible(`[placeholder="Send a message to ${conversation.displayName}"]`) &&
        browserLocal.isVisible(`[placeholder="Send a message to ${conversation.displayName}"]`),
      10000, 'failed to load browsers and widgets');
    });

    describe('messaging', () => {
      it('sends and receives messages', () => {
        const martyText = 'Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?';
        const docText = 'The way I see it, if you\'re gonna build a time machine into a car, why not do it with some style?';
        const lorraineText = 'Marty, will we ever see you again?';
        const martyText2 = 'I guarantee it.';

        sendMessage({
          senderBrowser: browserRemote,
          message: martyText
        });
        verifyMessageReceipt({
          senderBrowser: browserLocal,
          receiverBrowser: browserRemote,
          message: martyText
        });

        sendMessage({
          senderBrowser: browserRemote,
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
          senderBrowser: browserLocal,
          message: martyText2
        });
        verifyMessageReceipt({
          senderBrowser: browserRemote,
          receiverBrowser: browserLocal,
          message: martyText2
        });
      });

      it('receives proper events on messages', () => {
        messageTests.messageEventTest({
          senderBrowser: browserLocal,
          sender: marty,
          receiverBrowser: browserRemote
        });
      });

      allMessagingTests({
        browserLocal,
        browserRemote
      });
    });

    describe('accessibility', () => {
      it('should have no accessibility violations', () =>
        runAxe(browserLocal, 'ciscospark-widget')
          .then((results) => {
            assert.equal(results.violations.length, 0);
          }));
    });
  });
}
