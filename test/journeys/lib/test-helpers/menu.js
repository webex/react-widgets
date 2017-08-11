const menuButton = `button[aria-label="Main Menu"]`;
const messageButton = `button[aria-label="Message"]`;
const meetButton = `button[aria-label="Call"]`;
const activityMenu = `.ciscospark-activity-menu`;
const controlsContainer = `.ciscospark-controls-container`;

export function switchToMessage(aBrowser) {
  if (!aBrowser.isVisible(activityMenu)) {
    aBrowser.click(menuButton);
    aBrowser.waitForVisible(activityMenu);
  }
  aBrowser.element(controlsContainer).element(messageButton).waitForVisible();
  aBrowser.click(messageButton);
}

export function switchToMeet(aBrowser) {
  if (!aBrowser.isVisible(activityMenu)) {
    aBrowser.click(menuButton);
    aBrowser.waitForVisible(activityMenu);
  }
  aBrowser.element(controlsContainer).element(meetButton).waitForVisible();
  aBrowser.click(meetButton);
}
