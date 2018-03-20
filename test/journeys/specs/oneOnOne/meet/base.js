import {switchToMeet} from '../../../lib/test-helpers/space-widget/main';
import {setupOneOnOneUsers} from '../../../lib/test-helpers';
import {clearEventLog} from '../../../lib/events';
import {
  elements,
  hangupBeforeAnswerTest,
  declineIncomingCallTest,
  hangupDuringCallTest,
  callEventTest
} from '../../../lib/test-helpers/space-widget/meet';

export default function oneOnOneMeetTests({name, browserSetup}) {
  describe(`Widget Space: One on One - Meet (${name})`, () => {
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

    it('can load browsers and widgets', function loadBrowsers() {
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

    describe('meet widget', () => {
      describe('pre call experience', () => {
        it('has a call button', () => {
          switchToMeet(browserLocal);
          browser.waitUntil(() =>
            browserLocal.isVisible(`${elements.meetWidget} ${elements.callButton}`),
          5000, 'call button is not visible');
        });
      });

      describe('during call experience', () => {
        it('can hangup before answer', () => {
          hangupBeforeAnswerTest(browserLocal, browserRemote);
        });

        it('can decline an incoming call', () => {
          declineIncomingCallTest(browserLocal, browserRemote);
        });

        it('can hangup in call', () => {
          clearEventLog(browserLocal);
          clearEventLog(browserRemote);
          hangupDuringCallTest(browserLocal, browserRemote);
        });

        it('has proper call event data', () => {
          callEventTest(
            {browser: browserLocal, user: spock, displayName: spock.displayName},
            {browser: browserRemote, user: mccoy, displayName: mccoy.displayName}
          );
        });
      });
    });
  });
}
