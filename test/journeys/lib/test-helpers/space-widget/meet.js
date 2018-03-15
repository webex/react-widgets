import {assert} from 'chai';

import '@ciscospark/internal-plugin-conversation';
import '@ciscospark/plugin-logger';
import '@ciscospark/plugin-phone';

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';

import {getEventLog} from '../../events';
import {constructHydraId} from '../../hydra';
import {moveMouse} from '../';

import {switchToMeet} from './main';
import {FEATURE_FLAG_ROSTER} from './roster';

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
  aBrowser.click(`${elements.meetWidget} ${elements.answerButton}`);
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
  caller.waitForVisible(`${elements.meetWidget} ${elements.callButton}`);
  caller.click(`${elements.meetWidget} ${elements.callButton}`);
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
  aBrowser.click(`${elements.meetWidget} ${elements.declineButton}`);
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
  aBrowser.waitForVisible(`${elements.meetWidget} ${elements.hangupButton}`);
  aBrowser.click(`${elements.meetWidget} ${elements.hangupButton}`);
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

/**
 * Creates our Back to the Future Test Users for group meeting tests
 * @returns {Object}
 */
export function setupGroupTestUsers() {
  let docbrown, marty, lorraine;
  testUsers.create({count: 1, config: {displayName: 'Marty McFly'}})
    .then((users) => {
      [marty] = users;
      marty.spark = new CiscoSpark({
        credentials: {
          authorization: marty.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return marty.spark.internal.device.register()
        .then(() => marty.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true))
        .then(() => marty.spark.internal.feature.setFeature('developer', FEATURE_FLAG_GROUP_CALLING, true));
    });

  testUsers.create({count: 1, config: {displayName: 'Emmett Brown'}})
    .then((users) => {
      [docbrown] = users;
      docbrown.spark = new CiscoSpark({
        credentials: {
          authorization: docbrown.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return docbrown.spark.internal.device.register()
        .then(() => docbrown.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true))
        .then(() => docbrown.spark.internal.feature.setFeature('developer', FEATURE_FLAG_GROUP_CALLING, true));
    });

  testUsers.create({count: 1, config: {displayName: 'Lorraine Baines'}})
    .then((users) => {
      [lorraine] = users;
      lorraine.spark = new CiscoSpark({
        credentials: {
          authorization: lorraine.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return lorraine.spark.internal.mercury.connect();
    });

  browser.waitUntil(() =>
    marty && marty.spark && marty.spark.internal.device.webSocketUrl &&
    docbrown && docbrown.spark && docbrown.spark.internal.device.webSocketUrl &&
    lorraine && lorraine.spark && lorraine.spark.internal.device.webSocketUrl,
  10000, 'failed to create test users');

  return {marty, docbrown, lorraine};
}

/**
 * Creates our Star Trek Test Users for one on one meeting tests
 * @returns {Object}
 */
export function setupOneOnOneUsers() {
  let mccoy, spock;
  testUsers.create({count: 1, config: {displayName: 'Mr Spock'}})
    .then((users) => {
      [spock] = users;
    });

  testUsers.create({count: 1, config: {displayName: 'Bones Mccoy'}})
    .then((users) => {
      [mccoy] = users;
    });

  browser.waitUntil(() =>
    mccoy && mccoy.email && spock && spock.email,
  15000, 'failed to create test users');

  return {mccoy, spock};
}
