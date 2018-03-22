import {assert} from 'chai';

import allMeetTests from '../../../lib/constructors/meet';
import {
  setupOneOnOneUsers,
  createSpace
} from '../../../lib/test-helpers/sdk';
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
    let mccoy, spock, space;

    before('initialize test users', function intializeUsers() {
      ({mccoy, spock} = setupOneOnOneUsers());

      browser.call(() => spock.spark.internal.device.register());

      assert.exists(mccoy.spark, 'failed to create mccoy test user');
      assert.exists(spock.spark.internal.device.userId, 'failed to register spock devices');
    });

    it('load initial browser page', function loadBrowser() {
      this.retries(2);
      browser.url('/space.html')
        .execute(() => {
          localStorage.clear();
        });
      browser.waitUntil(() =>
        browser.isVisible('#ciscospark-widget'),
      15000, 'failed to load test page in browser');
    });

    it('can create one on one space', function createOneOnOneSpace() {
      this.retries(2);
      space = createSpace({
        sparkInstance: spock.spark,
        participants: [spock, mccoy]
      });
      assert.exists(space.id, 'failed to create one on one space');
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
      15000, 'failed to open widgets with meet widget visible');
    }

    describe('Meet', function meet() {
      this.retries(2);

      // allMeetTests({
      //   browserLocal,
      //   browserRemote,
      //   loadBrowsers
      // });

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

