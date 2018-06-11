import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/internal-plugin-conversation';

import {updateJobStatus} from '../../../lib/test-helpers';
import {elements} from '../../../lib/test-helpers/space-widget/main';
import {elements as rosterElements} from '../../../lib/test-helpers/space-widget/roster';

describe('Widget Space: One on One: Startup Settings', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  const jobName = 'react-widget-oneOnOne-global';
  let mccoy, spock;
  let allPassed = true;

  before('load browsers', () => {
    browser.url('/space.html?message');
  });

  before('create spock', () => testUsers.create({count: 1, config: {displayName: 'Mr Spock'}})
    .then((users) => {
      [spock] = users;
    }));

  before('create mccoy', () => testUsers.create({count: 1, config: {displayName: 'Bones Mccoy'}})
    .then((users) => {
      [mccoy] = users;
    }));

  before('pause to let test users establish', () => browser.pause(5000));

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
    }, spock.token.access_token, mccoy.email);
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
      }, mccoy.token.access_token, spock.email);
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
      }, mccoy.token.access_token, spock.email);
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
