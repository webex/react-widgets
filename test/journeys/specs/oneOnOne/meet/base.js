import {assert} from 'chai';

import allMeetTests from '../../../lib/constructors/meet';
import {
  setupOneOnOneUsers,
  createSpace
} from '../../../lib/test-helpers/sdk';
import {clearEventLog} from '../../../lib/events';
import {
  removeWidget,
  setPageTestName
} from '../../../lib/test-helpers';
import {
  hangupDuringCallTest,
  callEventTest,
  elements
} from '../../../lib/test-helpers/space-widget/meet';

export default function oneOnOneMeetTests({name, browserSetup}) {
  describe(`Widget Space: One on One - Meet (${name})`, function meetTests() {
    this.retries(2);
    const browserLocal = browser.select('1');
    const browserRemote = browser.select('2');
    let mccoy, spock, space;

    before('initialize test users', function intializeUsers() {
      ({mccoy, spock} = setupOneOnOneUsers());

      browser.call(() => spock.spark.internal.device.register());

      assert.exists(mccoy.spark, 'failed to create mccoy test user');
      assert.exists(spock.spark.internal.device.userId, 'failed to register spock devices');
    });

    it('can create one on one space', function createOneOnOneSpace() {
      this.retries(2);
      space = createSpace({
        sparkInstance: spock.spark,
        participants: [spock, mccoy]
      });
      assert.exists(space.id, 'failed to create one on one space');
    });

    it('load initial browser page', function loadBrowser() {
      this.retries(2);
      browser.url('/space.html')
        .execute(() => {
          localStorage.clear();
        });
    });

    describe('Meet', function meet() {
      before(() => {
        browserSetup({
          aBrowser: browserLocal,
          accessToken: spock.token.access_token,
          toPersonEmail: mccoy.email,
          initialActivity: 'message'
        });

        browserSetup({
          aBrowser: browserRemote,
          accessToken: mccoy.token.access_token,
          toPersonEmail: spock.email,
          initialActivity: 'message'
        });

        browser.waitUntil(() =>
          browserRemote.isVisible(elements.messageWidget) &&
          browserLocal.isVisible(elements.messageWidget),
        15000, 'failed to open widgets with message widget visible');
      });

      beforeEach(function beforeEachTest() {
        setPageTestName(browser, this.currentTest.title);
      });

      allMeetTests({
        browserLocal,
        browserRemote,
        isGroup: false
      });

      it('has proper call event data', () => {
        clearEventLog(browserLocal);
        clearEventLog(browserRemote);
        hangupDuringCallTest({browserLocal, browserRemote, isGroup: false});
        callEventTest(
          {browser: browserLocal, user: spock, displayName: spock.displayName},
          {browser: browserRemote, user: mccoy, displayName: mccoy.displayName}
        );
      });

      after(() => {
        removeWidget(browser);
      });
    });
  });
}

