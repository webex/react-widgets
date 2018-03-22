import {elements as mainElements} from '../../../lib/test-helpers/space-widget/main';
import {FEATURE_FLAG_ROSTER} from '../../../lib/test-helpers/space-widget/roster';
import {rosterFlagTests} from '../../../lib/test-helpers/space-widget/featureFlags';
import {setupOneOnOneUsers} from '../../../lib/test-helpers';

export default function oneOnOneFeatureTests({name, browserSetup}) {
  describe(`Widget Space: One on One - Features (${name})`, () => {
    const browserLocal = browser.select('1');
    const browserRemote = browser.select('2');

    let userWithAllTheFeatures, userWithNoFeatures, oneOnOneConversation;

    before('initialize test users', () => {
      ({mccoy: userWithAllTheFeatures, spock: userWithNoFeatures} = setupOneOnOneUsers());

      userWithAllTheFeatures.spark.internal.device.register()
        .then(() => userWithAllTheFeatures.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true));
      userWithNoFeatures.spark.internal.device.register()
        .then(() => userWithNoFeatures.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, false));

      browser.waitUntil(() =>
        userWithAllTheFeatures.spark.internal.device.userId &&
        userWithNoFeatures.spark.internal.device.userId,
      15000, 'failed to register user devices');
    });

    it('can create one on one space', function createOneOnOneSpace() {
      this.retries(2);

      userWithAllTheFeatures.spark.internal.conversation.create({
        participants: [userWithNoFeatures, userWithAllTheFeatures]
      }).then((c) => {
        oneOnOneConversation = c;
        return oneOnOneConversation;
      });

      browser.waitUntil(() => oneOnOneConversation && oneOnOneConversation.id,
        15000, 'failed to create one on one space');
    });

    it('loads browser and widgets', function loadBrowsers() {
      this.retries(3);

      browserSetup({
        aBrowser: browserLocal,
        accessToken: userWithAllTheFeatures.token.access_token,
        toPersonEmail: userWithNoFeatures.email
      });

      browserSetup({
        aBrowser: browserRemote,
        accessToken: userWithNoFeatures.token.access_token,
        toPersonEmail: userWithAllTheFeatures.email
      });

      browser.waitUntil(() =>
        browserLocal.isVisible(mainElements.messageWidget) &&
        browserRemote.isVisible(mainElements.messageWidget),
      10000, 'failed to load browsers and widgets');
    });

    rosterFlagTests(browserLocal, browserRemote);
  });
}
