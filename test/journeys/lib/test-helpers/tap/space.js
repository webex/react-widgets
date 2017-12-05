/**
 * Test helpers for the tap tests that use material-ui as a front end
 */

import {assert} from 'chai';

export const elements = {
  accessTokenInput: 'input[aria-label="Access Token"]',
  saveTokenButton: 'button[aria-label="Save Token"]',
  clearTokenButton: 'button[aria-label="Clear Token"]',
  toSpaceRadioButton: 'input[aria-label="To Space"]',
  toPersonRadioButton: 'input[aria-label="To Person"]',
  openWidgetButton: 'button[aria-label="Open Widget"]',
  toSpaceInput: 'input[aria-label="To Space ID"]',
  toPersonInput: 'input[aria-label="To User Email"]',
  widgetContainer: '#my-ciscospark-widget'
};

/**
 *
 * @param {object} aBrowser
 * @param {string} accessToken
 * @param {boolean} isOneOnOne
 * @param {string} to
 * @returns {null}
 */
export function loginAndOpenWidget(aBrowser, accessToken, isOneOnOne, to) {
  if (aBrowser.element(elements.clearTokenButton).isVisible()) {
    aBrowser.element(elements.clearTokenButton).click();
  }
  aBrowser.waitUntil(() => aBrowser.element(elements.accessTokenInput).isVisible(), 3500, 'access token input field not found');
  aBrowser.execute((myToken, accessTokenElement) => {
    document.querySelector(accessTokenElement).value = myToken;
  }, accessToken, elements.accessTokenInput);
  // Type a space and delete it to trigger react change
  aBrowser.element(elements.accessTokenInput)
    .click()
    .keys(['End', ' ', 'Backspace']);
  assert.equal(aBrowser.element(elements.accessTokenInput).getValue(), accessToken, 'access token entry failed');
  aBrowser.element(elements.saveTokenButton).click();
  if (isOneOnOne) {
    aBrowser.element(elements.toPersonRadioButton).click();
    aBrowser.element(elements.toPersonInput).setValue(to);
  }
  else {
    aBrowser.element(elements.toSpaceRadioButton).click();
    aBrowser.element(elements.toSpaceInput).setValue(to);
  }
  aBrowser.element(elements.openWidgetButton).click();
  aBrowser.waitUntil(() => aBrowser.element(elements.widgetContainer).isVisible(), 3500, 'widget failed to open');
}
