import '@ciscospark/plugin-authorization';
import '@ciscospark/internal-plugin-conversation';
import '@ciscospark/plugin-logger';

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';


/**
 * Creates a number of test users
 * @param {number} count number of users to generate
 * @param {Object} config with config to pass to test user creator
 * @returns {Object}
 */
export function createTestUsers(count, config) {
  let users;

  function storeUsers(u) {
    users = u.map((user) => {
      const spark = new CiscoSpark({
        credentials: {
          authorization: user.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return Object.assign({}, user, {
        spark
      });
    });
    return users;
  }

  browser.call(function createUsers() {
    return testUsers.create({count, config: config || {}})
      .then((u) => storeUsers(u));
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

export function registerDevices(users) {
  const promises = users.map((user) =>
    user.spark.internal.device.register());
  return browser.call(() => Promise.all(promises));
}
