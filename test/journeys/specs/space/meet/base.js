import allMeetTests from '../../../lib/constructors/meet';
import {setupGroupTestUsers} from '../../../lib/test-helpers';
import {clearEventLog} from '../../../lib/events';
import {
  hangupDuringCallTest,
  callEventTest,
  elements
} from '../../../lib/test-helpers/space-widget/meet';

export default function groupMeetTests({name, browserSetup}) {
  describe(`Widget Space: Group - Meet (${name})`, function groupMeet() {
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

    function loadBrowsers() {
      browserSetup({
        aBrowser: browserLocal,
        accessToken: marty.token.access_token,
        spaceId: conversation.id,
        initialActivity: 'meet'
      });

      browserSetup({
        aBrowser: browserRemote,
        accessToken: docbrown.token.access_token,
        spaceId: conversation.id,
        initialActivity: 'meet'
      });

      browser.waitUntil(() =>
        browserRemote.isVisible(elements.callButton) &&
        browserLocal.isVisible(elements.callButton),
      10000, 'failed to load browsers and widgets');
    }

    describe('Meet', function meet() {
      this.retries(2);
      allMeetTests({
        browserLocal,
        browserRemote,
        loadBrowsers
      });

      it('has proper call event data', () => {
        loadBrowsers();
        clearEventLog(browserLocal);
        clearEventLog(browserRemote);
        hangupDuringCallTest(browserLocal, browserRemote);
        callEventTest(
          {browser: browserLocal, user: marty, displayName: conversation.displayName},
          {browser: browserRemote, user: docbrown, displayName: conversation.displayName},
          conversation
        );
      });
    });
  });
}
