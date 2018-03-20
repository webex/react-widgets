import {assert} from 'chai';

import {runAxe} from '../../../lib/axe';
import {elements, openMenuAndClickButton} from '../../../lib/test-helpers/space-widget/main';
import {createTestUsers} from '../../../lib/test-helpers';
import {
  elements as rosterElements,
  canSearchForParticipants,
  hasParticipants,
  searchAndAddPerson,
  FEATURE_FLAG_ROSTER
} from '../../../lib/test-helpers/space-widget/roster';

export default function groupBasicTests({name, browserSetup}) {
  describe(`Widget Space: Group - Basic (${name})`, () => {
    const browserLocal = browser.select('browserLocal');
    let biff, docbrown, lorraine, marty;
    let conversation;

    before('initialize test users', () => {
      ({
        marty,
        biff,
        docbrown,
        lorraine
      } = createTestUsers(4));

      marty.spark.internal.device.register()
        .then(() => marty.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true));

      browser.waitUntil(() =>
        marty.spark.internal.device.userId,
      15000, 'failed to register user devices');
    });

    it('creates group space', function createGroupSpace() {
      this.retries(2);

      marty.spark.internal.conversation.create({
        displayName: 'Test Widget Space',
        participants: [marty, docbrown, lorraine]
      }).then((c) => {
        conversation = c;
        return conversation;
      });

      browser.waitUntil(() => conversation && conversation.id,
        15000, 'failed to create group space');
    });

    it('loads browser and widgets', function loadBrowsers() {
      browserSetup({
        aBrowser: browserLocal,
        accessToken: marty.token.access_token,
        spaceId: conversation.id
      });

      browser.waitUntil(() =>
        browserLocal.isVisible(elements.messageWidget),
      10000, 'failed to laod browser and widgets');
    });

    describe('When conversation is established', () => {
      before('wait for conversation to be ready', () => {
        browserLocal.waitUntil(() =>
          browserLocal.isVisible(`[placeholder="Send a message to ${conversation.displayName}"]`),
        10000, 'failed to load message composer');
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
          browserLocal.waitForVisible(elements.activityMenu, 1500, true);
        });

        it('has a message button', () => {
          browserLocal.click(elements.menuButton);
          browserLocal.waitForVisible(`${elements.activityMenu} ${elements.messageButton}`);
        });

        it('has a files button', () => {
          browserLocal.waitForVisible(`${elements.activityMenu} ${elements.filesButton}`);
        });

        it('switches to files widget', () => {
          browserLocal.waitForVisible(elements.filesButton);
          browserLocal.click(elements.filesButton);
          browserLocal.waitForVisible(elements.filesWidget);
          browserLocal.waitForVisible(elements.menuButton);
          browserLocal.click(elements.menuButton);
        });

        it('hides menu and switches to message widget', () => {
          browserLocal.click(`${elements.activityMenu} ${elements.messageButton}`);
          browserLocal.waitForVisible(elements.activityMenu, 1500, true);
          assert.isTrue(browserLocal.isVisible(elements.messageWidget));
        });
      });

      describe('roster tests', () => {
        before('open roster widget', () => {
          openMenuAndClickButton(browserLocal, rosterElements.peopleButton);
          browserLocal.waitForVisible(rosterElements.rosterWidget);
        });

        it('has a close button', () => {
          assert.isTrue(
            browserLocal.isVisible(`${rosterElements.rosterWidget} ${rosterElements.closeButton}`)
          );
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
          searchAndAddPerson({
            aBrowser: browserLocal,
            searchString: biff.email,
            searchResult: biff.displayName
          });
        });

        it('closes the people roster widget', () => {
          browserLocal.click(`${rosterElements.rosterWidget} ${rosterElements.closeButton}`);
          browserLocal.waitForVisible(rosterElements.rosterWidget, 500, true);
        });
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
}
