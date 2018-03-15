import {
  switchToMeet,
  elements as mainElements
} from '../../../lib/test-helpers/space-widget/main';
import {
  elements,
  declineIncomingCallTest,
  hangupDuringCallTest,
  setupGroupTestUsers
} from '../../../lib/test-helpers/space-widget/meet';

describe('Widget Space: Group - Data API', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  let docbrown, lorraine, marty;
  let conversation;

  before('initialize test users', () => {
    ({docbrown, lorraine, marty} = setupGroupTestUsers());
  });

  it('can create conversation', function createConversation() {
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

  it('can load browsers and widgets', function loadBrowsers() {
    this.retries(3);

    browser
      .url('/data-api/space.html')
      .execute(() => {
        localStorage.clear();
      });

    browserLocal.execute((localAccessToken, spaceId) => {
      const csmmDom = document.createElement('div');
      csmmDom.setAttribute('class', 'ciscospark-widget');
      csmmDom.setAttribute('data-toggle', 'ciscospark-space');
      csmmDom.setAttribute('data-access-token', localAccessToken);
      csmmDom.setAttribute('data-space-id', spaceId);
      csmmDom.setAttribute('data-initial-activity', 'message');
      document.getElementById('ciscospark-widget').appendChild(csmmDom);
      window.loadBundle('/dist-space/bundle.js');
    }, marty.token.access_token, conversation.id);

    browserRemote.execute((localAccessToken, spaceId) => {
      const csmmDom = document.createElement('div');
      csmmDom.setAttribute('class', 'ciscospark-widget');
      csmmDom.setAttribute('data-toggle', 'ciscospark-space');
      csmmDom.setAttribute('data-access-token', localAccessToken);
      csmmDom.setAttribute('data-space-id', spaceId);
      csmmDom.setAttribute('data-initial-activity', 'message');
      document.getElementById('ciscospark-widget').appendChild(csmmDom);
      window.loadBundle('/dist-space/bundle.js');
    }, docbrown.token.access_token, conversation.id);

    browser.waitUntil(() =>
      browserRemote.isVisible(mainElements.messageWidget) &&
      browserLocal.isVisible(mainElements.messageWidget),
    10000, 'failed to load browsers and widgets');
  });

  describe('meet widget', () => {
    describe('pre call experience', () => {
      it('has a call button', () => {
        switchToMeet(browserLocal);
        browserLocal.element(elements.meetWidget).element(elements.callButton).waitForVisible();
      });
    });

    describe('during call experience', () => {
      // it('can hangup before answer', () => {
      //   hangupBeforeAnswerTest(browserLocal, browserRemote);
      // });

      it('can decline an incoming call', () => {
        declineIncomingCallTest(browserLocal, browserRemote, true);
      });

      it('can hangup in call', () => {
        hangupDuringCallTest(browserLocal, browserRemote, true);
      });
    });
  });

  after('disconnect', () => Promise.all([
    marty.spark.internal.mercury.disconnect(),
    lorraine.spark.internal.mercury.disconnect()
  ]));
});
