const menuButton = `.ciscospark-activity-menu-button-wrapper button`;
const messageButton = `button[aria-label="Message"]`;
const meetButton = `button[aria-label="Call"]`;
const activityMenu = `.ciscospark-activity-menu`;
const controlsContainer = `.ciscospark-controls-container`;


export function switchToMessage() {
  clickMenuButton(messageButton);
}

export function switchToMeet() {
  clickMenuButton(meetButton);
}

function clickMenuButton(buttonToClick) {
  if (!browser.isVisible(activityMenu)) {
    browser.click(menuButton);
    browser.waitForVisible(activityMenu);
  }
  browser.element(controlsContainer).element(buttonToClick).click();
}
