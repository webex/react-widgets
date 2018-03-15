import {
  switchToMeet,
  elements as mainElements
} from '../../../lib/test-helpers/space-widget/main';
import {clearEventLog} from '../../../lib/events';
import {
  elements,
  declineIncomingCallTest,
  hangupDuringCallTest,
  callEventTest,
  setupGroupTestUsers
} from '../../../lib/test-helpers/space-widget/meet';

describe('Widget Space: Group - Browser Globals', () => {
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
      .url('/space.html')
      .execute(() => {
        localStorage.clear();
      });

    browserLocal.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        },
        spaceId
      };
      window.openSpaceWidget(options);
    }, marty.token.access_token, conversation.id);

    browserRemote.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        },
        spaceId
      };
      window.openSpaceWidget(options);
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
        browserLocal.waitForVisible(`${elements.meetWidget} ${elements.callButton}`);
      });
    });

    describe('during call experience', () => {
      it('can decline an incoming call', () => {
        declineIncomingCallTest(browserLocal, browserRemote, true);
      });

      it('can hangup in call', () => {
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

  after('disconnect', () => Promise.all([
    marty.spark.internal.mercury.disconnect(),
    lorraine.spark.internal.mercury.disconnect()
  ]));
});
