import '@ciscospark/internal-plugin-conversation';
import '@ciscospark/plugin-logger';
import '@ciscospark/plugin-phone';

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';

/**
 * Creates a number of test users
 * @param {number} count number of users to generate
 * @param {Object} userInfo with config to pass to test user creator
 * @returns {Object}
 */
export function createTestUsers(count, userInfo = {
  docbrown: {displayName: 'Emmett Brown'},
  lorraine: {displayName: 'Lorraine Baines'},
  marty: {displayName: 'Marty McFly'},
  biff: {displayName: 'Biff Tannen'}
}) {
  const users = {};
  const userKeys = Object.keys(userInfo);

  function storeUser(u, key) {
    [users[key]] = u;
    users[key].spark = new CiscoSpark({
      credentials: {
        authorization: users[key].token
      },
      config: {
        logger: {
          level: 'error'
        }
      }
    });
    return users[key];
  }

  browser.call(function createUsers() {
    const promises = [];
    for (let i = 0; i < count; i += 1) {
      const key = userKeys[i];
      promises.push(testUsers.create({count: 1, config: userInfo[key] || {}})
        .then((u) => storeUser(u, key)));
    }
    return Promise.all(promises);
  });

  return users;
}

/**
 * Creates our Back to the Future Test Users for group meeting tests
 * @returns {Object}
 */
export function setupGroupTestUsers() {
  return createTestUsers(3, {
    docbrown: {displayName: 'Emmett Brown'},
    lorraine: {displayName: 'Lorraine Baines'},
    marty: {displayName: 'Marty McFly'}
  });
}

/**
 * Creates our Star Trek Test Users for one on one meeting tests
 * @returns {Object}
 */
export function setupOneOnOneUsers() {
  return createTestUsers(2, {
    spock: {displayName: 'Mr Spock'},
    mccoy: {displayName: 'Bones Mccoy'}
  });
}

/**
 * Creates a space using the JS SDK
 * @param {Object} options
 * @param {Object} options.sparkInstance
 * @param {Object} options.participants
 * @param {Object} options.displayName
 * @returns {Object}
 */
export function createSpace({sparkInstance, participants, displayName}) {
  let space;
  browser.call(() => sparkInstance.internal.conversation.create({
    displayName,
    participants
  }).then((c) => {
    space = c;
    return space;
  }));

  return space;
}
