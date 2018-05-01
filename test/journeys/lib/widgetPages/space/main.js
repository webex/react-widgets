import BaseWidgetObject from '../base';

export default class MainSpaceWidgetPage extends BaseWidgetObject {
  get titleText() { return this.browser.getText(this.elements.title); }

  get hasActivityMenuButton() { return this.browser.isVisible(this.elements.menuButton); }

  get hasActivityMenu() { return this.browser.isVisible(this.elements.activityMenu); }

  get hasExitButton() { return this.browser.isVisible(this.elements.exitButton); }

  get hasRosterButton() { return this.browser.isVisible(this.elements.rosterButton); }

  get hasCallButton() { return this.browser.isVisible(this.elements.meetButton); }

  get hasMessageWidget() { return this.browser.isVisible(this.elements.messageWidget); }

  get hasMeetWidget() { return this.browser.isVisible(this.elements.meetWidget); }

  get hasFilesWidget() { return this.browser.isVisible(this.elements.filesWidget); }

  get hasRosterWidget() { return this.browser.isVisible(this.elements.rosterWidget); }

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
      rosterButton: ` ${activityMenu} button[aria-label="People"]`,
      filesWidget: '//div[contains(@class, "ciscospark-widget-files")]',
      rosterWidget: '//div[contains(@class, "ciscospark-roster")]',
      controlsContainer: '.ciscospark-controls-container',
      closeButton: 'button[aria-label="Close"]',
      exitButton: '.ciscospark-activity-menu-exit button',
      messageWidget: '.ciscospark-message-wrapper',
      meetWidget: '.ciscospark-meet-wrapper'
    });
  }

  /**
   * Loads a widget into the browser with browser globals
   * @param {Object} options
   * @param {string} options.spaceId
   * @param {string} options.toPersonEmail
   * @param {string} options.initialActivity
   * @param {boolean} options.startCall
   */
  loadWithGlobals({
    spaceId,
    toPersonEmail,
    initialActivity,
    startCall
  }) {
    const aBrowser = this.browser;
    this.refresh();
    aBrowser.waitUntil(() =>
      this.hasWidgetContainer,
    15000, 'failed to load widget container');
    aBrowser.execute((options) => {
      window.openWidgetGlobal(options);
    }, {
      accessToken: this.user.token.access_token,
      spaceId,
      toPersonEmail,
      initialActivity,
      startCall
    });
  }

  /**
   * Loads a widget into the browser with Data API
   * @param {Object} options
   * @param {string} options.bundle required
   * @param {string} options.widget required, name of widget we need to load
   * @param {string} options.spaceId
   * @param {string} options.toPersonEmail
   * @param {string} options.initialActivity
   * @param {boolean} options.startCall
   */
  loadWithDataApi({
    spaceId,
    toPersonEmail,
    initialActivity,
    startCall
  }) {
    const aBrowser = this.browser;
    this.refresh();
    aBrowser.waitUntil(() =>
      this.hasWidgetContainer,
    15000, 'failed to load widget container');
    aBrowser.execute((options) => {
      window.openWidgetDataApi(options);
    }, {
      accessToken: this.user.token.access_token,
      spaceId,
      toPersonEmail,
      initialActivity,
      startCall
    });
  }

  openActivityMenu() {
    if (!this.hasActivityMenu) {
      this.clickButton(this.elements.menuButton);
      browser.waitUntil(() =>
        this.hasActivityMenu,
      5000, 'could not open activity menu');
    }
  }

  closeActivityMenu() {
    if (this.hasActivityMenu) {
      browser.waitUntil(() =>
        this.hasExitButton,
      5000, 'could not find exit button');

      this.clickButton(this.elements.exitButton);
      browser.waitUntil(() =>
        !this.hasActivityMenu,
      5000, 'activity menu is still visible after close');
    }
  }

  openMenuAndClickButton(buttonToClick) {
    const aBrowser = this.browser;
    this.openActivityMenu();
    browser.waitUntil(() =>
      aBrowser.isVisible(buttonToClick),
    5000, 'could not open activity menu and find button to click');
    aBrowser.click(buttonToClick);
  }

  switchToMessage() {
    if (!this.hasMessageWidget) {
      this.openMenuAndClickButton(this.elements.messageButton);
    }
  }

  switchToFiles() {
    if (!this.hasFilesWidget) {
      this.openMenuAndClickButton(this.elements.filesButton);
    }
  }

  switchToMeet() {
    if (!this.hasMeetWidget) {
      this.openMenuAndClickButton(this.elements.meetButton);
    }
  }

  openRoster() {
    if (!this.hasRosterWidget) {
      this.openMenuAndClickButton(this.elements.rosterButton);
    }
  }
}
