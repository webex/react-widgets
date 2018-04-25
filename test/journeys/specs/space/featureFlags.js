import '@ciscospark/internal-plugin-conversation';
import '@ciscospark/internal-plugin-feature';
import '@ciscospark/plugin-logger';
import CiscoSpark from '@ciscospark/spark-core';
import testUsers from '@ciscospark/test-helper-test-users';

import {updateJobStatus} from '../../lib/test-helpers';
import featureFlagTests from '../../lib/test-helpers/space-widget/featureFlags';
import {FEATURE_FLAG_ROSTER} from '../../lib/test-helpers/space-widget/roster';
import {FEATURE_FLAG_GROUP_CALLING} from '../../lib/test-helpers/space-widget/meet';


describe('Widget Space Feature Flags', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  const jobName = 'react-widget-space-global';

  let allPassed = true;
  let conversation;
  let userWithAllTheFeatures, userWithNoFeatures1, userWithNoFeatures2;

  before('create test users', () => Promise.all([
    testUsers.create({count: 1, config: {displayName: 'All Features'}})
      .then((users) => {
        [userWithAllTheFeatures] = users;
        userWithAllTheFeatures.spark = new CiscoSpark({
          credentials: {
            authorization: userWithAllTheFeatures.token
          },
          config: {
            logger: {
              level: 'error'
            }
          }
        });
        return userWithAllTheFeatures.spark.internal.device.register()
          .then(() => userWithAllTheFeatures.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true))
          .then(() => userWithAllTheFeatures.spark.internal.feature.setFeature('developer', FEATURE_FLAG_GROUP_CALLING, true));
      }),
    testUsers.create({count: 2, config: {displayName: 'No Features'}})
      .then((users) => {
        [userWithNoFeatures1, userWithNoFeatures2] = users;
        userWithNoFeatures1.spark = new CiscoSpark({
          credentials: {
            authorization: userWithNoFeatures1.token
          },
          config: {
            logger: {
              level: 'error'
            }
          }
        });
        return userWithNoFeatures1.spark.internal.device.register()
          .then(() => userWithNoFeatures1.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, false))
          .then(() => userWithNoFeatures1.spark.internal.feature.setFeature('developer', FEATURE_FLAG_GROUP_CALLING, false));
      })
  ]));

  before('pause to let test users establish', () => browser.pause(5000));

  before('create space', () => userWithAllTheFeatures.spark.internal.conversation.create({
    displayName: 'Widget Feature Flag Test Space',
    participants: [userWithAllTheFeatures, userWithNoFeatures1, userWithNoFeatures2]
  }).then((c) => {
    conversation = c;
    return conversation;
  }));

  describe('Browser Global', () => {
    before('load browsers', () => {
      browser.url('/space.html?basic');
    });

    before('open widget local', () => {
      browserLocal.execute((localAccessToken, spaceId) => {
        const options = {
          accessToken: localAccessToken,
          spaceId,
          initialActivity: 'message'
        };
        window.openSpaceWidget(options);
      }, userWithAllTheFeatures.token.access_token, conversation.id);
      browserLocal.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`);
    });

    before('open widget remote', () => {
      browserRemote.execute((localAccessToken, spaceId) => {
        const options = {
          accessToken: localAccessToken,
          spaceId,
          initialActivity: 'message'
        };
        window.openSpaceWidget(options);
      }, userWithNoFeatures1.token.access_token, conversation.id);
      browserRemote.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`);
    });

    describe('Feature Flag Tests', () => {
      featureFlagTests(browserLocal, browserRemote);
    });
  });

  describe('Data API', () => {
    before('load browsers', () => {
      browser.url('/data-api/space.html');
    });

    before('open widget local', () => {
      browserLocal.execute((localAccessToken, spaceId) => {
        const csmmDom = document.createElement('div');
        csmmDom.setAttribute('class', 'ciscospark-widget');
        csmmDom.setAttribute('data-toggle', 'ciscospark-space');
        csmmDom.setAttribute('data-access-token', localAccessToken);
        csmmDom.setAttribute('data-space-id', spaceId);
        csmmDom.setAttribute('data-initial-activity', 'message');
        document.getElementById('ciscospark-widget').appendChild(csmmDom);
        window.loadBundle('/dist-space/bundle.js');
      }, userWithAllTheFeatures.token.access_token, conversation.id);
      browserLocal.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`);
    });

    before('open widget remote', () => {
      browserRemote.execute((localAccessToken, spaceId) => {
        const csmmDom = document.createElement('div');
        csmmDom.setAttribute('class', 'ciscospark-widget');
        csmmDom.setAttribute('data-toggle', 'ciscospark-space');
        csmmDom.setAttribute('data-access-token', localAccessToken);
        csmmDom.setAttribute('data-space-id', spaceId);
        csmmDom.setAttribute('data-initial-activity', 'message');
        document.getElementById('ciscospark-widget').appendChild(csmmDom);
        window.loadBundle('/dist-space/bundle.js');
      }, userWithNoFeatures1.token.access_token, conversation.id);
      browserRemote.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`);
    });

    describe('Feature Flag Tests', () => {
      featureFlagTests(browserLocal, browserRemote);
    });
  });

  /* eslint-disable-next-line func-names */
  afterEach(function () {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after(() => {
    updateJobStatus(jobName, allPassed);
  });
});
