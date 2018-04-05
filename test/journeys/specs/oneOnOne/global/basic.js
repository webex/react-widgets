import {assert} from 'chai';
import '@ciscospark/internal-plugin-feature';
import '@ciscospark/plugin-logger';
import CiscoSpark from '@ciscospark/spark-core';
import testUsers from '@ciscospark/test-helper-test-users';

import {elements as rosterElements, hasParticipants, FEATURE_FLAG_ROSTER} from '../../../lib/test-helpers/space-widget/roster';
import {runAxe} from '../../../lib/axe';
import {elements, openMenuAndClickButton} from '../../../lib/test-helpers/space-widget/main';

describe('Widget Space: One on One', () => {
  describe('Global', () => {
    const browserLocal = browser.select('browserLocal');

    let mccoy, spock;
    const mccoyName = 'Bones Mccoy';
    const spockName = 'Mr Spock';

    before('load browsers', () => {
      browser.url('/space.html?basic');
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
      if (process.env.DEBUG_JOURNEYS) {
        console.info('RUN THE FOLLOWING CODE BLOCK TO RERUN THIS TEST FROM DEV TOOLS');
        console.info();
        console.info(`window.openSpaceWidget({
          accessToken: "${spock.token.access_token}",
          toPersonEmail: "${mccoy.email}",
          initialActivity: "message"
        });`);
        console.info();
        console.info();
      }
      browserLocal.execute((localAccessToken, localToUserEmail) => {
        const options = {
          accessToken: localAccessToken,
          toPersonEmail: localToUserEmail,
          initialActivity: 'message'
        };
        window.openSpaceWidget(options);
      }, spock.token.access_token, mccoy.email);
    });

    if (process.env.DEBUG_JOURNEYS) {
      console.warn('Running with DEBUG_JOURNEYS may require you to manually kill wdio');
      // Leaves the browser open for further testing and inspection
      after(() => browserLocal.debug());
    }


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
        browserLocal.element(elements.controlsContainer).element(elements.messageButton).waitForVisible();
      });

      it('has a meet button', () => {
        browserLocal.element(elements.controlsContainer).element(elements.meetButton).waitForVisible();
      });

      it('has a people button', () => {
        browserLocal.element(elements.controlsContainer).element(rosterElements.peopleButton).waitForVisible();
      });

      it('has a files button', () => {
        browserLocal.element(elements.controlsContainer).element(elements.filesButton).waitForVisible();
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
        browserLocal.waitForVisible(elements.activityMenu, 1500, true);
      });

      it('has a message button', () => {
        browserLocal.click(elements.menuButton);
        browserLocal.element(elements.controlsContainer).element(elements.messageButton).waitForVisible();
      });

      it('switches to message widget', () => {
        browserLocal.element(elements.controlsContainer).element(elements.messageButton).click();
        assert.isTrue(browserLocal.isVisible(elements.messageWidget));
        assert.isFalse(browserLocal.isVisible(elements.meetWidget));
      });

      it('has a meet button', () => {
        browserLocal.click(elements.menuButton);
        browserLocal.element(elements.controlsContainer).element(elements.meetButton).waitForVisible();
      });

      it('switches to meet widget', () => {
        browserLocal.element(elements.controlsContainer).element(elements.meetButton).click();
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
        assert.isTrue(
          browserLocal
            .element(rosterElements.rosterWidget)
            .element(rosterElements.closeButton)
            .isVisible()
        );
      });

      it('has the total count of participants', () => {
        assert.equal(browserLocal.element(rosterElements.rosterTitle).getText(), 'People (2)');
      });

      it('has the participants listed', () => {
        hasParticipants(browserLocal, [mccoy, spock]);
      });

      it('closes the people roster widget', () => {
        browserLocal.element(rosterElements.rosterWidget).element(rosterElements.closeButton).click();
        browserLocal.element(rosterElements.rosterWidget).waitForVisible(1500, true);
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
});
