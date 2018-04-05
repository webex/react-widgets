import {assert} from 'chai';

/**
 * Check if Roster Flag is working correctly
 * @export
 * @param {Object} options
 * @param {Object} options.allFeaturesPage
 * @param {Object} options.noFeaturesPage
 */
export function rosterFlagTests({allFeaturesPage, noFeaturesPage}) {
  describe('Roster Feature Flag', () => {
    it('has a roster for user with feature flag', () => {
      allFeaturesPage.openActivityMenu();
      assert.isTrue(allFeaturesPage.hasRosterButton, 'missing people button in activity menu');
      allFeaturesPage.closeActivityMenu();
    });

    it('does not have a roster for user without flag', () => {
      noFeaturesPage.openActivityMenu();
      assert.isFalse(noFeaturesPage.hasRosterButton, 'people button is still visible in activity menu');
      noFeaturesPage.closeActivityMenu();
    });
  });
}

/**
 * Check if Group Calling Flag is working correctly
 * @export
 * @param {Object} options
 * @param {Object} options.allFeaturesPage
 * @param {Object} options.noFeaturesPage
 */
export function groupCallingFlagTests({allFeaturesPage, noFeaturesPage}) {
  describe('Group Calling Feature Flag', () => {
    it('has a call option for user with feature flag', () => {
      allFeaturesPage.openActivityMenu();
      assert.isTrue(allFeaturesPage.hasCallButton, 'missing call button in activity menu');
      allFeaturesPage.closeActivityMenu();
    });

    it('does not have a call option for user without flag', () => {
      noFeaturesPage.openActivityMenu();
      assert.isFalse(noFeaturesPage.hasCallButton, 'call button is still visible in activity menu');
      noFeaturesPage.closeActivityMenu();
    });
  });
}

/**
 * Feature Flag Tests Journeys
 * @export
 * @param {Object} options
 * @param {Object} options.allFeaturesPage
 * @param {Object} options.noFeaturesPage
 */
export default function featureFlagTests({allFeaturesPage, noFeaturesPage}) {
  rosterFlagTests({allFeaturesPage, noFeaturesPage});
  groupCallingFlagTests({allFeaturesPage, noFeaturesPage});
}
