// @ts-check
/**
 * Test helpers for the tap tests that use material-ui as a front end
 */

import {assert} from 'chai';

export const elements = {
  accessTokenInput: 'input[aria-label="Access Token"]',
  saveTokenButton: 'button[aria-label="Save Token"]',
  clearTokenButton: 'button[aria-label="Clear Token"]',
  accessTokenTypeTokenButton: 'label[for="tokenTypeAccessToken"]',
  generateSDKTrueButton: 'label[for="generateSDKTrue"]',
  generateSDKFalseButton: 'label[for="generateSDKTrue"]',
  toSpaceRadioButton: 'label[for="toTypeSpace"]',
  toPersonRadioButton: 'label[for="toTypeEmail"]',
  openSpaceWidgetButton: 'button[aria-label="Open Space Widget"]',
  openRecentsWidgetButton: 'button[aria-label="Open Recents Widget"]',
  toSpaceInput: 'input[aria-label="To Space ID"]',
  toPersonInput: 'input[aria-label="To User Email"]',
  spaceWidgetContainer: '#my-webex-space-widget',
  recentsWidgetContainer: '#my-webex-recents-widget',
  changeActivityMeetButton: 'label[for="changeActivityMeet"]',
  updateSpaceWidgetButton: 'button[aria-label="Update Space Widget"]',
  tabMeet: '.webex-tab-meet'
};

/**
 * Enters the access token into the token field and saves it
 *
 * @export
 * @param {object} aBrowser
 * @param {string} accessToken
 * @param {boolean} [useSdk=false] set use sdk instance
 */
export function saveToken(aBrowser, accessToken, useSdk = false) {
  if (aBrowser.$(elements.clearTokenButton).isDisplayed()) {
    aBrowser.$(elements.clearTokenButton).click();
  }
  aBrowser.$(elements.accessTokenTypeTokenButton).click();
  aBrowser.waitUntil(() => aBrowser.$(elements.accessTokenInput).isDisplayed(), 3500, 'access token input field not found');
  aBrowser.$(elements.accessTokenInput).setValue(accessToken);
  assert.equal(aBrowser.$(elements.accessTokenInput).getValue(), accessToken, 'access token entry failed');

  if (useSdk) {
    aBrowser.$(elements.generateSDKTrueButton).click();
  }

  aBrowser.$(elements.saveTokenButton).click();
}
