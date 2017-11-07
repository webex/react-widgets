/**
 * Test helpers for the tap tests that use material-ui as a front end
 */
import {assert} from 'chai';

export const elements = {
  accessTokenInput: `input[aria-label="Access Token"]`,
  saveTokenButton: `button[aria-label="Save Token"]`,
  openWidgetButton: `button[aria-label="Open Widget"]`,
  widgetContainer: `.ciscospark-spaces-list-wrapper`
};


/**
 *
 * @param {object} aBrowser
 * @param {string} accessToken
 * @returns {null}
 */
export function loginAndOpenWidget(aBrowser, accessToken) {
  aBrowser.waitUntil(() => aBrowser.element(elements.accessTokenInput).isVisible(), 3500, `access token input field not found`);
  aBrowser.execute((myToken, accessTokenElement) => {
    document.querySelector(accessTokenElement).value = myToken;
  }, accessToken, elements.accessTokenInput);
  // Type a space and delete it to trigger react change
  aBrowser.element(elements.accessTokenInput)
    .click()
    .keys([`End`, ` `, `Backspace`]);
  assert.equal(aBrowser.element(elements.accessTokenInput).getValue(), accessToken, `access token entry failed`);
  aBrowser.element(elements.saveTokenButton).click();
  aBrowser.element(elements.openWidgetButton).click();
  aBrowser.waitUntil(() => aBrowser.element(elements.widgetContainer).isVisible(), 3500, `widget failed to open`);
}
