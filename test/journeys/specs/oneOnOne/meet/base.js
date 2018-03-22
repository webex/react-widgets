import allMeetTests from '../../../lib/constructors/meet';
import {setupOneOnOneUsers} from '../../../lib/test-helpers';
import {clearEventLog} from '../../../lib/events';
import {
  hangupDuringCallTest,
  callEventTest,
  elements
} from '../../../lib/test-helpers/space-widget/meet';

export default function oneOnOneMeetTests({name, browserSetup}) {
  describe(`Widget Space: One on One - Meet (${name})`, function meetTests() {
    const browserLocal = browser.select('1');
    const browserRemote = browser.select('2');
    let mccoy, spock, oneOnOneConversation;

    before('initialize test users', function intializeUsers() {
      ({mccoy, spock} = setupOneOnOneUsers());

      spock.spark.internal.device.register();

      browser.waitUntil(() =>
        spock.spark.internal.device.userId,
      15000, 'failed to register user devices');
    });

    it('can create one on one space', function createOneOnOneSpace() {
      this.retries(2);

      spock.spark.internal.conversation.create({
        participants: [spock, mccoy]
      }).then((c) => {
        oneOnOneConversation = c;
        return oneOnOneConversation;
      });

      browser.waitUntil(() => oneOnOneConversation && oneOnOneConversation.id,
        15000, 'failed to create one on one space');
    });

    function loadBrowsers() {
      browserSetup({
        aBrowser: browserLocal,
        accessToken: spock.token.access_token,
        toPersonEmail: mccoy.email,
        initialActivity: 'meet'
      });

      browserSetup({
        aBrowser: browserRemote,
        accessToken: mccoy.token.access_token,
        toPersonEmail: spock.email,
        initialActivity: 'meet'
      });

      browser.waitUntil(() =>
        browserRemote.isVisible(elements.callButton) &&
        browserLocal.isVisible(elements.callButton),
      10000, 'failed to open widgets with meet widget visible');
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
          {browser: browserLocal, user: spock, displayName: spock.displayName},
          {browser: browserRemote, user: mccoy, displayName: mccoy.displayName}
        );
      });
    });
  });
}

