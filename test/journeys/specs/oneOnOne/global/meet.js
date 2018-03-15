import {switchToMeet} from '../../../lib/test-helpers/space-widget/main';
import {clearEventLog} from '../../../lib/events';
import {
  elements,
  hangupBeforeAnswerTest,
  declineIncomingCallTest,
  hangupDuringCallTest,
  callEventTest,
  setupOneOnOneUsers
} from '../../../lib/test-helpers/space-widget/meet';

describe('Widget Space: One on One', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  let mccoy, spock;

  before('initialize test users', function initializeUsers() {
    ({mccoy, spock} = setupOneOnOneUsers());
  });

  it('can load browsers and widgets', function loadBrowsers() {
    this.retries(3);
    browser
      .url('/space.html?meet')
      .execute(() => {
        localStorage.clear();
      });

    browserLocal.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        },
        toPersonEmail: localToUserEmail,
        initialActivity: 'message'
      };
      window.openSpaceWidget(options);
    }, spock.token.access_token, mccoy.email);

    browserRemote.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        },
        toPersonEmail: localToUserEmail,
        initialActivity: 'message'
      };
      window.openSpaceWidget(options);
    }, mccoy.token.access_token, spock.email);

    browser.waitUntil(() =>
      browserRemote.isVisible(`[placeholder="Send a message to ${spock.displayName}"]`) &&
      browserLocal.isVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`),
    10000, 'failed to load browsers and widgets');
  });

  describe('meet widget', () => {
    describe('pre call experience', () => {
      it('has a call button', () => {
        switchToMeet(browserLocal);
        browserLocal.waitForVisible(`${elements.meetWidget} ${elements.callButton}`);
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
