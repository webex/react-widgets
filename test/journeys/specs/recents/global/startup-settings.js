import {assert} from 'chai';

import {
  createSpace,
  disconnectDevices,
  registerDevices,
  setupGroupTestUsers
} from '../../../lib/test-users';
import {findEventName, getEventLog} from '../../../lib/events';
import {elements} from '../../../lib/test-helpers/recents-widget';

describe('Widget Recents', () => {
  let allPassed = true;
  let lorraine, marty, participants;

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
      browserLocal.$(elements.recentsWidget).waitForDisplayed();
      browserLocal.$(elements.loadingScreen).waitForDisplayed({
        timeout: 10000,
        reverse: true
      });

      assert.isFalse(browserLocal.$(elements.headerBar).isDisplayed());
      browserLocal.refresh();
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
        browserRemote.$(elements.recentsWidget).waitForDisplayed();
        browserRemote.$(elements.loadingScreen).waitForDisplayed({
          timeout: 7500,
          reverse: true
        });
      });

      it('has a search bar for space filtering', () => {
        assert.isTrue(browserRemote.$(elements.searchInput).isDisplayed(), 'does not have header search bar');
      });

      it('has a user profile picture', () => {
        assert.isTrue(browserRemote.$(elements.headerProfile).isDisplayed(), 'does not have header profile');
      });

      it('has an add space button', () => {
        assert.isTrue(browserRemote.$(elements.headerAddButton).isDisplayed(), 'does not have header add space button');
      });

      it('has a user profile avatar setting menu', () => {
        browserRemote.$(elements.headerProfile).click();
        assert.isTrue(browserRemote.$(elements.headerSignout).isDisplayed(), 'does not have header sign out menu');
      });

      it('fires out the sign out event, if the user signs out', () => {
        browserRemote.$(elements.headerProfile).click();
        browserRemote.$(elements.headerSignout).waitForDisplayed();
        browserRemote.$(elements.headerSignout).click();
        const events = findEventName({
          eventName: 'user_signout:clicked',
          events: getEventLog(browserRemote)
        });

        assert.isNotEmpty(events, 'does not have user_signout:clicked event in log');
      });
    });
  });

  describe('basicMode', () => {
    it('should not display a header when all options are disabled', () => {
      browserLocal.execute((localAccessToken) => {
        const options = {
          accessToken: localAccessToken,
          onEvent: (eventName, detail) => {
            window.ciscoSparkEvents.push({eventName, detail});
          },
          basicMode: true
        };

        window.openRecentsWidget(options);
      }, marty.token.access_token);
      browserLocal.$(elements.recentsWidget).waitForDisplayed();
      browserLocal.$(elements.loadingScreen).waitForDisplayed({
        timeout: 7500,
        reverse: true
      });

      browserLocal.$(elements.listContainer).waitForDisplayed();
    });
  });

  /* eslint-disable-next-line func-names */
  afterEach(function () {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after('disconnect', () => disconnectDevices(participants));
});
