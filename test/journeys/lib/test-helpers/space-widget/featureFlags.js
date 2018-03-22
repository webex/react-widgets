import {assert} from 'chai';

import {elements as mainElements} from './main';
import {elements as rosterElements} from './roster';

/**
 * Check if Roster Flag is working correctly
 * @export
 * @param {Object} browserWithAllTheFeatures
 * @param {Object} browserWithNoFeatures
 */
export function rosterFlagTests(browserWithAllTheFeatures, browserWithNoFeatures) {
  describe('Roster Feature Flag', () => {
    it('has a roster for user with feature flag', () => {
      browserWithAllTheFeatures.click(mainElements.menuButton);
      browserWithAllTheFeatures.waitForVisible(mainElements.activityMenu);
      assert.isTrue(
        browserWithAllTheFeatures
          .isVisible(`${mainElements.activityMenu} ${rosterElements.peopleButton}`)
      );
      browserWithAllTheFeatures.click(mainElements.exitButton);
    });

    it('does not have a roster for user without flag', () => {
      browserWithNoFeatures.click(mainElements.menuButton);
      browserWithNoFeatures.waitForVisible(mainElements.activityMenu);
      assert.isFalse(
        browserWithNoFeatures
          .isVisible(`${mainElements.activityMenu} ${rosterElements.peopleButton}`)
      );
      browserWithNoFeatures.click(mainElements.exitButton);
    });
  });
}

/**
 * Check if Group Calling Flag is working correctly
 * @export
 * @param {Object} browserWithAllTheFeatures
 * @param {Object} browserWithNoFeatures
 */
export function groupCallingFlagTests(browserWithAllTheFeatures, browserWithNoFeatures) {
  describe('Group Calling Feature Flag', () => {
    const callButton = `${mainElements.activityMenu} button[aria-label="Call"]`;
    it('has a call option for user with feature flag', () => {
      browserWithAllTheFeatures.click(mainElements.menuButton);
      browserWithAllTheFeatures.waitForVisible(mainElements.activityMenu);
      assert.isTrue(browserWithAllTheFeatures.isVisible(callButton));
      browserWithAllTheFeatures.click(mainElements.exitButton);
    });

    it('does not have a call option for user without flag', () => {
      browserWithNoFeatures.click(mainElements.menuButton);
      browserWithNoFeatures.waitForVisible(mainElements.activityMenu);
      assert.isFalse(browserWithNoFeatures.isVisible(callButton));
      browserWithNoFeatures.click(mainElements.exitButton);
    });
  });
}

/**
 *
 * Feature Flag Tests Journeys
 *
 * @export
 * @param {Object} browserWithAllTheFeatures
 * @param {Object} browserWithNoFeatures
 */
export default function featureFlagTests(browserWithAllTheFeatures, browserWithNoFeatures) {
  rosterFlagTests(browserWithAllTheFeatures, browserWithNoFeatures);
  groupCallingFlagTests(browserWithAllTheFeatures, browserWithNoFeatures);
}
