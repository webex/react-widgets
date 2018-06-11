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


  before('inject token', () => {
    browserLocal.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        },
        toPersonEmail: localToUserEmail,
        initialActivity: 'message'
      };
      window.openSpaceWidget(options);
    }, marty.token.access_token, docbrown.email);
  });

  describe('message widget', () => {
    before('open remote widget', () => {
      browserRemote.execute((localAccessToken, localToUserEmail) => {
        const options = {
          accessToken: localAccessToken,
          onEvent: (eventName, detail) => {
            window.ciscoSparkEvents.push({eventName, detail});
          },
          toPersonEmail: localToUserEmail,
          initialActivity: 'message',
          spaceActivities: {
            files: false,
            meet: false,
            message: false,
            people: true
          }
        };
        window.openSpaceWidget(options);
      }, docbrown.token.access_token, marty.email);
    });

    it('displays error message for disabled initial activity', () => {
      browserRemote.waitForVisible(elements.errorMessage);
      assert.equal(browserRemote.getText(elements.errorMessage), 'Error: The selected initial activity is invalid', 'does not display error message for invalid activity');
      browserRemote.refresh();
    });
  });

  describe('message widget', () => {
    before('open remote widget', () => {
      browserRemote.execute((localAccessToken, localToUserEmail) => {
        const options = {
          accessToken: localAccessToken,
          onEvent: (eventName, detail) => {
            window.ciscoSparkEvents.push({eventName, detail});
          },
          toPersonEmail: localToUserEmail,
          initialActivity: 'message',
          spaceActivities: {
            files: false,
            meet: false,
            message: true,
            people: true
          }
        };
        window.openSpaceWidget(options);
      }, docbrown.token.access_token, marty.email);
    });

    it('disables the files and meet activities', () => {
      browserRemote.waitForVisible(elements.menuButton);
      browserRemote.click(elements.menuButton);
      browserRemote.waitForVisible(elements.activityMenu);
      browserRemote.waitForVisible(elements.messageButton);
      browserRemote.waitForVisible(rosterElements.peopleButton);
      assert.isFalse(browserRemote.isExisting(elements.meetButton), 'meet button exists in activity menu when it should be disabled');
      assert.isFalse(browserRemote.isExisting(elements.filesButton), 'files button exists in activity menu when it should be disabled');
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
