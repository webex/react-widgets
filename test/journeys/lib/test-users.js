import '@webex/plugin-authorization';
import '@webex/plugin-logger';
import '@webex/plugin-people';
import '@webex/plugin-rooms';
import '@webex/internal-plugin-conversation';

import CiscoSpark from '@webex/webex-core';
import {createUser as createGuestUser} from '@webex/test-helper-appid';
import testUsers from '@webex/test-helper-test-users';

import {deconstructHydraId} from './hydra';

/**
 * Creates and sets up a test user via jwt
 * @param {object} options
 * @param {string} options.displayName
 * @returns {Promise<object>}
 */
export function setupTestUserJwt({displayName}) {
  if (!(process.env.WEBEX_APPID_ORGID && process.env.WEBEX_APPID_SECRET)) {
    throw new Error('WEBEX_APPID_ORGID and WEBEX_APPID_SECRET are required to generate guest tokens');
  }

  return createGuestUser({displayName})
    .then(({jwt}) => {
      const guestSpark = new CiscoSpark({
        credentials: {
          federation: true
        }
      });

      return guestSpark.authorization.requestAccessTokenFromJwt({jwt}).then(() =>
        // We don't have a user id for guest users until a record is looked up
        guestSpark.people.get('me').then((p) => {
          const guestUser = Object.assign({}, p);
          // id is hydra from get people, but is expected to be a uuid
          const {id} = deconstructHydraId(p.id);

          guestUser.id = id;
          const email = p.emails[0];

          guestUser.email = email;
          guestUser.jwt = jwt;
          guestUser.spark = guestSpark;

          return guestUser;
        }));
    })
    .catch((e) => {
      console.error('Unable to create test user');
      console.error(e);
      throw (e);
    });
}

/**
 * Creates a number of test users
 * @param {number} count number of users to generate
 * @param {Array} config with config to pass to test user creator
 * @returns {Array}
 */
export function createTestUsers(count, config) {
  let users;

  if (config && count !== config.length) {
    throw new Error('Test user configuration count must match amount of test users or empty');
  }

  function storeUsers(u) {
    users = u.map((user) => {
      const spark = new CiscoSpark({
        credentials: {
          authorization: user.token,
          federation: true
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

  function createUsers() {
    const promises = [];
    const createdUsers = [];

    for (let i = 0; i < count; i += 1) {
      const userConfig = config ? config[i] : {};

      promises.push(testUsers.create({count: 1, config: userConfig}).then((usersArray) => {
        createdUsers.push(usersArray[0]);
      }));
    }

    return Promise.all(promises)
      .then(() => storeUsers(createdUsers))
      // Adding delay for test user creation propagation
      .then(() => new Promise((resolve) => {
        setTimeout(resolve, 3000);
      }));
  }

  browser.call(createUsers);

  // Wait for users to propogate
  browser.pause(3000);

  return users;
}

/**
 * Creates our Back to the Future Test Users for group meeting tests
 * @returns {Array}
 */
export function setupGroupTestUsers() {
  return createTestUsers(3, [
    {displayName: 'Emmett Brown'},
    {displayName: 'Lorraine Baines'},
    {displayName: 'Marty McFly'}
  ]);
}

/**
 * Creates our Star Trek Test Users for one on one meeting tests
 * @returns {Array}
 */
export function setupOneOnOneUsers() {
  return createTestUsers(2, [
    {displayName: 'Bones Mccoy'},
    {displayName: 'Mr Spock'}
  ]);
}

/**
 * Creates a space using the JS SDK
 *
 * @param {Object} options
 * @param {Object} options.sparkInstance
 * @param {Array} options.participants
 * @param {Object=} options.displayName
 * @returns {Object}
 */
export function createSpace({sparkInstance, participants, displayName}) {
  let space;

  browser.call(() => sparkInstance.internal.conversation.create({
    displayName,
    participants
  }).then((c) => {
    space = c;

    return sparkInstance.rooms.get(space);
  })
    .then((room) => {
      // Get the hydra ID for created space
      space.hydraId = room.id;
    }));

  return space;
}

/**
 * Sends a message to a space using the JS SDK
 * @param {Object} options
 * @param {Object} options.sparkInstance
 * @param {Object} options.space
 * @param {String} options.message
 * @returns {Object}
 */
export function sendMessage({sparkInstance, space, message}) {
  let activity;

  browser.call(() => sparkInstance.internal.conversation.post(space, {
    displayName: message,
    content: message
  }).then((a) => {
    activity = a;

    return activity;
  }));

  return activity;
}

/**
 * Async method for registering the devices of the test users
 * @param {Array} users
 * @returns {function}
 */
export function registerDevices(users) {
  const promises = users.map((user) =>
    user.spark.internal.device.register());

  return browser.call(() => Promise.all(promises));
}

/**
 * Async method for disconnecting the devices of the test users
 * @param {Array} users
 * @returns {function}
 */
export function disconnectDevices(users) {
  const promises = users.map((user) =>
    user.spark.internal.mercury.disconnect());

  return browser.call(() => Promise.all(promises));
}
