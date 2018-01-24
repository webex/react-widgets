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
  callButton: 'button[aria-label="Call"]',
  answerButton: 'button[aria-label="Answer"]',
  declineButton: 'button[aria-label="Decline"]',
  hangupButton: 'button[aria-label="Hangup"]',
  callControls: '.call-controls',
  remoteVideo: '.remote-video video'
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
  aBrowser.waitForVisible(elements.answerButton);
  aBrowser.element(elements.meetWidget).element(elements.answerButton).click();
  aBrowser.waitForVisible(elements.remoteVideo);
  // Let call elapse 5 seconds before hanging up
  aBrowser.pause(5000);
}

/**
 * Begins call between two browsers
 * @param {Object} caller
 * @param {Object} reciever
 * @returns {void}
 */
export function call(caller, reciever) {
  caller.element(elements.meetWidget).element(elements.callButton).waitForVisible();
  caller.element(elements.meetWidget).element(elements.callButton).click();
  // wait for call to establish
  reciever.waitForVisible(elements.answerButton);
}

/**
 * Declines incoming call on specified browser
 * @param {Object} aBrowser
 * @returns {void}
 */
export function decline(aBrowser) {
  aBrowser.waitForVisible(elements.declineButton);
  aBrowser.element(elements.meetWidget).element(elements.declineButton).click();
}

/**
 * Hangs up call on specified browser
 * @param {Object} aBrowser
 * @returns {void}
 */
export function hangup(aBrowser) {
  // Call controls currently has a hover state
  moveMouse(aBrowser, elements.callContainer);
  aBrowser.waitForVisible(elements.callControls);
  aBrowser.element(elements.meetWidget).element(elements.hangupButton).waitForVisible();
  aBrowser.element(elements.meetWidget).element(elements.hangupButton).click();
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
  browserLocal.waitForVisible(elements.messageWidget);
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
  browserLocal.waitForVisible(elements.messageWidget);
  if (isMeeting) {
    // Meetings have to be manually disconnected (waiting for participants)
    hangup(browserRemote);
  }
  browserRemote.waitForVisible(elements.messageWidget);
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
  hangup(browserLocal);
  browserLocal.waitForVisible(elements.messageWidget);
  if (isMeeting) {
    // Meetings have to be manually disconnected (waiting for participants)
    hangup(browserRemote);
  }
  // Should switch back to message widget after hangup
  browserRemote.waitForVisible(elements.messageWidget);
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
    assert.equal(eventCreated.detail.data.actorName, space.displayName, 'call created event did not have space name');
    assert.equal(receiverEventCreated.detail.data.actorName, space.displayName, 'call created event on receiver did not have space name');
  }
  else {
    assert.containsAllKeys(eventCreated.detail, ['resource', 'event', 'actorId', 'data']);
    assert.containsAllKeys(eventCreated.detail.data, ['actorName', 'roomId']);
    assert.containsAllKeys(receiverEventCreated.detail, ['resource', 'event', 'actorId', 'data']);
    assert.containsAllKeys(receiverEventCreated.detail.data, ['actorName', 'roomId']);
    assert.equal(eventCreated.detail.actorId, constructHydraId('PEOPLE', caller.user.id), 'call created event did not have caller details');
    assert.equal(eventCreated.detail.data.actorName, caller.displayName, 'call created event did not have caller details');
    assert.equal(receiverEventCreated.detail.actorId, constructHydraId('PEOPLE', caller.user.id), 'call created event on receiver did not have caller details');
    assert.equal(receiverEventCreated.detail.data.actorName, caller.displayName, 'call created event on receiver did not have caller details');
  }

  const eventConnected = callerEvents.find((event) => event.eventName === 'calls:connected');
  assert.isDefined(eventConnected, 'has a calls connected event');
  assert.containsAllKeys(eventConnected.detail, ['resource', 'event', 'actorId', 'data']);
  assert.containsAllKeys(eventConnected.detail.data, ['actorName', 'roomId']);
  if (space) {
    assert.equal(eventCreated.detail.data.actorName, space.displayName, 'call connected event did not have space name');
  }
  else {
    assert.equal(eventConnected.detail.actorId, constructHydraId('PEOPLE', caller.user.id));
    assert.equal(eventConnected.detail.data.actorName, caller.displayName, 'call connected event did not have space name');
  }

  const eventDisconnected = callerEvents.find((event) => event.eventName === 'calls:disconnected');
  assert.isDefined(eventDisconnected, 'has a calls disconnected event');
  assert.containsAllKeys(eventDisconnected.detail, ['resource', 'event', 'actorId', 'data']);
  assert.containsAllKeys(eventDisconnected.detail.data, ['actorName', 'roomId']);
  if (!space) {
    assert.equal(eventDisconnected.detail.actorId, constructHydraId('PEOPLE', caller.user.id));
    assert.equal(eventDisconnected.detail.data.actorName, caller.displayName);
  }
}
