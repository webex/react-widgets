import {assert} from 'chai';

import runAxe from '../../lib/axe';
import {createTestUsers, createSpace} from '../../lib/sdk';
import RosterWidgetPage, {FEATURE_FLAG_ROSTER} from '../../lib/widgetPages/space/roster';
import activityMenuTests from '../../lib/constructors/activityMenu';


export default function groupBasicTests(type) {
  const widgetInit = {
    dataApi: 'loadWithDataApi',
    global: 'loadWithGlobals'
  };
  describe(`Widget Space: Group - Basic (${type})`, () => {
    const localPage = new RosterWidgetPage({aBrowser: browser.select('1')});
    let biff, docbrown, lorraine, marty, space;

    before('initialize test users', () => {
      [marty, biff, docbrown, lorraine] = createTestUsers(4);
      localPage.user = marty;

      browser.call(() => marty.spark.internal.device.register()
        .then(() => marty.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true)));

      browser.waitUntil(() =>
        marty.spark.internal.device.userId,
      15000, 'failed to register user devices');
    });

    describe('Setup', () => {
      it('creates group space', function createGroupSpace() {
        this.retries(2);
        space = createSpace({
          sparkInstance: marty.spark,
          participants: [marty, docbrown, lorraine],
          displayName: 'Test Widget Space'
        });

        browser.waitUntil(() => space && space.id,
          15000, 'failed to create group space');
      });

      it('loads browser and widgets', function loadBrowsers() {
        this.retries(2);
        localPage.open('./space.html');

        localPage[widgetInit[type]]({
          spaceId: space.id
        });

        browser.waitUntil(() =>
          localPage.hasMessageWidget,
        10000, 'failed to laod browser and widgets');
      });

      it('loads the space\'s name', () => {
        browser.waitUntil(() =>
          localPage.titleText !== 'Loading...',
        10000, 'failed to load widget title');
        assert.equal(localPage.titleText, space.displayName);
      });
    });

    describe('Main Tests', function main() {
      beforeEach(function testName() {
        localPage.setPageTestName(`Space - Basic - ${this.currentTest.title}`);
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
          assert.equal(localPage.rosterTitle, 'People (3)');
        });

        it('has the participants listed', () => {
          localPage.hasParticipants([marty, docbrown, lorraine]);
        });

        it('has search for participants', () => {
          localPage.canSearchForParticipants();
        });

        it('searches and adds person to space', () => {
          localPage.searchAndAddPerson({
            searchString: biff.email,
            searchResult: biff.displayName
          });
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


['dataApi', 'global'].forEach((type) => groupBasicTests(type));
