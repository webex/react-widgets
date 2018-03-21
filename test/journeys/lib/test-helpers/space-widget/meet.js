import {assert} from 'chai';

import {getEventLog} from '../../events';
import {constructHydraId} from '../../hydra';
import {moveMouse} from '../';

import {switchToMeet} from './main';

export const FEATURE_FLAG_GROUP_CALLING = 'js-widgets-group-calling';

export const elements = {
  callContainer: '.call-container',
  meetWidget: '.ciscospark-meet-wrapper',
  messageWidget: '.ciscospark-message-wrapper',
  callButton: '.ciscospark-meet-wrapper button[aria-label="Call"]',
  answerButton: '.ciscospark-meet-wrapper button[aria-label="Answer"]',
  declineButton: '.ciscospark-meet-wrapper button[aria-label="Decline"]',
  hangupButton: '.ciscospark-meet-wrapper button[aria-label="Hangup"]',
  callControls: '.ciscospark-meet-wrapper .call-controls',
  remoteVideo: '.ciscospark-meet-wrapper .remote-video video'
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
  browser.waitUntil(() =>
    aBrowser.isVisible(elements.answerButton),
  10000, 'answer button is not visible');
  aBrowser.click(elements.answerButton);
  browser.waitUntil(() =>
    aBrowser.isVisible(elements.remoteVideo),
  10000, 'remote video is not visible after answering a call');
  // Let call elapse 5 seconds before hanging up
  browser.pause(3000);
}

/**
 * Begins call between two browsers
 * @param {Object} caller
 * @param {Object} receiver
 * @returns {void}
 */
export function call(caller, receiver) {
  switchToMeet(caller);
  switchToMeet(receiver);
  browser.waitUntil(() =>
    caller.isVisible(elements.callButton) &&
    receiver.isVisible(elements.callButton),
  5000, 'call button is not visible after switching to meet widget');

  caller.click(elements.callButton);
  // wait for call to establish
  browser.waitUntil(() =>
    receiver.isVisible(elements.answerButton) &&
    caller.isVisible(elements.callControls),
  10000, 'answer button is not visible after sender intiates a call');
}

/**
 * Declines incoming call on specified browser
 * @param {Object} aBrowser
 * @returns {void}
 */
export function decline(aBrowser) {
  browser.waitUntil(() =>
    aBrowser.isVisible(elements.declineButton),
  1500, 'decline button is not visible');
  aBrowser.click(elements.declineButton);
}

/**
 * Hangs up call on specified browser
 * @param {Object} aBrowser
 * @returns {void}
 */
export function hangup(aBrowser) {
  // Call controls currently has a hover state
  moveMouse(aBrowser, elements.callContainer);
  browser.waitUntil(() =>
    aBrowser.isVisible(elements.callControls),
  1500, 'call controls were not visible after hovering over');
  browser.waitUntil(() =>
    aBrowser.isVisible(elements.hangupButton),
  1500, 'hangup button was not visible after hovering over');

  aBrowser.click(elements.hangupButton);
}

/**
 * Test to hangup call before reciever answers
 * @param {Object} browserLocal
 * @param {Object} browserRemote
 * @returns {void}
 */
export function hangupBeforeAnswerTest(browserLocal, browserRemote) {
  call(browserLocal, browserRemote);
  hangup(browserLocal);
  // Should switch back to message widget after hangup
  browser.waitUntil(() =>
    browserLocal.isVisible(elements.messageWidget) &&
    browserRemote.isVisible(elements.messageWidget),
  5000, 'failed to return to message activity after hanging up a call');
}

/**
 * Test to decline incoming call
 * @param {Object} browserLocal
 * @param {Object} browserRemote
 * @param {boolean} [isMeeting=true] if the call is a "meeting" instead of a "call"
 * @returns {void}
 */
export function declineIncomingCallTest(browserLocal, browserRemote, isMeeting = false) {
  call(browserRemote, browserLocal);
  decline(browserLocal);
  // Should switch back to message widget after hangup
  browser.waitUntil(() =>
    browserLocal.isVisible(elements.messageWidget),
  5000, 'failed to return to message activity after hanging up call');
  if (isMeeting) {
    // Meetings have to be manually disconnected (waiting for participants)
    hangup(browserRemote);
  }
  browser.waitUntil(() =>
    browserRemote.isVisible(elements.messageWidget),
  5000, 'failed to return to message activity after hanging up a call');
}

/**
 * Test to hangup during ongoing call
 * @param {Object} browserLocal
 * @param {Object} browserRemote
 * @param {boolean} [isMeeting=false] if the call is a "meeting" instead of a "call"
 * @returns {void}
 */
export function hangupDuringCallTest(browserLocal, browserRemote, isMeeting = false) {
  call(browserLocal, browserRemote);
  answer(browserRemote);
  hangup(browserLocal);
  browser.waitUntil(() =>
    browserLocal.isVisible(elements.messageWidget),
  5000, 'browserLocal failed to return to message activity after hanging up a call');

  if (isMeeting) {
    // Meetings have to be manually disconnected (waiting for participants)
    hangup(browserRemote);
  }
  // Should switch back to message widget after hangup
  browser.waitUntil(() =>
    browserRemote.isVisible(elements.messageWidget),
  5000, 'browserRemote failed to return to message activity after hanging up a call');
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
