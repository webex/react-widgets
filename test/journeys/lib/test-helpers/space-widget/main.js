import {clickButton} from '../';

const activityMenu = '.ciscospark-activity-menu';

export const elements = {
  spaceWidget: '.ciscospark-space-widget',
  menuButton: 'button[aria-label="Main Menu"]',
  activityMenu,
  messageButton: `${activityMenu} button[aria-label="Message"]`,
  meetButton: `${activityMenu} button[aria-label="Call"]`,
  filesButton: ` ${activityMenu} button[aria-label="Files"]`,
  filesWidget: '//div[contains(@class, "ciscospark-widget-files")]',
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
  if (!aBrowser.isVisible(elements.activityMenu) && !aBrowser.isVisible(buttonToClick)) {
    clickButton(aBrowser, elements.menuButton);
    browser.waitUntil(() =>
      aBrowser.isVisible(elements.activityMenu) &&
      aBrowser.isVisible(buttonToClick),
    5000, 'could not open activity menu and find button to click');
  }
  aBrowser.click(buttonToClick);
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
