const menuButton = `button[aria-label="Main Menu"]`;
const messageButton = `button[aria-label="Message"]`;
const meetButton = `button[aria-label="Call"]`;
const activityMenu = `.ciscospark-activity-menu`;
const controlsContainer = `.ciscospark-controls-container`;


export function switchToMessage(aBrowser) {
  clickMenuButton(aBrowser, messageButton);
}

export function switchToMeet(aBrowser) {
  clickMenuButton(aBrowser, meetButton);
}

function clickMenuButton(aBrowser, buttonToClick) {
  if (!aBrowser.isVisible(activityMenu)) {
    aBrowser.click(menuButton);
    aBrowser.waitForVisible(activityMenu);
  }
  aBrowser.element(controlsContainer).element(buttonToClick).click();
  aBrowser.waitForVisible(activityMenu, null, true);
}

/**
 * Opens activity menu and clicks a button inside it
 * @param {Browser} aBrowser
 * @param {string} buttonToClick element selector
 * @returns {null}
 */
export function openMenuAndClickButton(aBrowser, buttonToClick) {
  aBrowser.click(menuButton);
  aBrowser.waitForVisible(activityMenu);
  aBrowser.element(controlsContainer).element(buttonToClick).click();
}
