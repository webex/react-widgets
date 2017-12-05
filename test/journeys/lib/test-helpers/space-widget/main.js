export const elements = {
  spaceWidget: '.ciscospark-space-widget',
  menuButton: 'button[aria-label="Main Menu"]',
  messageButton: 'button[aria-label="Message"]',
  meetButton: 'button[aria-label="Call"]',
  activityMenu: '.ciscospark-activity-menu',
  controlsContainer: '.ciscospark-controls-container',
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
  aBrowser.element(elements.controlsContainer).element(elements.messageButton).waitForVisible();
  aBrowser.click(elements.messageButton);
}

/**
 * Switches to meet widget
 * @param {Object} aBrowser
 * @returns {void}
 */
export function switchToMeet(aBrowser) {
  if (!aBrowser.isVisible(elements.activityMenu)) {
    aBrowser.click(elements.menuButton);
    aBrowser.waitForVisible(elements.activityMenu);
  }
  aBrowser.element(elements.controlsContainer).element(elements.meetButton).waitForVisible();
  aBrowser.click(elements.meetButton);
}

/**
 * Opens activity menu and clicks a button inside it
 * @param {Browser} aBrowser
 * @param {string} buttonToClick element selector
 * @returns {null}
 */
export function openMenuAndClickButton(aBrowser, buttonToClick) {
  aBrowser.click(elements.menuButton);
  aBrowser.waitForVisible(elements.activityMenu);
  aBrowser.element(elements.controlsContainer).element(buttonToClick).click();
}
