const menuButton = `.ciscospark-activity-menu-button-wrapper button`;
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
}
