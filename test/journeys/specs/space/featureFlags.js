import '@ciscospark/internal-plugin-conversation';
import '@ciscospark/internal-plugin-feature';
import '@ciscospark/plugin-logger';
import CiscoSpark from '@ciscospark/spark-core';
import testUsers from '@ciscospark/test-helper-test-users';

import featureFlagTests from '../../lib/test-helpers/space-widget/featureFlags';
import {FEATURE_FLAG_ROSTER} from '../../lib/test-helpers/space-widget/roster';
import {FEATURE_FLAG_GROUP_CALLING} from '../../lib/test-helpers/space-widget/meet';


describe(`Widget Space Feature Flags`, () => {
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

  const browserLocal = browser.select(`browserLocal`);
  const browserRemote = browser.select(`browserRemote`);

  let conversation;
  let userWithAllTheFeatures, userWithNoFeatures1, userWithNoFeatures2;

  before(`create test users`, () => Promise.all([
    testUsers.create({count: 1, config: {displayName: `All Features`}})
      .then((users) => {
        [userWithAllTheFeatures] = users;
        userWithAllTheFeatures.spark = new CiscoSpark({
          credentials: {
            authorization: userWithAllTheFeatures.token
          },
          config: {
            logger: {
              level: `error`
            }
          }
        });
        return userWithAllTheFeatures.spark.internal.device.register()
          .then(() => userWithAllTheFeatures.spark.internal.feature.setFeature(`developer`, FEATURE_FLAG_ROSTER, true))
          .then(() => userWithAllTheFeatures.spark.internal.feature.setFeature(`developer`, FEATURE_FLAG_GROUP_CALLING, true));
      }),
    testUsers.create({count: 2, config: {displayName: `No Features`}})
      .then((users) => {
        [userWithNoFeatures1, userWithNoFeatures2] = users;
      })
  ]));

  before(`pause to let test users establish`, () => browser.pause(5000));

  before(`create space`, () => userWithAllTheFeatures.spark.internal.conversation.create({
    displayName: `Widget Feature Flag Test Space`,
    participants: [userWithAllTheFeatures, userWithNoFeatures1, userWithNoFeatures2]
  }).then((c) => {
    conversation = c;
    return conversation;
  }));

  describe(`Browser Global`, () => {

    before(`load browsers`, () => {
      browser
        .url(`/?basic`)
        .execute(() => {
          localStorage.clear();
        });
    });

    before(`open widget local`, () => {
      browserLocal.execute((localAccessToken, spaceId) => {
        const options = {
          accessToken: localAccessToken,
          spaceId,
          initialActivity: `message`
        };
        window.openSpaceWidget(options);
      }, userWithAllTheFeatures.token.access_token, conversation.id);
      browserLocal.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`, 30000);
    });

    before(`open widget remote`, () => {
      browserRemote.execute((localAccessToken, spaceId) => {
        const options = {
          accessToken: localAccessToken,
          spaceId,
          initialActivity: `message`
        };
        window.openSpaceWidget(options);
      }, userWithNoFeatures1.token.access_token, conversation.id);
      browserRemote.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`, 30000);
    });

    describe(`Feature Flag Tests`, () => {
      featureFlagTests(browserLocal, browserRemote);
    });
  });

  describe(`Data API`, () => {
    before(`load browsers`, () => {
      browser
        .url(`/data-api/space.html`)
        .execute(() => {
          localStorage.clear();
        });
    });

    before(`open widget local`, () => {
      browserLocal.execute((localAccessToken, spaceId) => {
        const csmmDom = document.createElement(`div`);
        csmmDom.setAttribute(`class`, `ciscospark-widget`);
        csmmDom.setAttribute(`data-toggle`, `ciscospark-space`);
        csmmDom.setAttribute(`data-access-token`, localAccessToken);
        csmmDom.setAttribute(`data-space-id`, spaceId);
        csmmDom.setAttribute(`data-initial-activity`, `message`);
        document.getElementById(`ciscospark-widget`).appendChild(csmmDom);
        window.loadBundle(`/dist/bundle.js`);
      }, userWithAllTheFeatures.token.access_token, conversation.id);
      browserLocal.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`, 30000);
    });

    before(`open widget remote`, () => {
      browserRemote.execute((localAccessToken, spaceId) => {
        const csmmDom = document.createElement(`div`);
        csmmDom.setAttribute(`class`, `ciscospark-widget`);
        csmmDom.setAttribute(`data-toggle`, `ciscospark-space`);
        csmmDom.setAttribute(`data-access-token`, localAccessToken);
        csmmDom.setAttribute(`data-space-id`, spaceId);
        csmmDom.setAttribute(`data-initial-activity`, `message`);
        document.getElementById(`ciscospark-widget`).appendChild(csmmDom);
        window.loadBundle(`/dist/bundle.js`);
      }, userWithNoFeatures1.token.access_token, conversation.id);
      browserRemote.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`, 30000);
    });

    describe(`Feature Flag Tests`, () => {
      featureFlagTests(browserLocal, browserRemote);
    });
  });
});
