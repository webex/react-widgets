/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';
import '@ciscospark/internal-plugin-feature';
import CiscoSpark from '@ciscospark/spark-core';
import testUsers from '@ciscospark/test-helper-test-users';

import {elements as rosterElements, FEATURE_FLAG_ROSTER} from '../../lib/test-helpers/roster';

describe(`Widget Space: One on One`, () => {
  const browserLocal = browser.select(`browserLocal`);
  const browserRemote = browser.select(`browserRemote`);

  const menuButton = `button[aria-label="Main Menu"]`;
  const activityMenu = `.ciscospark-activity-menu`;
  const controlsContainer = `.ciscospark-controls-container`;

  let userWithAllTheFeatures, userWithNoFeatures;
  process.env.CISCOSPARK_SCOPE = [
    `webexsquare:get_conversation`,
    `spark:people_read`,
    `spark:rooms_read`,
    `spark:rooms_write`,
    `spark:memberships_read`,
    `spark:memberships_write`,
    `spark:messages_read`,
    `spark:messages_write`,
    `spark:teams_read`,
    `spark:teams_write`,
    `spark:team_memberships_read`,
    `spark:team_memberships_write`,
    `spark:kms`
  ].join(` `);

  before(`load browsers`, () => {
    browser
      .url(`/?basic`)
      .execute(() => {
        localStorage.clear();
      });
  });

  before(`create main user`, () => testUsers.create({count: 1, config: {displayName: `All Features`}})
    .then((users) => {
      [userWithAllTheFeatures] = users;
      userWithAllTheFeatures.spark = new CiscoSpark({
        credentials: {
          authorization: userWithAllTheFeatures.token
        }
      });
      return userWithAllTheFeatures.spark.internal.device.register()
        .then(() => userWithAllTheFeatures.spark.internal.feature.setFeature(`user`, FEATURE_FLAG_ROSTER, true));
    }));

  before(`create basic user`, () => testUsers.create({count: 1, config: {displayName: `No Features`}})
    .then((users) => {
      [userWithNoFeatures] = users;
    }));

  before(`pause to let test users establish`, () => browser.pause(5000));

  before(`open widget local`, () => {
    browserLocal.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        toPersonEmail: localToUserEmail,
        initialActivity: `message`
      };
      window.openSpaceWidget(options);
    }, userWithAllTheFeatures.token.access_token, userWithNoFeatures.email);
    browserLocal.waitForVisible(`[placeholder="Send a message to ${userWithNoFeatures.displayName}"]`, 30000);
  });

  before(`open widget remote`, () => {
    browserRemote.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        toPersonEmail: localToUserEmail,
        initialActivity: `message`
      };
      window.openSpaceWidget(options);
    }, userWithNoFeatures.token.access_token, userWithAllTheFeatures.email);
    browserRemote.waitForVisible(`[placeholder="Send a message to ${userWithAllTheFeatures.displayName}"]`, 30000);
  });

  describe(`Feature Flags`, () => {
    describe(`Roster Feature Flag`, () => {
      it(`has a roster for user with feature flag`, () => {
        browserLocal.click(menuButton);
        browserLocal.waitForVisible(activityMenu);
        assert.isTrue(browserLocal.element(controlsContainer).element(rosterElements.peopleButton).isVisible());
      });

      it(`does not have a roster for user without flag`, () => {
        browserRemote.click(menuButton);
        browserRemote.waitForVisible(activityMenu);
        assert.isFalse(browserRemote.element(controlsContainer).element(rosterElements.peopleButton).isVisible());
      });
    });
  });

});
