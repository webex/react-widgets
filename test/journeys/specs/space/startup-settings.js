import {assert} from 'chai';

import {setupOneOnOneUsers} from '../../lib/test-users';
import {elements} from '../../lib/test-helpers/space-widget/main';
import {elements as rosterElements} from '../../lib/test-helpers/space-widget/roster';

describe('Space Widget Startup Settings Tests', () => {
  let mccoy, spock;
  let allPassed = true;

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

      browserLocal.$(elements.messageWidget).waitForDisplayed();
      browserLocal.$(`[placeholder="Send a message to ${mccoy.displayName}"]`).waitForDisplayed();
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

      browserLocal.$(elements.errorMessage).waitForDisplayed();
      assert.equal(browserLocal.$(elements.errorMessage).getText(), 'Error: The selected initial activity is invalid', 'does not display error message for invalid activity');
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

      browserLocal.$(elements.menuButton).waitForDisplayed();
      browserLocal.$(elements.menuButton).click();
      browserLocal.$(elements.activityMenu).waitForDisplayed();
      browserLocal.$(elements.messageActivityButton).waitForDisplayed();
      browserLocal.$(rosterElements.peopleButton).waitForDisplayed();
      assert.isFalse(browserLocal.isExisting(elements.meetActivityButton), 'meet button exists in activity menu when it should be disabled');
      assert.isFalse(browserLocal.isExisting(elements.filesActivityButton), 'files button exists in activity menu when it should be disabled');
      browserLocal.refresh();
      browserRemote.refresh();
    });
  });

  /* eslint-disable-next-line func-names */
  afterEach(function () {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });
});
