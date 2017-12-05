import {assert} from 'chai';

import {elements as mainElements} from './main';
import {elements as rosterElements} from './roster';
import {elements as meetElements} from './meet';

/**
 *
 * Feature Flag Tests Journeys
 *
 * @export
 * @param {any} browserWithAllTheFeatures
 * @param {any} browserWithNoFeatures
 * @returns {null}
 */
export default function featureFlagTests(browserWithAllTheFeatures, browserWithNoFeatures) {
  describe('Roster Feature Flag', () => {
    it('has a roster for user with feature flag', () => {
      browserWithAllTheFeatures.click(mainElements.menuButton);
      browserWithAllTheFeatures.waitForVisible(mainElements.activityMenu);
      assert.isTrue(
        browserWithAllTheFeatures
          .element(mainElements.controlsContainer)
          .element(rosterElements.peopleButton)
          .isVisible()
      );
      browserWithAllTheFeatures.click(mainElements.exitButton);
    });

    it('does not have a roster for user without flag', () => {
      browserWithNoFeatures.click(mainElements.menuButton);
      browserWithNoFeatures.waitForVisible(mainElements.activityMenu);
      assert.isFalse(
        browserWithNoFeatures
          .element(mainElements.controlsContainer)
          .element(rosterElements.peopleButton)
          .isVisible()
      );
      browserWithNoFeatures.click(mainElements.exitButton);
    });
  });

  describe('Group Calling Feature Flag', () => {
    it('has a call option for user with feature flag', () => {
      browserWithAllTheFeatures.click(mainElements.menuButton);
      browserWithAllTheFeatures.waitForVisible(mainElements.activityMenu);
      assert.isTrue(
        browserWithAllTheFeatures
          .element(mainElements.controlsContainer)
          .element(meetElements.callButton)
          .isVisible()
      );
      browserWithAllTheFeatures.click(mainElements.exitButton);
    });

    it('does not have a call option for user without flag', () => {
      browserWithNoFeatures.click(mainElements.menuButton);
      browserWithNoFeatures.waitForVisible(mainElements.activityMenu);
      assert.isFalse(
        browserWithNoFeatures
          .element(mainElements.controlsContainer)
          .element(meetElements.callButton)
          .isVisible()
      );
      browserWithNoFeatures.click(mainElements.exitButton);
    });
  });
}
