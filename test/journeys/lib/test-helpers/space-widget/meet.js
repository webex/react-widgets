import {assert} from 'chai';

import {getEventLog} from '../../events';
import {constructHydraId} from '../../hydra';

import {switchToMeet} from './main';

export const elements = {
  callContainer: '.call-container',
  meetWidget: '.webex-meet-wrapper',
  messageWidget: '.webex-message-wrapper',
  callButton: 'button[aria-label="Start Call"]',
  answerButton: 'button[aria-label="Answer"]',
  declineButton: 'button[aria-label="Decline"]',
  hangupButton: 'button[aria-label="Leave"]',
  callControls: '.wxc-meeting-controls',
  remoteVideo: '.wxc-in-meeting'
};
/**
 * @typedef {object} TestObject
 * @param {object} browser - browser for test
 * @param {object} user - user object for test
 * @param {object} displayName - name used to identify test object
 */

/**
 * Answers call on specified browser
 * @param {Object} aBrowser
 * @returns {void}
 */
export function answer(aBrowser) {
  aBrowser.waitUntil(() =>
    aBrowser.isVisible(elements.answerButton),
  5000, 'answer button is not visible while answering call');
  aBrowser.$(elements.answerButton).click();
  aBrowser.waitUntil(() =>
    aBrowser.isVisible(elements.remoteVideo),
  5000, 'remote video is not visible after answering call');
}

/**
 * Begins call between two browsers
 * @param {Object} caller
 * @param {Object} reciever
 * @returns {void}
 */
export function call(caller, reciever) {
  caller.$(elements.callButton).waitForDisplayed();
  caller.$(elements.callButton).click();
  reciever.$(elements.answerButton).waitForDisplayed({timeout: 1000});
}

/**
 * Declines incoming call on specified browser
 * @param {Object} aBrowser
 * @returns {void}
 */
export function decline(aBrowser) {
  aBrowser.$(elements.declineButton).waitForDisplayed();
  aBrowser.$(elements.declineButton).click();
}

/**
 * Hangs up call on specified browser
 * @param {Object} aBrowser
 * @returns {void}
 */
export function hangup(aBrowser) {
  aBrowser.execute((x) => {
    document.querySelector(x).style.display = 'block';
  }, elements.callContainer);
  if (!aBrowser.$(elements.hangupButton).isDisplayed()) {
    aBrowser.$(elements.hangupButton).scrollIntoView();
  }
  aBrowser.$(elements.hangupButton).click();
}

/**
 * Test to hangup call before reciever answers
 * @param {Object} browserLocal
 * @param {Object} browserRemote
 * @returns {void}
 */
export function hangupBeforeAnswerTest(browserLocal, browserRemote) {
  switchToMeet(browserLocal);
  call(browserLocal, browserRemote);
  hangup(browserLocal);
  // Should switch back to message widget after hangup
  browserLocal.$(elements.messageWidget).waitForDisplayed();
}

/**
 * Test to decline incoming call
 * @param {Object} browserLocal
 * @param {Object} browserRemote
 * @param {boolean} [isMeeting=true] if the call is a "meeting" instead of a "call"
 * @returns {void}
 */
export function declineIncomingCallTest(browserLocal, browserRemote, isMeeting = false) {
  switchToMeet(browserRemote);
  call(browserRemote, browserLocal);
  decline(browserLocal);
  // Should switch back to message widget after hangup
  browserLocal.$(elements.messageWidget).waitForDisplayed();
  if (isMeeting) {
    // Meetings have to be manually disconnected (waiting for participants)
    hangup(browserRemote);
  }
  browserRemote.$(elements.messageWidget).waitForDisplayed();
}

/**
 * Test to hangup during ongoing call
 * @param {Object} browserLocal
 * @param {Object} browserRemote
 * @param {boolean} [isMeeting=false] if the call is a "meeting" instead of a "call"
 * @returns {void}
 */
export function hangupDuringCallTest(browserLocal, browserRemote, isMeeting = false) {
  switchToMeet(browserLocal);
  call(browserLocal, browserRemote);
  answer(browserRemote);
  // Let call elapse 5 seconds before hanging up
  browser.pause(5000);
  hangup(browserLocal);
  if (isMeeting) {
    // Meetings have to be manually disconnected (waiting for participants)
    hangup(browserRemote);
  }
  browserLocal.$(elements.messageWidget).waitForDisplayed();
  // Should switch back to message widget after hangup
  browserRemote.$(elements.messageWidget).waitForDisplayed();
}

