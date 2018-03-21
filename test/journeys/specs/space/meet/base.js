import {setupGroupTestUsers} from '../../../lib/test-helpers';
import {switchToMeet} from '../../../lib/test-helpers/space-widget/main';
import {clearEventLog} from '../../../lib/events';
import {
  elements,
  declineIncomingCallTest,
  hangupDuringCallTest,
  callEventTest
} from '../../../lib/test-helpers/space-widget/meet';

export default function groupMeetTests({name, browserSetup}) {
  describe(`Widget Space: Group - Meet (${name})`, function groupMeet() {
    this.retries(2);
    const browserLocal = browser.select('1');
    const browserRemote = browser.select('2');
    let docbrown, lorraine, marty;
    let conversation;

    before('initialize test users', () => {
      ({docbrown, lorraine, marty} = setupGroupTestUsers());

      marty.spark.internal.device.register();

      browser.waitUntil(() => marty.spark.internal.device.userId,
        15000, 'failed to register marty');
    });

    it('creates conversation', function createConversation() {
      this.retries(2);

      marty.spark.internal.conversation.create({
        displayName: 'Test Widget Space',
        participants: [marty, docbrown, lorraine]
      }).then((c) => {
        conversation = c;
        return conversation;
      });

      browser.waitUntil(() => conversation && conversation.id,
        15000, 'failed to create conversation');
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

    it('has a call button before active call', () => {
      switchToMeet(browserLocal);
      browser.waitUntil(() =>
        browserLocal.isVisible(elements.callButton),
      5000, 'call button is not visible after switching to meet widget');
    });

    it('declines an incoming call', function declineIncoming() {
      declineIncomingCallTest(browserLocal, browserRemote, true);
    });

    it('hangs up active call', function hangupActive() {
      clearEventLog(browserLocal);
      clearEventLog(browserRemote);
      hangupDuringCallTest(browserLocal, browserRemote, true);
    });

    it('has proper call event data', () => {
      callEventTest(
        {browser: browserLocal, user: marty, displayName: conversation.displayName},
        {browser: browserRemote, user: docbrown, displayName: conversation.displayName},
        conversation
      );
    });
  });
}
