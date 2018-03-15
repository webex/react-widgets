import {switchToMeet} from '../../../lib/test-helpers/space-widget/main';
import {
  elements,
  hangupBeforeAnswerTest,
  declineIncomingCallTest,
  hangupDuringCallTest,
  setupOneOnOneUsers
} from '../../../lib/test-helpers/space-widget/meet';

describe('Widget Space: One on One', () => {
  describe('Data API', () => {
    const browserLocal = browser.select('browserLocal');
    const browserRemote = browser.select('browserRemote');
    let mccoy, spock;

    before('initialize test users', function intializeUsers() {
      ({mccoy, spock} = setupOneOnOneUsers());
    });

    it('can load browsers and widgets', function loadBrowsers() {
      this.retries(3);

      browser
        .url('/data-api/space.html')
        .execute(() => {
          localStorage.clear();
        });

      browserLocal.execute((localAccessToken, localToUserEmail) => {
        const csmmDom = document.createElement('div');
        csmmDom.setAttribute('class', 'ciscospark-widget');
        csmmDom.setAttribute('data-toggle', 'ciscospark-space');
        csmmDom.setAttribute('data-access-token', localAccessToken);
        csmmDom.setAttribute('data-to-person-email', localToUserEmail);
        csmmDom.setAttribute('data-initial-activity', 'message');
        document.getElementById('ciscospark-widget').appendChild(csmmDom);
        window.loadBundle('/dist-space/bundle.js');
      }, spock.token.access_token, mccoy.email);

      browserRemote.execute((localAccessToken, localToUserEmail) => {
        const csmmDom = document.createElement('div');
        csmmDom.setAttribute('class', 'ciscospark-widget');
        csmmDom.setAttribute('data-toggle', 'ciscospark-space');
        csmmDom.setAttribute('data-access-token', localAccessToken);
        csmmDom.setAttribute('data-to-person-email', localToUserEmail);
        csmmDom.setAttribute('data-initial-activity', 'message');
        csmmDom.setAttribute('on-event', 'message');
        document.getElementById('ciscospark-widget').appendChild(csmmDom);
        window.loadBundle('/dist-space/bundle.js');
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
          browserLocal.waitUntil(() =>
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
          hangupDuringCallTest(browserLocal, browserRemote);
        });
      });
    });
  });
});
