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
 * Switches to message widget
 * @param {Object} aBrowser
 * @returns {void}
 */
export function switchToMessage(aBrowser) {
  if (!aBrowser.isVisible(elements.activityMenu)) {
    aBrowser.click(elements.menuButton);
    aBrowser.waitForVisible(elements.activityMenu);
  }
  aBrowser.waitForVisible(`${elements.activityMenu} ${elements.messageButton}`);
  aBrowser.click(elements.messageButton);
}

/**
 * Switches to meet widget
 * @param {Object} aBrowser
 * @returns {void}
 */
export function switchToMeet(aBrowser) {
  if (!aBrowser.isVisible(elements.activityMenu)) {
    aBrowser.waitForVisible(elements.menuButton);
    aBrowser.click(elements.menuButton);
    aBrowser.waitForVisible(elements.activityMenu);
  }
  aBrowser.waitForVisible(`${elements.activityMenu} ${elements.meetButton}`);
  aBrowser.click(elements.meetButton);
}

/**
 * Opens activity menu and clicks a button inside it
 * @param {Browser} aBrowser
 * @param {string} buttonToClick element selector
 */
export function openMenuAndClickButton(aBrowser, buttonToClick) {
  aBrowser.click(elements.menuButton);
  aBrowser.waitForVisible(elements.activityMenu);
  aBrowser.click(`${elements.activityMenu} ${buttonToClick}`);
}
