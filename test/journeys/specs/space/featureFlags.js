import {
  createTestUsers,
  loadWithGlobals,
  loadWithDataApi
} from '../../lib/test-helpers';

import featureFlagTests from '../../lib/test-helpers/space-widget/featureFlags';
import {FEATURE_FLAG_ROSTER} from '../../lib/test-helpers/space-widget/roster';
import {FEATURE_FLAG_GROUP_CALLING} from '../../lib/test-helpers/space-widget/meet';


describe('Widget Space Feature Flags', () => {
  const browserLocal = browser.select('1');
  const browserRemote = browser.select('2');

  let conversation;
  let userWithAllTheFeatures, userWithNoFeatures1, userWithNoFeatures2;
  before('initialize test users', () => {
    ({
      userWithAllTheFeatures,
      userWithNoFeatures1,
      userWithNoFeatures2
    } = createTestUsers(3, {
      userWithAllTheFeatures: {displayName: 'Emmett Brown'},
      userWithNoFeatures1: {displayName: 'Lorraine Baines'},
      userWithNoFeatures2: {displayName: 'Marty McFly'}
    }));

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

  it('can create group space', function createOneOnOneSpace() {
    this.retries(2);

    userWithAllTheFeatures.spark.internal.conversation.create({
      displayName: 'Widget Feature Flag Test Space',
      participants: [userWithNoFeatures1, userWithNoFeatures2, userWithAllTheFeatures]
    }).then((c) => {
      conversation = c;
      return conversation;
    });

    browser.waitUntil(() => conversation && conversation.id,
      15000, 'failed to create group space');
  });

  describe('Browser Global', () => {
    it('loads browsers and widgets', function loadGlobal() {
      this.retries(2);

      browser
        .url('/space.html?basic')
        .execute(() => {
          localStorage.clear();
        });

      loadWithGlobals({
        aBrowser: browserLocal,
        accessToken: userWithAllTheFeatures.token.access_token,
        spaceId: conversation.id,
        initialActivity: 'message'
      });

      loadWithGlobals({
        aBrowser: browserRemote,
        accessToken: userWithNoFeatures1.token.access_token,
        spaceId: conversation.id,
        initialActivity: 'message'
      });

      browser.waitUntil(() =>
        browserLocal.isVisible(`[placeholder="Send a message to ${conversation.displayName}"]`) &&
        browserRemote.isVisible(`[placeholder="Send a message to ${conversation.displayName}"]`),
      15000, 'failed to load browsers and widgets');
    });

    featureFlagTests(browserLocal, browserRemote);
  });

  describe('Data API', () => {
    it('loads browsers and widgets', function loadDataApi() {
      this.retries(2);

      browser
        .url('/data-api/space.html')
        .execute(() => {
          localStorage.clear();
        });

      loadWithDataApi({
        aBrowser: browserLocal,
        bundle: '/dist-space/bundle.js',
        accessToken: userWithAllTheFeatures.token.access_token,
        spaceId: conversation.id,
        initialActivity: 'message'
      });

      loadWithDataApi({
        aBrowser: browserRemote,
        bundle: '/dist-space/bundle.js',
        accessToken: userWithNoFeatures1.token.access_token,
        spaceId: conversation.id,
        initialActivity: 'message'
      });

      browser.waitUntil(() =>
        browserLocal.isVisible(`[placeholder="Send a message to ${conversation.displayName}"]`) &&
        browserRemote.isVisible(`[placeholder="Send a message to ${conversation.displayName}"]`),
      15000, 'failed to load browsers and widgets');
    });

    featureFlagTests(browserLocal, browserRemote);
  });
});
