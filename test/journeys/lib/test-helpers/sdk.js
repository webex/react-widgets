import '@ciscospark/plugin-authorization';
import '@ciscospark/internal-plugin-conversation';
import '@ciscospark/plugin-logger';

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';

const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJuYW1lIjoiR3Vlc3QgR3V5IiwiaXNzIjoiWTJselkyOXpjR0Z5YXpvdkwzVnpMMDlTUjBGT1NWcEJWRWxQVGk5aE9XWmlPVGc1WVMwNFpqUmlMVFJrTkRRdFlqSmpNaTFqWVRJeU5UYzVORGc1TnpBIn0.2wr7JrWyJyZ5-MXp5loO_4h-sgv6pSEMRn5FFNwvFEw';

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
  this.spark.request({
    method: 'POST',
    service: 'hydra',
    resource: 'jwt/login',
    headers: {
      authorization: jwt
    }
  }).then(({body}) => ({
    access_token: body.token,
    token_type: 'Bearer',
    expires_in: body.expiresIn
  }));

  function storeUser(u, key) {
    [users[key]] = u;
    users[key].spark = new CiscoSpark();
    users[key].spark.authorization.requestAccessTokenFromJwt({jwt});
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
