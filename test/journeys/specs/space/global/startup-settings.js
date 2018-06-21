import '@ciscospark/plugin-logger';
import CiscoSpark from '@ciscospark/spark-core';
import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/internal-plugin-conversation';

import {assert} from 'chai';

import {updateJobStatus} from '../../../lib/test-helpers';
import {elements} from '../../../lib/test-helpers/space-widget/main';
import {elements as rosterElements} from '../../../lib/test-helpers/space-widget/roster';

describe('Widget Space: Startup Settings', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  const jobName = 'react-widget-space-global';

  let allPassed = true;
  let docbrown, lorraine, marty;
  let conversation;

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
      return marty.spark.internal.mercury.connect();
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

  describe('spaceActivities setting', () => {
    it('displays error message for disabled initial activity', () => {
      browserLocal.execute((localAccessToken, spaceId) => {
        const options = {
          accessToken: localAccessToken,
          destinationId: spaceId,
          destinationType: 'spaceId',
          initialActivity: 'message',
          spaceActivities: {
            files: false,
            meet: false,
            message: false,
            people: true
          }
        };
        window.openSpaceWidget(options);
      }, marty.token.access_token, conversation.id);

      browserLocal.waitForVisible(elements.errorMessage);
      assert.equal(browserLocal.getText(elements.errorMessage), 'Error: The selected initial activity is invalid', 'does not display error message for invalid activity');
      browserLocal.refresh();
      browserRemote.refresh();
    });

    it('disables the files and meet activities', () => {
      browserLocal.execute((localAccessToken, spaceId) => {
        const options = {
          accessToken: localAccessToken,
          destinationId: spaceId,
          destinationType: 'spaceId',
          initialActivity: 'message',
          spaceActivities: {
            files: false,
            meet: false,
            message: true,
            people: true
          }
        };
        window.openSpaceWidget(options);
      }, marty.token.access_token, conversation.id);

      browserLocal.waitForVisible(elements.menuButton);
      browserLocal.click(elements.menuButton);
      browserLocal.waitForVisible(elements.activityMenu);
      browserLocal.waitForVisible(elements.messageButton);
      browserLocal.waitForVisible(rosterElements.peopleButton);
      assert.isFalse(browserLocal.isExisting(elements.meetButton), 'meet button exists in activity menu when it should be disabled');
      assert.isFalse(browserLocal.isExisting(elements.filesButton), 'files button exists in activity menu when it should be disabled');

      browserLocal.refresh();
      browserRemote.refresh();
    });
  });

  describe('legacy destination settings', () => {
    it('opens message widget using legacy spaceId', () => {
      browserLocal.execute((localAccessToken, spaceId) => {
        const options = {
          accessToken: localAccessToken,
          spaceId
        };
        window.openSpaceWidget(options);
      }, marty.token.access_token, conversation.id);

      browserLocal.waitForVisible(elements.messageWidget);
      browserLocal.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`);

      browserLocal.refresh();
      browserRemote.refresh();
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
