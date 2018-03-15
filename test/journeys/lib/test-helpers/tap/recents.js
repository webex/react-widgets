/**
 * Test helpers for the tap tests that use material-ui as a front end
 */
import {assert} from 'chai';

export const elements = {
  accessTokenInput: 'input[aria-label="Access Token"]',
  saveTokenButton: 'button[aria-label="Save Token"]',
  openWidgetButton: 'button[aria-label="Open Widget"]',
  widgetContainer: '.ciscospark-spaces-list-wrapper'
};


/**
 *
 * @param {object} aBrowser
 * @param {string} accessToken
 */
export function loginAndOpenWidget(aBrowser, accessToken) {
  aBrowser.waitUntil(() => aBrowser.isVisible(elements.accessTokenInput), 3500, 'access token input field not found');
  aBrowser.execute((myToken, accessTokenElement) => {
    document.querySelector(accessTokenElement).value = myToken;
  }, accessToken, elements.accessTokenInput);
  // Type a space and delete it to trigger react change
  aBrowser.click(elements.accessTokenInput).keys(['End', ' ', 'Backspace']);
  assert.equal(aBrowser.getValue(elements.accessTokenInput), accessToken, 'access token entry failed');
  aBrowser.click(elements.saveTokenButton);
  aBrowser.click(elements.openWidgetButton);
  aBrowser.waitUntil(() => aBrowser.isVisible(elements.widgetContainer), 3500, 'widget failed to open');
}
