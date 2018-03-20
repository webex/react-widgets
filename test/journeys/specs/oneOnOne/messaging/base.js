import {assert} from 'chai';

import {
  messageTests,
  sendMessage,
  verifyMessageReceipt
} from '../../../lib/test-helpers/space-widget/messaging';
import allMessagingTests from '../../../lib/constructors/messaging';
import {setupOneOnOneUsers} from '../../../lib/test-helpers';
import {runAxe} from '../../../lib/axe';

export default function oneOnOneMessageTests({name, browserSetup}) {
  describe(`Widget Space: One On One - Messaging (${name})`, () => {
    const browserLocal = browser.select('browserLocal');
    const browserRemote = browser.select('browserRemote');
    let mccoy, spock, oneOnOneConversation;

    before('initialize test users', function intializeUsers() {
      ({mccoy, spock} = setupOneOnOneUsers());

      mccoy.spark.internal.device.register();

      browser.waitUntil(() =>
        mccoy.spark.internal.device.userId,
      15000, 'failed to register user devices');
    });

    it('creates one on one space', function createOneOnOneSpace() {
      this.retries(2);

      mccoy.spark.internal.conversation.create({
        participants: [mccoy, spock]
      }).then((c) => {
        oneOnOneConversation = c;
        return oneOnOneConversation;
      });

      browser.waitUntil(() => oneOnOneConversation && oneOnOneConversation.id,
        15000, 'failed to create one on one space');
    });

    it('loads browsers and widgets', function loadBrowsers() {
      this.retries(3);

      browserSetup({
        aBrowser: browserLocal,
        accessToken: spock.token.access_token,
        toPersonEmail: mccoy.email
      });

      browserSetup({
        aBrowser: browserRemote,
        accessToken: mccoy.token.access_token,
        toPersonEmail: spock.email
      });

      browser.waitUntil(() =>
        browserRemote.isVisible(`[placeholder="Send a message to ${spock.displayName}"]`) &&
        browserLocal.isVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`),
      10000, 'failed to load browsers and widgets');
    });
    describe('message widget', () => {
      it('sends and receives messages', () => {
        const message = 'Oh, I am sorry, Doctor. Were we having a good time?';
        sendMessage({
          senderBrowser: browserLocal,
          message
        });
        verifyMessageReceipt({
          senderBrowser: browserRemote,
          receiverBrowser: browserLocal,
          message
        });
      });

      it('receives proper events on messages', () => {
        messageTests.messageEventTest({
          senderBrowser: browserLocal,
          sender: spock,
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
