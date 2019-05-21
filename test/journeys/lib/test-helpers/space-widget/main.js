export const elements = {
  spaceWidget: '.ciscospark-space-widget',
  menuButton: 'button[aria-label="Main Menu"]',
  messageActivityButton: 'button[aria-label="Message"]',
  meetActivityButton: 'button[aria-label="Call"]',
  filesActivityButton: 'button[aria-label="Files"]',
  peopleActivityButton: 'button[aria-label="People"]',
  filesWidget: '//div[contains(@class, "ciscospark-widget-files")]',
  activityMenu: '.ciscospark-activity-menu',
  controlsContainer: '.ciscospark-controls-container',
  closeButton: 'button[aria-label="Close"]',
  exitButton: '.ciscospark-activity-menu-exit button',
  messageWidget: '.ciscospark-message-wrapper',
  meetWidget: '.ciscospark-meet-wrapper',
  errorMessage: '.ciscospark-error-title',
  widgetTitle: '.ciscospark-title-text',
  stickyButton: '#toggleStickyModeButton'
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
  aBrowser.waitForVisible(elements.messageActivityButton);
  aBrowser.click(elements.messageActivityButton);
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
  aBrowser.waitForVisible(elements.meetActivityButton);
  aBrowser.click(elements.meetActivityButton);
}

/**
 * Opens activity menu and clicks a button inside it
 * @param {Browser} aBrowser
 * @param {string} buttonToClick element selector
 */
export function openMenuAndClickButton(aBrowser, buttonToClick) {
  aBrowser.click(elements.menuButton);
  aBrowser.waitForVisible(elements.activityMenu);
  aBrowser.click(buttonToClick);
}
