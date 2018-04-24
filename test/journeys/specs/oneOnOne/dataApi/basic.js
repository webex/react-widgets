import {assert} from 'chai';

import '@ciscospark/internal-plugin-feature';
import '@ciscospark/plugin-logger';
import CiscoSpark from '@ciscospark/spark-core';
import testUsers from '@ciscospark/test-helper-test-users';

import {
  elements as rosterElements,
  hasParticipants,
  FEATURE_FLAG_ROSTER
} from '../../../lib/test-helpers/space-widget/roster';
import {elements, openMenuAndClickButton} from '../../../lib/test-helpers/space-widget/main';
import {renameSession} from '../../../lib/test-helpers';

describe('Widget Space: One on One: Data API', () => {
  const browserLocal = browser.select('browserLocal');

  let mccoy, spock;
  const mccoyName = 'Bones Mccoy';
  const spockName = 'Mr Spock';

  before('start new sauce session', () => {
    browser.reload();
    renameSession('react-widget-oneOnOne-dataApi');
  });

  before('load browsers', () => {
    browser.url('/data-api/space.html');
  });

  before('create spock', () => testUsers.create({count: 1, config: {displayName: spockName}})
    .then((users) => {
      [spock] = users;
      spock.spark = new CiscoSpark({
        credentials: {
          authorization: spock.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return spock.spark.internal.device.register()
        .then(() => spock.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true));
    }));

  before('create mccoy', () => testUsers.create({count: 1, config: {displayName: mccoyName}})
    .then((users) => {
      [mccoy] = users;
    }));

  before('pause to let test users establish', () => browser.pause(5000));

  before('inject token', () => {
    browserLocal.execute((localAccessToken, localToUserEmail) => {
      const csmmDom = document.createElement('div');
      csmmDom.setAttribute('class', 'ciscospark-widget');
      csmmDom.setAttribute('data-toggle', 'ciscospark-space');
      csmmDom.setAttribute('data-access-token', localAccessToken);
      csmmDom.setAttribute('data-to-person-email', localToUserEmail);
      csmmDom.setAttribute('data-initial-activity', 'message');
      document.getElementById('ciscospark-widget').appendChild(csmmDom);
      window.loadBundle('/dist-space/bundle.js');
    }, spock.token.access_token, mccoy.email);
    browserLocal.waitForVisible(elements.spaceWidget);
  });

  it('loads the test page', () => {
    const title = browserLocal.getTitle();
    assert.equal(title, 'Cisco Spark Widget Test');
  });

  it('loads the user\'s name', () => {
    browserLocal.waitForVisible('h1.ciscospark-title');
    browserLocal.waitUntil(() => browserLocal.getText('h1.ciscospark-title') !== 'Loading...');
    assert.equal(browserLocal.getText('h1.ciscospark-title'), mccoy.displayName);
  });

  describe('Activity Menu', () => {
    it('has a menu button', () => {
      assert.isTrue(browserLocal.isVisible(elements.menuButton));
    });

    it('displays the menu when clicking the menu button', () => {
      browserLocal.click(elements.menuButton);
      browserLocal.waitForVisible(elements.activityMenu);
    });

    it('has a message button', () => {
      browserLocal.waitForVisible(elements.messageButton);
    });

    it('has a meet button', () => {
      browserLocal.waitForVisible(elements.meetButton);
    });

    it('has a people button', () => {
      browserLocal.waitForVisible(rosterElements.peopleButton);
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

    it('switches to message widget', () => {
      browserLocal.click(elements.messageButton);
      assert.isTrue(browserLocal.isVisible(elements.messageWidget));
      assert.isFalse(browserLocal.isVisible(elements.meetWidget));
    });

    it('has a meet button', () => {
      browserLocal.click(elements.menuButton);
      browserLocal.waitForVisible(elements.meetButton);
    });

    it('switches to meet widget', () => {
      browserLocal.click(elements.meetButton);
      assert.isTrue(browserLocal.isVisible(elements.meetWidget));
      assert.isFalse(browserLocal.isVisible(elements.messageWidget));
    });
  });

  describe('roster tests', () => {
    before('open roster widget', () => {
      openMenuAndClickButton(browserLocal, rosterElements.peopleButton);
      assert.isTrue(browserLocal.isVisible(rosterElements.rosterWidget));
    });

    it('has a close button', () => {
      assert.isTrue(browserLocal.isVisible(rosterElements.closeButton));
    });

    it('has the total count of participants', () => {
      assert.equal(browserLocal.getText(rosterElements.rosterTitle), 'People (2)');
    });

    it('has the participants listed', () => {
      hasParticipants(browserLocal, [mccoy, spock]);
    });

    it('closes the people roster widget', () => {
      browserLocal.click(rosterElements.closeButton);
      browserLocal.waitForVisible(rosterElements.rosterWidget, 60000, true);
    });
  });
});
