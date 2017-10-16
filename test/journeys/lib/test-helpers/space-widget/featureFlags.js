import {assert} from 'chai';

import {elements as mainElements} from './main';
import {elements as rosterElements} from './roster';
import {elements as meetElements} from './meet';

/**
 *
 * Feature Flag Tests Journeys
 *
 * @export
 * @param {any} browserLocal
 * @param {any} browserRemote
 * @returns {null}
 */
export default function featureFlagTests(browserLocal, browserRemote) {
  describe(`Roster Feature Flag`, () => {
    it(`has a roster for user with feature flag`, () => {
      browserLocal.click(mainElements.menuButton);
      browserLocal.waitForVisible(mainElements.activityMenu);
      assert.isTrue(browserLocal.element(mainElements.controlsContainer).element(rosterElements.peopleButton).isVisible());
      browserLocal.click(mainElements.exitButton);
    });

    it(`does not have a roster for user without flag`, () => {
      browserRemote.click(mainElements.menuButton);
      browserRemote.waitForVisible(mainElements.activityMenu);
      assert.isFalse(browserRemote.element(mainElements.controlsContainer).element(rosterElements.peopleButton).isVisible());
      browserRemote.click(mainElements.exitButton);
    });
  });

  describe(`Group Calling Feature Flag`, () => {
    it(`has a call option for user with feature flag`, () => {
      browserLocal.click(mainElements.menuButton);
      browserLocal.waitForVisible(mainElements.activityMenu);
      assert.isTrue(browserLocal.element(mainElements.controlsContainer).element(meetElements.callButton).isVisible());
      browserLocal.click(mainElements.exitButton);
    });

    it(`does not have a call option for user without flag`, () => {
      browserRemote.click(mainElements.menuButton);
      browserRemote.waitForVisible(mainElements.activityMenu);
      assert.isFalse(browserRemote.element(mainElements.controlsContainer).element(meetElements.callButton).isVisible());
      browserRemote.click(mainElements.exitButton);
    });
  });
}
