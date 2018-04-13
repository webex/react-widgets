import {createTestUsers, createSpace} from '../../lib/sdk';

import featureFlagTests from '../../lib/helpers/space-widget/featureFlags';
import RosterWidgetPage, {FEATURE_FLAG_ROSTER} from '../../lib/widgetPages/space/roster';

import {FEATURE_FLAG_GROUP_CALLING} from '../../lib/helpers/space-widget/meet';

export default function spaceFeatureTests(type) {
  const widgetInit = {
    dataApi: 'loadWithDataApi',
    global: 'loadWithGlobals'
  };

  describe(`Widget Space - Features (${type})`, () => {
    const allFeaturesPage = new RosterWidgetPage({aBrowser: browser.select('1')});
    const noFeaturesPage = new RosterWidgetPage({aBrowser: browser.select('2')});

    let userWithAllTheFeatures, userWithNoFeatures1, userWithNoFeatures2, space;

    before('initialize test users', () => {
      [userWithAllTheFeatures, userWithNoFeatures1, userWithNoFeatures2] = createTestUsers(3);

      allFeaturesPage.user = userWithAllTheFeatures;
      noFeaturesPage.user = userWithNoFeatures1;

      userWithAllTheFeatures.spark.internal.device.register()
        .then(() => userWithAllTheFeatures.spark.internal.feature
          .setFeature('developer', FEATURE_FLAG_ROSTER, true))
        .then(() => userWithAllTheFeatures.spark.internal.feature
          .setFeature('developer', FEATURE_FLAG_GROUP_CALLING, true));

      userWithNoFeatures1.spark.internal.device.register()
        .then(() => userWithNoFeatures1.spark.internal.feature
          .setFeature('developer', FEATURE_FLAG_ROSTER, false))
        .then(() => userWithNoFeatures1.spark.internal.feature
          .setFeature('developer', FEATURE_FLAG_GROUP_CALLING, false));

      browser.waitUntil(() =>
        userWithAllTheFeatures.spark.internal.device.userId &&
        userWithNoFeatures1.spark.internal.device.userId,
      15000, 'failed to register user devices');
    });

    describe('Setup', () => {
      it('can create group space', function createOneOnOneSpace() {
        this.retries(2);

        space = createSpace({
          sparkInstance: userWithAllTheFeatures.spark,
          participants: [userWithNoFeatures1, userWithNoFeatures2, userWithAllTheFeatures]
        });

        browser.waitUntil(() =>
          space && space.id,
        15000, 'failed to create group space');
      });

      it('loads browsers and widgets', function loadGlobal() {
        allFeaturesPage.open('./space.html');
        noFeaturesPage.open('./space.html');

        allFeaturesPage[widgetInit[type]]({
          spaceId: space.id,
          initialActivity: 'message'
        });

        noFeaturesPage[widgetInit[type]]({
          spaceId: space.id,
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
        const title = `Space - Features - ${this.currentTest.title}`;
        allFeaturesPage.setPageTestName(title);
        noFeaturesPage.setPageTestName(title);
      });

      featureFlagTests({allFeaturesPage, noFeaturesPage});
    });
  });
}

['dataApi', 'global'].forEach((type) => spaceFeatureTests(type));
