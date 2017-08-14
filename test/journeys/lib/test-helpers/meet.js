export const elements = {
  meetWidget: `.ciscospark-meet-wrapper`,
  messageWidget: `.ciscospark-message-wrapper`,
  callButton: `button[aria-label="Call"]`,
  answerButton: `button[aria-label="Answer"]`,
  declineButton: `button[aria-label="Decline"]`,
  hangupButton: `button[aria-label="Hangup"]`,
  callControls: `.call-controls`,
  remoteVideo: `.remote-video video`
};

export function answer(aBrowser) {
  aBrowser.element(elements.meetWidget).element(elements.answerButton).click();
  aBrowser.waitForVisible(elements.remoteVideo);
  // Let call elapse 5 seconds before hanging up
  aBrowser.pause(5000);
}

export function call(caller, reciever) {
  caller.moveToObject(elements.meetWidget);
  caller.element(elements.meetWidget).element(elements.callButton).waitForVisible();
  caller.element(elements.meetWidget).element(elements.callButton).click();
  // wait for call to establish
  reciever.waitForVisible(elements.answerButton);
}

export function decline(aBrowser) {
  aBrowser.waitForVisible(elements.declineButton);
  aBrowser.element(elements.meetWidget).element(elements.declineButton).click();
  aBrowser.element(elements.meetWidget).element(elements.callButton).waitForVisible();
}

export function hangup(aBrowser) {
  // Call controls currently has a hover state
  aBrowser.moveToObject(elements.meetWidget);
  aBrowser.waitForVisible(elements.callControls);
  aBrowser.element(elements.meetWidget).element(elements.hangupButton).click();
}
