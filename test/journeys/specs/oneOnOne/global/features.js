import {assert} from 'chai';
import '@ciscospark/internal-plugin-feature';
import '@ciscospark/plugin-logger';
import CiscoSpark from '@ciscospark/spark-core';
import testUsers from '@ciscospark/test-helper-test-users';

import {elements as rosterElements, FEATURE_FLAG_ROSTER} from '../../../lib/test-helpers/space-widget/roster';
import {updateJobStatus} from '../../../lib/test-helpers';

describe('Widget Space: One on One', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');

  const menuButton = 'button[aria-label="Main Menu"]';
  const activityMenu = '.ciscospark-activity-menu';
  const jobName = 'react-widget-oneOnOne-global';

  let allPassed = true;
  let userWithAllTheFeatures, userWithNoFeatures;

  before('load browsers', () => {
    browser.url('/space.html?basic');
  });

  before('create main user', () => testUsers.create({count: 1, config: {displayName: 'All Features'}})
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
        .then(() => userWithAllTheFeatures.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true));
    }));

  before('create basic user', () => testUsers.create({count: 1, config: {displayName: 'No Features'}})
    .then((users) => {
      [userWithNoFeatures] = users;
      userWithNoFeatures.spark = new CiscoSpark({
        credentials: {
          authorization: userWithNoFeatures.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return userWithNoFeatures.spark.internal.device.register()
        .then(() => userWithNoFeatures.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, false));
    }));

  before('pause to let test users establish', () => browser.pause(5000));

  before('open widget local', () => {
    browserLocal.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        toPersonEmail: localToUserEmail,
        initialActivity: 'message'
      };
      window.openSpaceWidget(options);
    }, userWithAllTheFeatures.token.access_token, userWithNoFeatures.email);
    browserLocal.waitForVisible(`[placeholder="Send a message to ${userWithNoFeatures.displayName}"]`);
  });

  before('open widget remote', () => {
    browserRemote.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        toPersonEmail: localToUserEmail,
        initialActivity: 'message'
      };
      window.openSpaceWidget(options);
    }, userWithNoFeatures.token.access_token, userWithAllTheFeatures.email);
    browserRemote.waitForVisible(`[placeholder="Send a message to ${userWithAllTheFeatures.displayName}"]`);
  });

  describe('Feature Flags', () => {
    describe('Roster Feature Flag', () => {
      it('has a roster for user with feature flag', () => {
        browserLocal.click(menuButton);
        browserLocal.waitForVisible(activityMenu);
        assert.isTrue(browserLocal.isVisible(rosterElements.peopleButton));
      });

      it('does not have a roster for user without flag', () => {
        browserRemote.click(menuButton);
        browserRemote.waitForVisible(activityMenu);
        assert.isFalse(browserRemote.isVisible(rosterElements.peopleButton));
      });
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
