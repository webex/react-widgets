import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/internal-plugin-conversation';
import '@ciscospark/plugin-logger';
import CiscoSpark from '@ciscospark/spark-core';

import {switchToMeet} from '../../../lib/test-helpers/space-widget/main';
import {FEATURE_FLAG_ROSTER} from '../../../lib/test-helpers/space-widget/roster';
import {elements, declineIncomingCallTest, hangupDuringCallTest, FEATURE_FLAG_GROUP_CALLING} from '../../../lib/test-helpers/space-widget/meet';

describe('Widget Space', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  let docbrown, lorraine, marty;
  let conversation, local, remote;

  process.env.CISCOSPARK_SCOPE = [
    'webexsquare:get_conversation',
    'spark:people_read',
    'spark:rooms_read',
    'spark:rooms_write',
    'spark:memberships_read',
    'spark:memberships_write',
    'spark:messages_read',
    'spark:messages_write',
    'spark:teams_read',
    'spark:teams_write',
    'spark:team_memberships_read',
    'spark:team_memberships_write',
    'spark:kms'
  ].join(' ');

  before('load browsers', () => {
    browser
      .url('/data-api/space.html')
      .execute(() => {
        localStorage.clear();
      });
  });

  before('create marty', () => testUsers.create({count: 1, config: {displayName: 'Marty McFly'}})
    .then((users) => {
      [marty] = users;
      marty.spark = new CiscoSpark({
        credentials: {
          authorization: marty.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return marty.spark.internal.mercury.connect()
        .then(() => marty.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true))
        .then(() => marty.spark.internal.feature.setFeature('developer', FEATURE_FLAG_GROUP_CALLING, true));
    }));

  before('create docbrown', () => testUsers.create({count: 1, config: {displayName: 'Emmett Brown'}})
    .then((users) => {
      [docbrown] = users;
      docbrown.spark = new CiscoSpark({
        credentials: {
          authorization: docbrown.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return docbrown.spark.internal.device.register()
        .then(() => docbrown.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true))
        .then(() => docbrown.spark.internal.feature.setFeature('developer', FEATURE_FLAG_GROUP_CALLING, true));
    }));

  before('create lorraine', () => testUsers.create({count: 1, config: {displayName: 'Lorraine Baines'}})
    .then((users) => {
      [lorraine] = users;
      lorraine.spark = new CiscoSpark({
        credentials: {
          authorization: lorraine.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return lorraine.spark.internal.mercury.connect();
    }));

  before('pause to let test users establish', () => browser.pause(5000));

  after('disconnect', () => Promise.all([
    marty.spark.internal.mercury.disconnect(),
    lorraine.spark.internal.mercury.disconnect()
  ]));

  before('create space', () => marty.spark.internal.conversation.create({
    displayName: 'Test Widget Space',
    participants: [marty, docbrown, lorraine]
  }).then((c) => {
    conversation = c;
    return conversation;
  }));

  before('inject marty token', () => {
    local = {browser: browserLocal, user: marty, displayName: conversation.displayName};
    local.browser.execute((localAccessToken, spaceId) => {
      const csmmDom = document.createElement('div');
      csmmDom.setAttribute('class', 'ciscospark-widget');
      csmmDom.setAttribute('data-toggle', 'ciscospark-space');
      csmmDom.setAttribute('data-access-token', localAccessToken);
      csmmDom.setAttribute('data-space-id', spaceId);
      csmmDom.setAttribute('data-initial-activity', 'message');
      document.getElementById('ciscospark-widget').appendChild(csmmDom);
      window.loadBundle('/dist-space/bundle.js');
    }, marty.token.access_token, conversation.id);
    const spaceWidget = '.ciscospark-space-widget';
    local.browser.waitForVisible(spaceWidget);
    local.browser.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`);
  });

  before('inject docbrown token', () => {
    remote = {browser: browserRemote, user: docbrown, displayName: conversation.displayName};
    remote.browser.execute((localAccessToken, spaceId) => {
      const csmmDom = document.createElement('div');
      csmmDom.setAttribute('class', 'ciscospark-widget');
      csmmDom.setAttribute('data-toggle', 'ciscospark-space');
      csmmDom.setAttribute('data-access-token', localAccessToken);
      csmmDom.setAttribute('data-space-id', spaceId);
      csmmDom.setAttribute('data-initial-activity', 'message');
      document.getElementById('ciscospark-widget').appendChild(csmmDom);
      window.loadBundle('/dist-space/bundle.js');
    }, docbrown.token.access_token, conversation.id);
    const spaceWidget = '.ciscospark-space-widget';
    remote.browser.waitForVisible(spaceWidget);
    remote.browser.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`);
  });

  describe('meet widget', () => {
    describe('pre call experience', () => {
      it('has a call button', () => {
        switchToMeet(browserLocal);
        browserLocal.element(elements.meetWidget).element(elements.callButton).waitForVisible();
      });
    });

    describe('during call experience', () => {
      it('can hangup before answer', () => {
        // hangupBeforeAnswerTest(browserLocal, browserRemote);
      });

      it('can decline an incoming call', () => {
        declineIncomingCallTest(browserLocal, browserRemote, true);
      });

      it('can hangup in call', () => {
        hangupDuringCallTest(browserLocal, browserRemote, true);
      });
    });
  });
});
