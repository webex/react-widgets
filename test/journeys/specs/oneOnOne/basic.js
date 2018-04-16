import {assert} from 'chai';

import runAxe from '../../lib/axe';
import {createTestUsers, createSpace} from '../../lib/sdk';
import RosterWidgetPage, {FEATURE_FLAG_ROSTER} from '../../lib/widgetPages/space/roster';
import activityMenuTests from '../../lib/constructors/activityMenu';

export default function oneOnOneBasicTests(type) {
  const widgetInit = {
    dataApi: 'loadWithDataApi',
    global: 'loadWithGlobals'
  };

  describe(`Widget Space: One on One - Basic (${type})`, () => {
    const localPage = new RosterWidgetPage({aBrowser: browser.select('1')});

    let mccoy, spock, oneOnOneSpace;

    before('initialize test users', () => {
      [mccoy, spock] = createTestUsers(2);
      localPage.user = spock;

      browser.call(() => spock.spark.internal.device.register()
        .then(() => spock.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true)));

      browser.waitUntil(() =>
        spock.spark.internal.device.userId,
      15000, 'failed to register user devices');
    });

    describe('Setup', () => {
      it('creates one on one space', function createOneOnOneSpace() {
        this.retries(2);
        oneOnOneSpace = createSpace({
          sparkInstance: spock.spark,
          participants: [spock, mccoy]
        });

        browser.waitUntil(() => oneOnOneSpace && oneOnOneSpace.id,
          15000, 'failed to create one on one space');
      });

      it('loads browser and widgets', function loadBrowsers() {
        this.retries(2);
        localPage.open('./space.html');

        localPage[widgetInit[type]]({
          toPersonEmail: mccoy.email,
          initialActivity: 'message'
        });

        browser.waitUntil(() =>
          localPage.hasMessageWidget,
        10000, 'failed to load local widget');
      });

      it('loads the user\'s name', () => {
        browser.waitUntil(() =>
          localPage.titleText !== 'Loading...',
        10000, 'failed to load widget title');
        assert.equal(localPage.titleText, mccoy.displayName);
      });
    });

    describe('Main Tests', () => {
      beforeEach(function testName() {
        localPage.setPageTestName(this.currentTest.title);
      });
      activityMenuTests(localPage);

      describe('Roster Widget', () => {
        it('opens', () => {
          localPage.openRoster();
        });

        it('has a close button', () => {
          assert.isTrue(localPage.hasCloseButton, 'cannot find button to close roster widget');
        });

        it('has the total count of participants', () => {
          assert.equal(localPage.rosterTitle, 'People (2)');
        });

        it('has the participants listed', () => {
          localPage.hasParticipants([mccoy, spock]);
        });

        it('closes the people roster widget', () => {
          localPage.closeRoster();
        });
      });

      describe('accessibility', () => {
        it('should have no accessibility violations', () =>
          runAxe(localPage.browser, 'ciscospark-widget')
            .then((results) => {
              assert.equal(results.violations.length, 0);
            }));
      });
    });
  });
}

['dataApi', 'global'].forEach((type) => oneOnOneBasicTests(type));
