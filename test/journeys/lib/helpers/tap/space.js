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
 */
export function loginAndOpenWidget(aBrowser, accessToken, isOneOnOne, to) {
  if (aBrowser.isVisible(elements.clearTokenButton)) {
    aBrowser.clicke(elements.clearTokenButton);
  }
  browser.waitUntil(() => aBrowser.isVisible(elements.accessTokenInput), 3500, 'access token input field not found');
  aBrowser.execute((myToken, accessTokenElement) => {
    document.querySelector(accessTokenElement).value = myToken;
  }, accessToken, elements.accessTokenInput);
  // Type a space and delete it to trigger react change
  aBrowser.click(elements.accessTokenInput)
    .keys(['End', ' ', 'Backspace']);
  assert.equal(aBrowser.getValue(elements.accessTokenInput), accessToken, 'access token entry failed');
  aBrowser.click(elements.saveTokenButton);
  if (isOneOnOne) {
    aBrowser.click(elements.toPersonRadioButton);
    aBrowser.setValue(elements.toPersonInput, to);
  }
  else {
    aBrowser.click(elements.toSpaceRadioButton);
    aBrowser.setValue(elements.toSpaceInput, to);
  }
  aBrowser.click(elements.openWidgetButton);
  browser.waitUntil(() => aBrowser.isVisible(elements.widgetContainer), 3500, 'widget failed to open');
}
