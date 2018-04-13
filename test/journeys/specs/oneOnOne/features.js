import {rosterFlagTests} from '../../lib/helpers/space-widget/featureFlags';
import {createTestUsers, createSpace} from '../../lib/sdk';

import RosterWidgetPage, {FEATURE_FLAG_ROSTER} from '../../lib/widgetPages/space/roster';

export default function oneOnOneFeatureTests(type) {
  const widgetInit = {
    dataApi: 'loadWithDataApi',
    global: 'loadWithGlobals'
  };

  describe(`Widget Space: One on One - Features (${type})`, () => {
    const allFeaturesPage = new RosterWidgetPage({aBrowser: browser.select('1')});
    const noFeaturesPage = new RosterWidgetPage({aBrowser: browser.select('2')});

    let userWithAllTheFeatures, userWithNoFeatures, oneOnOneSpace;

    before('initialize test users', () => {
      [userWithAllTheFeatures, userWithNoFeatures] = createTestUsers(2);

      allFeaturesPage.user = userWithAllTheFeatures;
      noFeaturesPage.user = userWithNoFeatures;

      userWithAllTheFeatures.spark.internal.device.register()
        .then(() => userWithAllTheFeatures.spark.internal.feature
          .setFeature('developer', FEATURE_FLAG_ROSTER, true));
      userWithNoFeatures.spark.internal.device.register()
        .then(() => userWithNoFeatures.spark.internal.feature
          .setFeature('developer', FEATURE_FLAG_ROSTER, false));

      browser.waitUntil(() =>
        userWithAllTheFeatures.spark.internal.device.userId &&
        userWithNoFeatures.spark.internal.device.userId,
      15000, 'failed to register user devices');
    });

    describe('Setup', () => {
      it('can create one on one space', function createOneOnOneSpace() {
        this.retries(2);

        oneOnOneSpace = createSpace({
          sparkInstance: userWithAllTheFeatures.spark,
          participants: [userWithNoFeatures, userWithAllTheFeatures]
        });

        browser.waitUntil(() =>
          oneOnOneSpace && oneOnOneSpace.id,
        15000, 'failed to create one on one space');
      });

      it('loads browser and widgets', function loadBrowsers() {
        allFeaturesPage.open('./space.html');
        noFeaturesPage.open('./space.html');

        allFeaturesPage[widgetInit[type]]({
          toPersonEmail: userWithNoFeatures.email,
          initialActivity: 'message'
        });

        noFeaturesPage[widgetInit[type]]({
          toPersonEmail: userWithAllTheFeatures.email,
          initialActivity: 'message'
        });

        browser.waitUntil(() =>
          allFeaturesPage.hasMessageWidget &&
          noFeaturesPage.hasMessageWidget,
        10000, 'failed to load browsers and widgets');
      });
    });

    describe('Main Tests', function main() {
      beforeEach(function testName() {
        const title = `One On One - Features - ${this.currentTest.title}`;
        allFeaturesPage.setPageTestName(title);
        noFeaturesPage.setPageTestName(title);
      });

      rosterFlagTests({allFeaturesPage, noFeaturesPage});
    });
  });
}

['dataApi', 'global'].forEach((type) => oneOnOneFeatureTests(type));
