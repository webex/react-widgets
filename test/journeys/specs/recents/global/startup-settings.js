import {assert} from 'chai';

import {
  createSpace,
  disconnectDevices,
  registerDevices,
  setupGroupTestUsers
} from '../../../lib/test-users';
import {jobNames, renameJob, updateJobStatus} from '../../../lib/test-helpers';
import {findEventName, getEventLog} from '../../../lib/events';
import {elements} from '../../../lib/test-helpers/recents-widget';

describe('Widget Recents', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');

  let allPassed = true;
  let lorraine, marty, participants;

  before('start new sauce session', () => {
    renameJob(jobNames.recentsStartupSettings, browser);
  });

  before('load browser for recents widget', () => {
    browserLocal.url('/recents.html');
  });

  before('load browser for recents widget', () => {
    browserRemote.url('/recents.html');
  });

  before('create test users and spaces', () => {
    participants = setupGroupTestUsers();
    [lorraine, marty] = participants;
    registerDevices(participants);
    createSpace({sparkInstance: marty.spark, participants, displayName: 'Test Group Space'});
    createSpace({sparkInstance: marty.spark, participants: [lorraine, marty]});
  });

  describe('Header Options', () => {
    it('should not display a header when all options are disabled', () => {
      browserLocal.execute((localAccessToken) => {
        const options = {
          accessToken: localAccessToken,
          onEvent: (eventName, detail) => {
            window.ciscoSparkEvents.push({eventName, detail});
          },
          enableAddButton: false,
          enableSpaceListFilter: false,
          enableUserProfile: false,
          enableUserProfileMenu: false
        };

        window.openRecentsWidget(options);
      }, marty.token.access_token);
      browserLocal.waitForVisible(elements.recentsWidget);
      browserLocal.waitForVisible(elements.loadingScreen, 7500, true);

      assert.isFalse(browserLocal.elements(elements.headerBar).isVisible());
    });

    describe('when all header options are enabled', () => {
      it('should load the recents widget with header options', () => {
        browserRemote.execute((localAccessToken) => {
          const options = {
            accessToken: localAccessToken,
            onEvent: (eventName, detail) => {
              window.ciscoSparkEvents.push({eventName, detail});
            },
            enableAddButton: true,
            enableSpaceListFilter: true,
            enableUserProfile: true,
            enableUserProfileMenu: true
          };

          window.openRecentsWidget(options);
        }, lorraine.token.access_token);
        browserRemote.waitForVisible(elements.recentsWidget);
        browserRemote.waitForVisible(elements.loadingScreen, 7500, true);
      });

      it('has a search bar for space filtering', () => {
        assert.isTrue(browserRemote.element(elements.searchInput).isVisible(), 'does not have header search bar');
      });

      it('has a user profile picture', () => {
        assert.isTrue(browserRemote.element(elements.headerProfile).isVisible(), 'does not have header profile');
      });

      it('has an add space button', () => {
        assert.isTrue(browserRemote.element(elements.headerAddButton).isVisible(), 'does not have header add space button');
      });

      it('has a user profile avatar setting menu', () => {
        browserRemote.element(elements.headerProfile).click();
        assert.isTrue(browserRemote.element(elements.headerSignout).isVisible(), 'does not have header sign out menu');
      });

      it('fires out the sign out event, if the user signs out', () => {
        browserRemote.element(elements.headerProfile).click();
        browserRemote.waitForVisible(elements.headerSignout);
        browserRemote.element(elements.headerSignout).click();
        const events = findEventName({
          eventName: 'user_signout:clicked',
          events: getEventLog(browserRemote)
        });

        assert.isNotEmpty(events, 'does not have user_signout:clicked event in log');
      });
    });
  });

  /* eslint-disable-next-line func-names */
  afterEach(function () {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after(() => {
    updateJobStatus(jobNames.recentsGlobal, allPassed);
  });

  after('disconnect', () => disconnectDevices(participants));
});
