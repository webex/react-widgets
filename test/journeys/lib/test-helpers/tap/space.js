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
    aBrowser.$(elements.toPersonRadioButton).click();
    aBrowser.$(elements.toPersonInput).setValue(to);
  }
  else {
    aBrowser.$(elements.toSpaceRadioButton).click();
    aBrowser.$(elements.toSpaceInput).setValue(to);
  }
  aBrowser.$(elements.openSpaceWidgetButton).click();
  aBrowser.waitUntil(() => aBrowser.$(elements.spaceWidgetContainer).isDisplayed(), 3500, 'widget failed to open');
}
