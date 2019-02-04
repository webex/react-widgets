/**
 * Test helpers for the tap tests that use material-ui as a front end
 */

import {saveToken, elements} from '../demo';

/**
 *
 * @param {object} aBrowser
 * @param {string} accessToken
 * @param {boolean} isOneOnOne
 * @param {string} to
 */
export default function loginAndOpenWidget(aBrowser, accessToken, isOneOnOne, to) {
  saveToken(aBrowser, accessToken);

  if (isOneOnOne) {
    aBrowser.element(elements.toPersonRadioButton).click();
    aBrowser.element(elements.toPersonInput).setValue(to);
  }
  else {
    aBrowser.element(elements.toSpaceRadioButton).click();
    aBrowser.element(elements.toSpaceInput).setValue(to);
  }
  aBrowser.element(elements.openSpaceWidgetButton).click();
  aBrowser.waitUntil(() => aBrowser.element(elements.spaceWidgetContainer).isVisible(), 3500, 'widget failed to open');
}
