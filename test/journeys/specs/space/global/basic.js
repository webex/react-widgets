import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/plugin-logger';
import CiscoSpark from '@ciscospark/spark-core';
import '@ciscospark/internal-plugin-conversation';

import {renameJob, updateJobStatus} from '../../../lib/test-helpers';
import {runAxe} from '../../../lib/axe';
import {
  elements as rosterElements,
  canSearchForParticipants,
  hasParticipants,
  searchForPerson,
  FEATURE_FLAG_ROSTER
} from '../../../lib/test-helpers/space-widget/roster';
import {elements, openMenuAndClickButton} from '../../../lib/test-helpers/space-widget/main';

describe('Widget Space', () => {
  const browserLocal = browser.select('browserLocal');
  const jobName = 'react-widget-space-global';

  let allPassed = true;
  let biff, docbrown, lorraine, marty;
  let conversation;

  before('start new sauce session', () => {
    browser.reload();
    renameJob(jobName);
  });

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
      return marty.spark.internal.device.register()
        .then(() => marty.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true))
        .then(() => marty.spark.internal.mercury.connect());
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
    }));

  before('create biff', () => testUsers.create({count: 1, config: {displayName: 'Biff Tannen'}})
    .then((users) => {
      [biff] = users;
      biff.spark = new CiscoSpark({
        credentials: {
          authorization: biff.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
    }));

  before('pause to let test users establish', () => browser.pause(5000));

  before('create space', () => marty.spark.internal.conversation.create({
    displayName: 'Test Widget Space',
    participants: [marty, docbrown, lorraine]
  }).then((c) => {
    conversation = c;
    return conversation;
  }));

  before('open widget for marty in browserLocal', () => {
    browserLocal.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        spaceId
      };
      window.openSpaceWidget(options);
    }, marty.token.access_token, conversation.id);
  });

  it('loads the test page', () => {
    const title = browserLocal.getTitle();
    assert.equal(title, 'Cisco Spark Widget Test');
  });

  it('loads the space name', () => {
    browserLocal.waitForVisible('h1.ciscospark-title');
    assert.equal(browserLocal.getText('h1.ciscospark-title'), conversation.displayName);
  });

  describe('When conversation is established', () => {
    before('wait for conversation to be ready', () => {
      const textInputField = `[placeholder="Send a message to ${conversation.displayName}"]`;
      browserLocal.waitForVisible(textInputField);
    });

    describe('Activity Menu', () => {
      it('has a menu button', () => {
        assert.isTrue(browserLocal.isVisible(elements.menuButton));
      });

      it('displays the menu when clicking the menu button', () => {
        browserLocal.click(elements.menuButton);
        browserLocal.waitForVisible(elements.activityMenu);
      });

      it('has an exit menu button', () => {
        assert.isTrue(browserLocal.isVisible(elements.activityMenu));
        browserLocal.waitForVisible(elements.exitButton);
      });

      it('closes the menu with the exit button', () => {
        browserLocal.click(elements.exitButton);
        browserLocal.waitForVisible(elements.activityMenu, 60000, true);
      });

      it('has a message button', () => {
        browserLocal.click(elements.menuButton);
        browserLocal.waitForVisible(elements.messageButton);
      });

      it('has a files button', () => {
        browserLocal.waitForVisible(elements.filesButton);
      });

      it('switches to files widget', () => {
        browserLocal.waitForVisible(elements.filesButton);
        browserLocal.click(elements.filesButton);
        browserLocal.waitForVisible(elements.filesWidget);
        browserLocal.waitForVisible(elements.menuButton);
        browserLocal.click(elements.menuButton);
      });

      it('hides menu and switches to message widget', () => {
        browserLocal.click(elements.messageButton);
        browserLocal.waitForVisible(elements.activityMenu, 60000, true);
        assert.isTrue(browserLocal.isVisible(elements.messageWidget));
      });
    });

    describe('roster tests', () => {
      before('open roster widget', () => {
        openMenuAndClickButton(browserLocal, rosterElements.peopleButton);
        browserLocal.waitForVisible(rosterElements.rosterWidget);
      });

      it('has a close button', () => {
        assert.isTrue(browserLocal.isVisible(rosterElements.closeButton));
      });

      it('has the total count of participants', () => {
        assert.equal(browserLocal.getText(rosterElements.rosterTitle), 'People (3)');
      });

      it('has the participants listed', () => {
        hasParticipants(browserLocal, [marty, docbrown, lorraine]);
      });

      it('has search for participants', () => {
        canSearchForParticipants(browserLocal);
      });

      it('searches and adds person to space', () => {
        openMenuAndClickButton(browserLocal, rosterElements.peopleButton);
        browserLocal.waitForVisible(rosterElements.rosterWidget);
        searchForPerson(browserLocal, biff.displayName, true);
        browserLocal.waitForVisible(rosterElements.rosterList);
        browserLocal.waitUntil(() => browserLocal.getText(rosterElements.rosterList).includes(biff.displayName));
        browserLocal.waitUntil(() => browserLocal.getText(rosterElements.rosterTitle) === 'People (4)');
      });

      it('closes the people roster widget', () => {
        browserLocal.click(rosterElements.closeButton);
        browserLocal.waitForVisible(rosterElements.rosterWidget, 60000, true);
      });
    });

    describe('accessibility', () => {
      it('should have no accessibility violations', () =>
        runAxe(browserLocal, 'ciscospark-widget')
          .then((results) => {
            assert.equal(results.violations.length, 0);
          }));
    });
  });

  /* eslint-disable-next-line func-names */
  afterEach(function () {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after(() => {
    updateJobStatus(jobName, allPassed);
  });

  after('disconnect', () => marty.spark.internal.mercury.disconnect());
});

