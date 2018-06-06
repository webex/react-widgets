import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/internal-plugin-conversation';
import '@ciscospark/plugin-logger';
import CiscoSpark from '@ciscospark/spark-core';

import {updateJobStatus} from '../../../lib/test-helpers';
import {switchToMeet} from '../../../lib/test-helpers/space-widget/main';
import {clearEventLog} from '../../../lib/events';
import {FEATURE_FLAG_ROSTER} from '../../../lib/test-helpers/space-widget/roster';
import {elements, declineIncomingCallTest, hangupDuringCallTest, callEventTest} from '../../../lib/test-helpers/space-widget/meet';

describe('Widget Space', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  const jobName = 'react-widget-space-global';

  let allPassed = true;
  let docbrown, lorraine, marty;
  let conversation, local, remote;

  before('load browsers', () => {
    browser.url('/space.html');
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
        .then(() => marty.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true));
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
        .then(() => docbrown.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true));
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
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        },
        spaceId
      };
      window.openSpaceWidget(options);
    }, marty.token.access_token, conversation.id);
  });

  before('inject docbrown token', () => {
    remote = {browser: browserRemote, user: docbrown, displayName: conversation.displayName};
    remote.browser.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        },
        spaceId
      };
      window.openSpaceWidget(options);
    }, docbrown.token.access_token, conversation.id);
  });

  describe('meet widget', () => {
    describe('pre call experience', () => {
      it('has a call button', () => {
        switchToMeet(browserLocal);
        browserLocal.waitForVisible(elements.callButton);
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
        clearEventLog(browserLocal);
        clearEventLog(browserRemote);
        hangupDuringCallTest(browserLocal, browserRemote, true);
      });

      it('has proper call event data', () => {
        callEventTest(local, remote, conversation);
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

  after('disconnect', () => Promise.all([
    marty.spark.internal.mercury.disconnect(),
    lorraine.spark.internal.mercury.disconnect()
  ]));
});
