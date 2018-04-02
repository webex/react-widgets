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
import MeetWidgetPage from '../../../lib/widgets/space/meet';

export default function oneOnOneMeetTests() {
  describe(`Widget Space: One on One - Meet`, function meetTests() {
    this.retries(2);
    const Local = new MeetWidgetPage(browser.select('1'));
    const Remote = new MeetWidgetPage(browser.select('2'));

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