/**
 * Test to verify browser has proper call events
 * This test expects to have a completed call from local to remote in the logs
 * @param {TestObject} caller
 * @param {TestObject} receiver
 * @param {object} [space=false]
 * @returns {void}
 */
export function callEventTest(caller, receiver, space = false) {
  const callerEvents = getEventLog(caller.browser);
  const receiverEvents = getEventLog(receiver.browser);

  const findCreated = (event) => event.eventName === 'calls:created';
  const eventCreated = callerEvents.find(findCreated);
  const receiverEventCreated = receiverEvents.find(findCreated);

  assert.isDefined(eventCreated, 'has a calls created event');
  assert.isDefined(receiverEventCreated, 'has a calls created event');
  if (space) {
    assert.containsAllKeys(eventCreated.detail, ['resource', 'event', 'data']);
    assert.containsAllKeys(eventCreated.detail.data, ['actorName', 'roomId']);
    assert.containsAllKeys(receiverEventCreated.detail, ['resource', 'event', 'data']);
    assert.containsAllKeys(receiverEventCreated.detail.data, ['actorName', 'roomId']);
    assert.equal(eventCreated.detail.data.actorName, caller.user.displayName, 'call created event did not have caller name as actorName');
    assert.equal(receiverEventCreated.detail.data.actorName, caller.user.displayName, 'call created event on receiver did not have caller name as actorName');
  }
  else {
    assert.containsAllKeys(eventCreated.detail, ['resource', 'event', 'actorId', 'data']);
    assert.containsAllKeys(eventCreated.detail.data, ['actorName', 'roomId']);
    assert.containsAllKeys(receiverEventCreated.detail, ['resource', 'event', 'actorId', 'data']);
    assert.containsAllKeys(receiverEventCreated.detail.data, ['actorName', 'roomId']);
    assert.equal(eventCreated.detail.actorId, constructHydraId('PEOPLE', caller.user.id), 'call created event did not have caller id as actorId');
    assert.equal(eventCreated.detail.data.actorName, caller.displayName, 'call created event did not have caller name as actorName');
    assert.equal(receiverEventCreated.detail.actorId, constructHydraId('PEOPLE', caller.user.id), 'call created event on receiver did not have caller id as actorId');
    assert.equal(receiverEventCreated.detail.data.actorName, caller.displayName, 'call created event on receiver did not have caller name as actorName');
  }

  let errorMessage = 'calls connected event is missing data';
  const eventConnected = callerEvents.find((event) => event.eventName === 'calls:connected');

  assert.isDefined(eventConnected, 'has a calls connected event', errorMessage);
  assert.containsAllKeys(eventConnected.detail, ['resource', 'event', 'actorId', 'data'], errorMessage);
  assert.containsAllKeys(eventConnected.detail.data, ['actorName', 'roomId'], 'calls:connected', errorMessage);
  if (space) {
    assert.equal(eventCreated.detail.data.actorName, caller.user.displayName, 'call connected event did not have call name as actorName');
  }
  else {
    assert.equal(eventConnected.detail.actorId, constructHydraId('PEOPLE', caller.user.id));
    assert.equal(eventConnected.detail.data.actorName, caller.displayName, 'call connected event did not have caller name as actorName');
  }

  errorMessage = 'calls disconnected event is missing data';
  const eventDisconnected = callerEvents.find((event) => event.eventName === 'calls:disconnected');

  assert.isDefined(eventDisconnected, 'has a calls disconnected event', errorMessage);
  assert.containsAllKeys(eventDisconnected.detail, ['resource', 'event', 'actorId', 'data'], errorMessage);
  assert.containsAllKeys(eventDisconnected.detail.data, ['actorName', 'roomId'], errorMessage);
  if (!space) {
    assert.equal(eventDisconnected.detail.actorId, constructHydraId('PEOPLE', caller.user.id), 'calls disconnected event did not have caller id as actorId');
    assert.equal(eventDisconnected.detail.data.actorName, caller.displayName, 'calls disconnected event on caller did not have caller name as actorName');
  }
}
