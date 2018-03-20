import {assert} from 'chai';

import {runAxe} from '../../../lib/axe';
import {
  elements as rosterElements,
  hasParticipants,
  FEATURE_FLAG_ROSTER
} from '../../../lib/test-helpers/space-widget/roster';
import {
  elements,
  openMenuAndClickButton
} from '../../../lib/test-helpers/space-widget/main';
import {setupOneOnOneUsers} from '../../../lib/test-helpers';

export default function oneOnOneBasicTests({name, browserLocalSetup}) {
  describe(`Widget Space: One on One - Basic (${name})`, () => {
    const browserLocal = browser.select('1');

    let mccoy, spock, oneOnOneConversation;

    before('initialize test users', () => {
      ({mccoy, spock} = setupOneOnOneUsers());

      spock.spark.internal.device.register()
        .then(() => spock.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true));

      browser.waitUntil(() =>
        spock.spark.internal.device.userId,
      15000, 'failed to register user devices');
    });

    it('creates one on one space', function createOneOnOneSpace() {
      this.retries(2);

      spock.spark.internal.conversation.create({
        participants: [spock, mccoy]
      }).then((c) => {
        oneOnOneConversation = c;
        return oneOnOneConversation;
      });

      browser.waitUntil(() => oneOnOneConversation && oneOnOneConversation.id,
        15000, 'failed to create one on one space');
    });

    it('loads browser and widgets', function loadBrowsers() {
      this.retries(3);

      browserLocalSetup({
        aBrowser: browserLocal,
        accessToken: spock.token.access_token,
        toPersonEmail: mccoy.email
      });

      browser.waitUntil(() =>
        browserLocal.isVisible(elements.messageWidget),
      10000, 'failed to load browsers and widgets');
    });

    it('loads the user\'s name', () => {
      browser.waitUntil(() =>
        browserLocal.isVisible('h1.ciscospark-title') &&
        browserLocal.getText('h1.ciscospark-title') !== 'Loading...',
      10000, 'failed to load widget title');
      assert.equal(browserLocal.getText('h1.ciscospark-title'), mccoy.displayName);
    });

    describe('Activity Menu', () => {
      it('switches to files widget', () => {
        openMenuAndClickButton(browserLocal, elements.filesButton);
        browser.waitUntil(() =>
          browserLocal.isVisible(elements.filesWidget),
        5000, 'could not switch to files widget');
      });

      it('switches to message widget', () => {
        openMenuAndClickButton(browserLocal, elements.messageButton);
        browser.waitUntil(() =>
          browserLocal.isVisible(elements.messageWidget),
        5000, 'could not switch to message widget');
      });

      it('switches to meet widget', () => {
        openMenuAndClickButton(browserLocal, elements.meetButton);
        browser.waitUntil(() =>
          browserLocal.isVisible(elements.meetWidget),
        5000, 'could not switch to meet widget');
      });

      it('closes activity menu with the exit button', () => {
        openMenuAndClickButton(browserLocal, elements.exitButton);
        browser.waitUntil(() =>
          !browserLocal.isVisible(elements.activityMenu),
        5000, 'could not open and close activity menu');
      });
    });

    describe('roster tests', () => {
      it('opens roster widget', () => {
        openMenuAndClickButton(browserLocal, rosterElements.peopleButton);
        browser.waitUntil(() =>
          browserLocal.isVisible(rosterElements.rosterWidget),
        5000, 'could not open roster widget');
      });

      it('has a close button', () => {
        assert.isTrue(
          browserLocal.isVisible(`${rosterElements.rosterWidget} ${rosterElements.closeButton}`)
        );
      });

      it('has the total count of participants', () => {
        assert.equal(browserLocal.getText(rosterElements.rosterTitle), 'People (2)');
      });

      it('has the participants listed', () => {
        hasParticipants(browserLocal, [mccoy, spock]);
      });

      it('closes the people roster widget', () => {
        browserLocal.click(`${rosterElements.rosterWidget} ${rosterElements.closeButton}`);
        browser.waitUntil(() =>
          !browserLocal.isVisible(rosterElements.rosterWidget),
        5000, 'could not close roster widget');
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
