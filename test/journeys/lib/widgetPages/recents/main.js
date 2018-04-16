import {createSpace} from '../../sdk';

import BaseWidgetObject from '../base';


export default class RecentsWidget extends BaseWidgetObject {
  get hasRecentsWidget() { return this.browser.isVisible(this.elements.recentsWidget); }

  get hasCallButton() { return this.browser.isVisible(this.elements.callButton); }

  get hasAnswerButton() { return this.browser.isVisible(this.elements.answerButton); }

  get hasfirstUnreadIndicator() {
    return this.browser.isVisible(`${this.elements.firstSpace} ${this.elements.unreadIndicator}`);
  }

  get firstSpaceTitleText() { return this.browser.getText(`${this.elements.firstSpace} ${this.elements.title}`); }

  get firstSpaceLastActivityText() {
    return this.browser.getText(`${this.elements.firstSpace} ${this.elements.lastActivity}`);
  }

  constructor(props) {
    super(props);
    const recentsWidget = '.ciscospark-recents-widget';
    this.elements = Object.assign({}, this.elements, {
      recentsWidget,
      firstSpace: '.space-item:first-child',
      title: '.space-title',
      unreadIndicator: '.space-unread-indicator',
      lastActivity: '.space-last-activity',
      callButton: `${recentsWidget} button[aria-label="Call Space"]`,
      answerButton: `${recentsWidget} button[aria-label="Answer"]`
    });
  }

  loadWidget() {
    this.browser.execute((accessToken) => {
      window.openRecentsWidget({
        accessToken
      });
    }, this.user.token.access_token);
  }

  loadWithGlobals() {
    this.browser.execute((accessToken) => {
      window.openWidgetGlobal({
        accessToken
      });
    }, this.user.token.access_token);
  }

  loadWithDataApi() {
    this.browser.execute((accessToken) => {
      window.openWidgetDataApi({
        accessToken
      });
    }, this.user.token.access_token);
  }

  createSpace(options) {
    return createSpace({
      sparkInstance: this.user.spark,
      ...options
    });
  }

  postToSpace({
    sender = this.user, space, message
  }) {
    let activity;
    browser.call(() => sender.spark.internal.conversation.post(space, {
      displayName: message,
      content: message
    }).then((a) => {
      activity = a;
    }));
    return activity;
  }

  moveMouseToFirstSpace() {
    this.moveMouse(this.elements.firstSpace);
  }

  clickFirstSpace() {
    this.browser.click(this.elements.firstSpace);
  }
}
