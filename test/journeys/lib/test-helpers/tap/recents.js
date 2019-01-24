/**
 * Test helpers for the tap tests that use material-ui as a front end
 */
import {saveToken, elements} from '../demo';

/**
 *
 * @param {object} aBrowser
 * @param {string} accessToken
 */
export default function loginAndOpenWidget(aBrowser, accessToken) {
  saveToken(aBrowser, accessToken);
  aBrowser.waitUntil(() => aBrowser.element(elements.openRecentsWidgetButton).isVisible(), 3500, 'widget open button not visible');
  aBrowser.element(elements.openRecentsWidgetButton).click();
  aBrowser.waitUntil(() => aBrowser.element(elements.recentsWidgetContainer).isVisible(), 3500, 'widget failed to open');
}
