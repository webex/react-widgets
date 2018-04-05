import MainSpaceWidget from './main';

export const FEATURE_FLAG_GROUP_CALLING = 'js-widgets-group-calling';

export default class MeetWidgetPage extends MainSpaceWidget {
  get hasAnswerButton() { return this.browser.isVisible(this.elements.answerButton); }

  get hasCallButton() { return this.browser.isVisible(this.elements.callButton); }

  get hasCallControls() { return this.browser.isVisible(this.elements.callControls); }

  get hasCallContainer() { return this.browser.isVisible(this.elements.callContainer); }

  get hasRemoteVideo() { return this.browser.isVisible(this.elements.remoteVideo); }

  constructor(props) {
    super(props);
    const meetWidget = '.ciscospark-meet-wrapper';
    this.elements = Object.assign({}, this.elements, {
      callContainer: '.call-container',
      meetWidget,
      callButton: `${meetWidget} button[aria-label="Call"]`,
      answerButton: `${meetWidget} button[aria-label="Answer"]`,
      declineButton: `${meetWidget} button[aria-label="Decline"]`,
      hangupButton: `${meetWidget} button[aria-label="Hangup"]`,
      callControls: `${meetWidget} .call-controls`,
      remoteVideo: `${meetWidget} .remote-video video`
    });
  }

  answerCall() {
    const {elements} = this;
    this.switchToMeet();
    this.clickButton(elements.answerButton);
    browser.waitUntil(() => this.hasRemoteVideo,
      10000, 'remote video is not visible after answering a call');
    // Let call elapse 5 seconds before performing any actions
    browser.pause(5000);
  }

  /**
   * Begins call on established widgets
   */
  placeCall() {
    const aBrowser = this.browser;
    this.switchToMeet();
    browser.waitUntil(() =>
      this.hasCallButton,
    10000, 'call button is not visible after switching to meet widget');
    aBrowser.click(this.elements.callButton);
    // wait for call to establish
    browser.waitUntil(() =>
      this.hasCallContainer,
    15000, 'call controls not visible after starting a call');
    browser.pause(5000);
  }

  /**
   * Confirm widget is receiving a call
   */
  confirmReceivingCall() {
    this.switchToMeet();
    browser.waitUntil(() =>
      this.hasAnswerButton,
    20000, 'answer button is not visible after receiving a call');
  }

  /**
   * Declines incoming call
   */
  declineCall() {
    this.switchToMeet();
    this.clickButton(this.elements.declineButton);
  }

  /**
   * Hangs up call
   */
  hangupCall() {
    this.switchToMeet();
    // Call controls currently has a hover state
    this.moveMouse(this.elements.callContainer);
    this.clickButton(this.elements.hangupButton);
  }
}
