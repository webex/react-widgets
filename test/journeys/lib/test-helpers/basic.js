export const elements = {
  menuButton: `button[aria-label="Main Menu"]`,
  messageButton: `button[aria-label="Message"]`,
  meetButton: `button[aria-label="Call"]`,
  activityMenu: `.ciscospark-activity-menu`,
  controlsContainer: `.ciscospark-controls-container`,
  exitButton: `.ciscospark-activity-menu-exit button`,
  messageWidget: `.ciscospark-message-wrapper`,
  meetWidget: `.ciscospark-meet-wrapper`
};

export function switchToMessage(aBrowser) {
  if (!aBrowser.isVisible(elements.activityMenu)) {
    aBrowser.click(elements.menuButton);
    aBrowser.waitForVisible(elements.activityMenu);
  }
  aBrowser.element(elements.controlsContainer).element(elements.messageButton).waitForVisible();
  aBrowser.click(elements.messageButton);
}

export function switchToMeet(aBrowser) {
  if (!aBrowser.isVisible(elements.activityMenu)) {
    aBrowser.click(elements.menuButton);
    aBrowser.waitForVisible(elements.activityMenu);
  }
  aBrowser.element(elements.controlsContainer).element(elements.meetButton).waitForVisible();
  aBrowser.click(elements.meetButton);
}
