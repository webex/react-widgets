// @ts-check
/**
 * Test helpers for the tap tests that use material-ui as a front end
 */

import {assert} from 'chai';

export const elements = {
  accessTokenInput: 'input[aria-label="Access Token"]',
  saveTokenButton: 'button[aria-label="Save Token"]',
  clearTokenButton: 'button[aria-label="Clear Token"]',
  toSpaceRadioButton: 'input[aria-label="To Space"]',
  toPersonRadioButton: 'label[for="toTypeEmail"]',
  openSpaceWidgetButton: 'button[aria-label="Open Space Widget"]',
  openRecentsWidgetButton: 'button[aria-label="Open Recents Widget"]',
  toSpaceInput: 'input[aria-label="To Space ID"]',
  toPersonInput: 'input[aria-label="To User Email"]',
  spaceWidgetContainer: '#my-ciscospark-space-widget',
  recentsWidgetContainer: '#my-ciscospark-recents-widget',
  changeActivityMeetButton: 'label[for="changeActivityMeet"]',
  updateSpaceWidgetButton: 'button[aria-label="Update Space Widget"]'
};

/**
 * Enters the access token into the token field and saves it
 *
 * @export
 * @param {object} aBrowser
 * @param {string} accessToken
 */
export function saveToken(aBrowser, accessToken) {
  if (aBrowser.element(elements.clearTokenButton).isVisible()) {
    aBrowser.element(elements.clearTokenButton).click();
  }
  aBrowser.waitUntil(() => aBrowser.element(elements.accessTokenInput).isVisible(), 3500, 'access token input field not found');
  aBrowser.setValue(elements.accessTokenInput, accessToken);
  assert.equal(aBrowser.element(elements.accessTokenInput).getValue(), accessToken, 'access token entry failed');
  aBrowser.element(elements.saveTokenButton).click();
}
