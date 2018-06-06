import {assert} from 'chai';

import {elements as mainElements} from './main';
import {elements as rosterElements} from './roster';

/**
 *
 * Feature Flag Tests Journeys
 *
 * @export
 * @param {any} browserWithAllTheFeatures
 * @param {any} browserWithNoFeatures
 */
export default function featureFlagTests(browserWithAllTheFeatures, browserWithNoFeatures) {
  describe('Roster Feature Flag', () => {
    it('has a roster for user with feature flag', () => {
      browserWithAllTheFeatures.click(mainElements.menuButton);
      browserWithAllTheFeatures.waitForVisible(mainElements.activityMenu);
      assert.isTrue(browserWithAllTheFeatures.isVisible(rosterElements.peopleButton));
      browserWithAllTheFeatures.click(mainElements.exitButton);
    });

    it('does not have a roster for user without flag', () => {
      browserWithNoFeatures.click(mainElements.menuButton);
      browserWithNoFeatures.waitForVisible(mainElements.activityMenu);
      assert.isFalse(browserWithNoFeatures.isVisible(rosterElements.peopleButton));
      browserWithNoFeatures.click(mainElements.exitButton);
    });
  });
}
