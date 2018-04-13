import {assert} from 'chai';

import {constructHydraId} from '../../hydra';

export const FEATURE_FLAG_GROUP_CALLING = 'js-widgets-group-calling';

/**
 * Test to hangup call before reciever answers
 * @param {Object} localPage
 * @param {Object} remotePage
 * @returns {void}
 */
export function hangupBeforeAnswerTest({localPage, remotePage}) {
  localPage.placeCall();
  remotePage.confirmReceivingCall();
  localPage.hangupCall();

  // Should switch back to message widget after hangup
  browser.waitUntil(() =>
    localPage.hasMessageWidget &&
    remotePage.hasMessageWidget,
  5000, 'failed to return to message activity after hanging up a call');
}

/**
 * Test to decline incoming call
 * @param {Object} browserLocal
 * @param {Object} browserRemote
 * @returns {void}
 */
export function declineIncomingCallTest({localPage, remotePage, isGroup}) {
  remotePage.placeCall();
  localPage.confirmReceivingCall();
  localPage.declineCall();
  // Should switch back to message widget after hangup
  browser.waitUntil(() =>
    localPage.hasMessageWidget,
  20000, 'browserLocal failed to return to message activity after hanging up call');
  if (isGroup) {
    remotePage.hangupCall();
  }
  browser.waitUntil(() =>
    remotePage.hasMessageWidget,
  20000, 'browserRemote failed to return to message activity after hanging up a call');
}

/**
 * Test to hangup during ongoing call
 *
 * @param {Object} browserLocal
 * @param {Object} browserRemote
 */
export function hangupDuringCallTest({localPage, remotePage, isGroup}) {
  localPage.placeCall();
  remotePage.confirmReceivingCall();
  remotePage.answerCall();
  localPage.hangupCall();
  browser.waitUntil(() =>
    localPage.hasMessageWidget,
  20000, 'browserLocal failed to return to message activity after hanging up a call');
  if (isGroup) {
    remotePage.hangupCall();
  }
  // Should switch back to message widget after hangup
  browser.waitUntil(() =>
    remotePage.hasMessageWidget,
  20000, 'browserRemote failed to return to message activity after hanging up a call');
}

/**
 * Test to verify browser has proper call events
 * This test expects to have a completed call from local to remote in the logs
 * @param {TestObject} caller
 * @param {TestObject} receiver
 * @param {object} [space=false]
 * @returns {void}
 */
export function callEventTest({caller, receiver, isSpace = false}) {
  const callerEvents = caller.getEventLog();
  const receiverEvents = receiver.getEventLog();

  const findCreated = (event) => event.eventName === 'calls:created';
  const eventCreated = callerEvents.find(findCreated);
  const receiverEventCreated = receiverEvents.find(findCreated);
  assert.isDefined(eventCreated, 'has a calls created event');
  assert.isDefined(receiverEventCreated, 'has a calls created event');
  if (isSpace) {
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
    assert.equal(eventCreated.detail.data.actorName, caller.user.displayName, 'call created event did not have caller name as actorName');
    assert.equal(receiverEventCreated.detail.actorId, constructHydraId('PEOPLE', caller.user.id), 'call created event on receiver did not have caller id as actorId');
    assert.equal(receiverEventCreated.detail.data.actorName, caller.user.displayName, 'call created event on receiver did not have caller name as actorName');
  }

  let errorMessage = 'calls connected event is missing data';
  const eventConnected = callerEvents.find((event) => event.eventName === 'calls:connected');
  assert.isDefined(eventConnected, 'has a calls connected event', errorMessage);
  assert.containsAllKeys(eventConnected.detail, ['resource', 'event', 'actorId', 'data'], errorMessage);
  assert.containsAllKeys(eventConnected.detail.data, ['actorName', 'roomId'], 'calls:connected', errorMessage);
  if (isSpace) {
    assert.equal(eventCreated.detail.data.actorName, caller.user.displayName, 'call connected event did not have call name as actorName');
  }
  else {
    assert.equal(eventConnected.detail.actorId, constructHydraId('PEOPLE', caller.user.id));
    assert.equal(eventConnected.detail.data.actorName, caller.user.displayName, 'call connected event did not have caller name as actorName');
  }

  errorMessage = 'calls disconnected event is missing data';
  const eventDisconnected = callerEvents.find((event) => event.eventName === 'calls:disconnected');
  assert.isDefined(eventDisconnected, 'has a calls disconnected event', errorMessage);
  assert.containsAllKeys(eventDisconnected.detail, ['resource', 'event', 'actorId', 'data'], errorMessage);
  assert.containsAllKeys(eventDisconnected.detail.data, ['actorName', 'roomId'], errorMessage);
  if (!isSpace) {
    assert.equal(eventDisconnected.detail.actorId, constructHydraId('PEOPLE', caller.user.id), 'calls disconnected event did not have caller id as actorId');
    assert.equal(eventDisconnected.detail.data.actorName, caller.user.displayName, 'calls disconnected event on caller did not have caller name as actorName');
  }
}
