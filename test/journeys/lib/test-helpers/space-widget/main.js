export const elements = {
  spaceWidget: '.ciscospark-space-widget',
  menuButton: 'button[aria-label="Main Menu"]',
  messageButton: 'button[aria-label="Message"]',
  meetButton: 'button[aria-label="Call"]',
  filesButton: 'button[aria-label="Files"]',
  filesWidget: '//div[contains(@class, "ciscospark-widget-files")]',
  activityMenu: '.ciscospark-activity-menu',
  activityList: '.ciscospark-activity-list',
  controlsContainer: '.ciscospark-controls-container',
  closeButton: 'button[aria-label="Close"]',
  exitButton: '.ciscospark-activity-menu-exit button',
  messageWidget: '.ciscospark-message-wrapper',
  meetWidget: '.ciscospark-meet-wrapper'
};

/**
 * Opens activity menu and clicks a button inside it
 * @param {Browser} aBrowser
 * @param {string} buttonToClick element selector
 */
export function openMenuAndClickButton(aBrowser, buttonToClick) {
  if (!aBrowser.isVisible(elements.activityMenu)) {
    browser.waitUntil(() =>
      aBrowser.isVisible(elements.menuButton),
    5000, 'menu button is not visible when trying to open activity menu');
    aBrowser.click(elements.menuButton);
    browser.waitUntil(() =>
      aBrowser.isVisible(elements.activityMenu),
    5000, 'could not open activity menu');
  }
  aBrowser.click(`${elements.activityMenu} ${buttonToClick}`);
}

/**
 * Switches to message widget
 * @param {Object} aBrowser
 * @returns {void}
 */
export function switchToMessage(aBrowser) {
  if (!aBrowser.isVisible(elements.messageWidget)) {
    openMenuAndClickButton(aBrowser, elements.messageButton);
  }
}

/**
 * Switches to meet widget
 * @param {Object} aBrowser
 * @returns {void}
 */
export function switchToMeet(aBrowser) {
  if (!aBrowser.isVisible(elements.meetWidget)) {
    openMenuAndClickButton(aBrowser, elements.meetButton);
  }
}
