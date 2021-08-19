export const elements = {
  spaceWidget: '.webex-space-widget',
  menuButton: 'button[aria-label="Main Menu"]',
  messageActivityButton: 'button[aria-label="Messages"]',
  meetActivityButton: 'button[aria-label="Call"]',
  filesActivityButton: 'button[aria-label="Content"]',
  peopleActivityButton: 'button[aria-label="People"]',
  filesWidget: '//div[contains(@class, "webex-widget-files")]',
  activityMenu: '.webex-activity-menu',
  controlsContainer: '.webex-tabs',
  closeButton: 'button[aria-label="Close"]',
  exitButton: '.webex-activity-menu-exit button',
  messageWidget: '.webex-message-wrapper',
  meetWidget: '.webex-meet-wrapper',
  errorMessage: '.webex-error-title',
  widgetTitle: '.webex-title-text',
  stickyButton: '#toggleStickyModeButton'
};

/**
 * Switches to message widget
 * @param {Object} aBrowser
 * @returns {void}
 */
export function switchToMessage(aBrowser) {
  aBrowser.$(elements.messageActivityButton).waitForDisplayed();
  aBrowser.$(elements.messageActivityButton).click();
}

/**
 * Switches to meet widget
 * @param {Object} aBrowser
 * @returns {void}
 */
export function switchToMeet(aBrowser) {
  aBrowser.$(elements.meetActivityButton).waitForDisplayed();
  aBrowser.$(elements.meetActivityButton).click();
}

/**
 * Opens activity menu and clicks a button inside it
 * @param {Browser} aBrowser
 * @param {string} buttonToClick element selector
 */
export function openMenuAndClickButton(aBrowser, buttonToClick) {
  aBrowser.$(buttonToClick).click();
}
