import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/plugin-phone';

import {switchToMeet} from '../../../lib/test-helpers/space-widget/main';
import {clearEventLog} from '../../../lib/events';
import {elements, hangupBeforeAnswerTest, declineIncomingCallTest, hangupDuringCallTest, callEventTest} from '../../../lib/test-helpers/space-widget/meet';

describe('Widget Space: One on One', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  let local, remote;
  let mccoy, spock;

  before('load browsers', () => {
    browser.url('/space.html?meet');
    browser.refresh();
  });

  before('create spock', () => testUsers.create({count: 1, config: {displayName: 'Mr Spock'}})
    .then((users) => {
      [spock] = users;
      local = {browser: browserLocal, user: spock, displayName: spock.displayName};
    }));

  before('create mccoy', () => testUsers.create({count: 1, config: {displayName: 'Bones Mccoy'}})
    .then((users) => {
      [mccoy] = users;
      remote = {browser: browserRemote, user: mccoy, displayName: mccoy.displayName};
    }));

  before('pause to let test users establish', () => browser.pause(7500));

  before('open local widget spock', () => {
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
    local.browser.waitForVisible(`[placeholder="Send a message to ${remote.displayName}"]`);
  });

  before('open remote widget mccoy', () => {
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
    remote.browser.waitForVisible(`[placeholder="Send a message to ${local.displayName}"]`);
  });

  describe('meet widget', () => {
    describe('pre call experience', () => {
      it('has a call button', () => {
        switchToMeet(browserLocal);
        browserLocal.element(elements.meetWidget).element(elements.callButton).waitForVisible();
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
        callEventTest(local, remote);
      });
    });
  });
});
