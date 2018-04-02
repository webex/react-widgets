import BaseWidgetObject from '../base';

export default class MainSpaceWidget extends BaseWidgetObject {
  get titleText() { return this.browser.getText(this.elements.title); }

  get hasMessageWidget() { return this.browser.isVisible(this.elements.messageWidget); }

  get hasMeetWidget() { return this.browser.isVisible(this.elements.meetWidget); }

  constructor(props) {
    super(props);
    const activityMenu = '.ciscospark-activity-menu';
    this.elements = Object.assign({}, this.elements, {
      spaceWidget: '.ciscospark-space-widget',
      title: 'h1.ciscospark-title',
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
    });

    this.open();
  }

  open() {
    this.browser
      .url('/space.html')
      .execute(() => {
        localStorage.clear();
      });
  }

  openMenuAndClickButton(buttonToClick) {
    const aBrowser = this.browser;
    const {elements} = this;
    if (!aBrowser.isVisible(elements.activityMenu) &&
      !aBrowser.isVisible(buttonToClick)) {
      this.clickButton(elements.menuButton);
      browser.waitUntil(() =>
        aBrowser.isVisible(elements.activityMenu) &&
        aBrowser.isVisible(buttonToClick),
      5000, 'could not open activity menu and find button to click');
    }
    aBrowser.click(buttonToClick);
  }

  switchToMessage() {
    if (!this.hasMessageWidget) {
      this.openMenuAndClickButton(this.elements.messageButton);
    }
  }

  switchToMeet() {
    if (!this.hasMeetWidget) {
      this.openMenuAndClickButton(this.elements.meetButton);
    }
  }
}
