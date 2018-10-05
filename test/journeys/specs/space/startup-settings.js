import {assert} from 'chai';

import {setupOneOnOneUsers} from '../../lib/test-users';
import {elements} from '../../lib/test-helpers/space-widget/main';
import {elements as rosterElements} from '../../lib/test-helpers/space-widget/roster';
import {jobNames, renameJob, updateJobStatus} from '../../lib/test-helpers';

describe('Space Widget Startup Settings Tests', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  const jobName = jobNames.spaceStartup;
  let mccoy, spock;
  let allPassed = true;

  before('start new sauce session', () => {
    renameJob(jobName, browser);
  });

  before('load browsers', () => {
    browser.url('/space.html?message');
  });

  before('create test users and spaces', () => {
    [mccoy, spock] = setupOneOnOneUsers();
  });

  describe('destination type: userId', () => {
    it('opens widget', () => {
      browserLocal.execute((localAccessToken, localToPersonId) => {
        const options = {
          accessToken: localAccessToken,
          onEvent: (eventName, detail) => {
            window.ciscoSparkEvents.push({eventName, detail});
          },
          destinationId: localToPersonId,
          destinationType: 'userId'
        };
        window.openSpaceWidget(options);
      }, spock.token.access_token, mccoy.id);

      browserLocal.waitForVisible(elements.messageWidget);
      browserLocal.waitForVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`);
      browserLocal.refresh();
    });
  });

  describe('spaceActivities setting', () => {
    it('displays error message for disabled initial activity', () => {
      browserLocal.execute((localAccessToken, localToUserEmail) => {
        const options = {
          accessToken: localAccessToken,
          onEvent: (eventName, detail) => {
            window.ciscoSparkEvents.push({eventName, detail});
          },
          destinationId: localToUserEmail,
          destinationType: 'email',
          initialActivity: 'message',
          spaceActivities: {
            files: false,
            meet: false,
            message: false,
            people: true
          }
        };
        window.openSpaceWidget(options);
      }, mccoy.token.access_token, spock.email);

      browserLocal.waitForVisible(elements.errorMessage);
      assert.equal(browserLocal.getText(elements.errorMessage), 'Error: The selected initial activity is invalid', 'does not display error message for invalid activity');
      browserLocal.refresh();
      browserRemote.refresh();
    });

    it('disables the files and meet activities', () => {
      browserLocal.execute((localAccessToken, localToUserEmail) => {
        const options = {
          accessToken: localAccessToken,
          onEvent: (eventName, detail) => {
            window.ciscoSparkEvents.push({eventName, detail});
          },
          destinationId: localToUserEmail,
          destinationType: 'email',
          initialActivity: 'message',
          spaceActivities: {
            files: false,
            meet: false,
            message: true,
            people: true
          }
        };
        window.openSpaceWidget(options);
      }, mccoy.token.access_token, spock.email);

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
    it('opens message widget using legacy toPersonEmail', () => {
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
      }, mccoy.token.access_token, spock.email);

      browserLocal.waitForVisible(`[placeholder="Send a message to ${spock.displayName}"]`);
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
