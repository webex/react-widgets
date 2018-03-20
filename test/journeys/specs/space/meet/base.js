import {setupGroupTestUsers} from '../../../lib/test-helpers';
import {
  switchToMeet,
  elements as mainElements
} from '../../../lib/test-helpers/space-widget/main';
import {clearEventLog} from '../../../lib/events';
import {
  elements,
  declineIncomingCallTest,
  hangupDuringCallTest,
  callEventTest
} from '../../../lib/test-helpers/space-widget/meet';

export default function groupMeetTests({name, browserSetup}) {
  describe(`Widget Space: Group - Meet (${name})`, () => {
    const browserLocal = browser.select('browserLocal');
    const browserRemote = browser.select('browserRemote');
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
        browserRemote.isVisible(mainElements.messageWidget) &&
        browserLocal.isVisible(mainElements.messageWidget),
      10000, 'failed to load browsers and widgets');
    });

    describe('meet widget', () => {
      it('has a call button before active call', () => {
        switchToMeet(browserLocal);
        browserLocal.waitForVisible(`${elements.meetWidget} ${elements.callButton}`);
      });

      it('declines an incoming call', () => {
        declineIncomingCallTest(browserLocal, browserRemote, true);
      });

      it('hangs up active call', () => {
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
  });
}
